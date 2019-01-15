<template>
  <div id="nightlife-showtimes">
    <spinner :show="loading"></spinner>
    <div id="nightlife-showtimes-container">
      <h2>Tonight in the Planetarium</h2>
      <div id="empty-tab-item" tabindex="1"></div>
      <ul>
        <li class="active" v-for="show in shows" v-if="show.special_restriction === 'NightLife Event'">
          <div :key="'title' + '' + show.nid" class="title">{{show.title}}</div>
          <div v-html="show.body" :key="'body' + '' + show.nid" class="body"></div>
          <showtime v-for="(foo, index) in show.time_slots" :time="foo" :class="'iter-' + index" :key="foo"></showtime>
        </li>
      </ul>
      <footer>
        <div id="nl-pass-message">
          <p>
            <strong>Please arrive 15 minutes before showtime.</strong><br />
            No admittance after theater doors close.
          </p>
          <div class="access">
            <p>Please see attendant for accessible entrance.</p>
          </div>
        </div>
        <div id="nl-logo">
          <img class="btn-img-reload" src="~assets/nl-logo.png" />
        </div>
        <div class="nl-sponsor-tag">
          <p>NightLife is supported by the Koret Foundation.</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
var fetchJsonp = require('fetch-jsonp')
import Showtime from './Showtime'
import Spinner from './Spinner'

var intervalDataRefresh

export default {
  name: 'nightlife-showtimes',
  components: {
    Spinner,
    Showtime
  },
  data () {
    return {
      shows: null,
      loading: true,
      showsFresh: null,
      count: 0
    }
  },
  watch: {
    showsFresh: function (val, oldVal) {
      if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
        this.updateShowsData()
      }
    }
  },
  mounted: function () {
    document.getElementById('empty-tab-item').focus()
    document.addEventListener('keydown', this.onKeyPressEventManager, true)
  },
  created: function () {
    this.fetchData()
  },
  beforeDestroy: function () {
    clearInterval(intervalDataRefresh)
  },
  destroyed: function () {
    document.removeEventListener('keydown', this.onKeyPressEventManager, true)
  },
  methods: {
    incIter: function () {
      this.iter++
    },
    findNextTabStop: function (el) {
      var universe = document.getElementById('nightlife-showtimes').querySelectorAll('div')
      var list = Array.prototype.filter.call(universe, function (item) { return item.tabIndex >= 0 })
      var index = list.indexOf(el)
      return list[index + 1] || list[0]
    },
    findPreviousTabStop: function (el) {
      var universe = document.getElementById('nightlife-showtimes').querySelectorAll('div')
      var list = Array.prototype.filter.call(universe, function (item) { return item.tabIndex >= 0 })
      var index = list.indexOf(el)
      return list[index - 1] || list[0]
    },
    onKeyPressEventManager: function (event) {
      var currentFocus
      var el
      if (event.key === '+') {
        currentFocus = document.activeElement
        el = this.findNextTabStop(currentFocus)
        el.focus()
      } else if (event.key === '-') {
        currentFocus = document.activeElement
        el = this.findPreviousTabStop(currentFocus)
        el.focus()
      }
    },
    fetchData: function () {
      var self = this
      fetchJsonp(process.env.EVENTS_API_URL)
        .then(function (response) {
          return response.json()
        }).then(function (json) {
          // self.shows = json
          self.shows = self.mergeDuplicateShows(json)
          self.shows.sort(function (a, b) {
            return a.time_slots[0] > b.time_slots[0]
          })
          self.loading = false
          intervalDataRefresh = setInterval(() => self.refreshData(), (10000 * 1))
        }).catch(function (ex) {
          console.log('parsing failed', ex)
          setTimeout(function () {
            self.fetchData()
          }, 30000)
        })
    },
    refreshData: function () {
      if (navigator.onLine) {
        var self = this
        fetchJsonp(process.env.EVENTS_API_URL)
          .then(function (response) {
            return response.json()
          }).then(function (json) {
            // self.showsFresh = json
            self.showsFresh = self.mergeDuplicateShows(json)
            self.showsFresh.sort(function (a, b) {
              return a.time_slots[0] > b.time_slots[0]
            })
          }).catch(function (ex) {
            console.log('parsing failed', ex)
          })
      }
    },
    updateShowsData: function () {
      // this.shows = this.showsFresh
      // something changed
      var self = this
      // check for show level change
      // include existing show if in fresh data
      var foo = this.shows.filter(function (item) {
        return self.showsFresh.some(function (fresh) {
          return fresh.nid === item.nid
        })
      })
      this.shows = foo
      // add fresh show if not already existing
      foo = this.showsFresh.filter(function (fresh) {
        return self.shows.every(function (item) {
          return fresh.nid !== item.nid
        })
      })
      this.shows = this.shows.concat(foo)
      // check for showtime level change
      self.shows.forEach(function (a, i) {
        self.showsFresh.forEach(function (b) {
          if (a.nid === b.nid) {
            self.shows[i].time_slots = b.time_slots
            self.shows[i].title = b.title
            self.shows[i].body = b.body
          }
        })
      })
      self.shows.sort(function (a, b) {
        return a.time_slots[0] > b.time_slots[0]
      })
    },
    formatTime: function (t) {
      if (!t) return ''
      var strTime = ''
      var hours24 = parseInt(t.substring(0, 2), 10)
      var hours = ((hours24 + 11) % 12) + 1
      var minutes = t.substring(2)
      strTime += hours + '' + minutes
      return strTime
    },
    formatAMPM: function (t) {
      if (!t) return ''
      var hours24 = parseInt(t.substring(0, 2), 10)
      var amPm = hours24 > 11 ? ' PM' : ' AM'
      return amPm + ', '
    },
    formatAMPMLast: function (t) {
      if (!t) return ''
      var hours24 = parseInt(t.substring(0, 2), 10)
      var amPm = hours24 > 11 ? ' PM' : ' AM'
      return amPm
    },
    mergeDuplicateShows: function (arrShows) {
      // now get NightLife
      var arrShowsNightLife = arrShows.filter(function (item) {
        return (item.special_restriction === 'NightLife Event')
      })

      var uniqueShowsNightLife = []
      arrShowsNightLife.forEach(function (a) {
        arrShowsNightLife.forEach(function (b) {
          if ((a.title === b.title) && (a.nid !== b.nid)) {
            var ts = a.time_slots.concat(b.time_slots)
            ts.sort(function (x, y) {
              return x > y
            })
            if (uniqueShowsNightLife.every(function (test) {
              return test.title !== a.title
            })) {
              uniqueShowsNightLife.push(a)
              uniqueShowsNightLife[uniqueShowsNightLife.length - 1].time_slots = ts
            }
          }
        })
        if (uniqueShowsNightLife.every(function (test) {
          return test.title !== a.title
        })) {
          uniqueShowsNightLife.push(a)
        }
      })

      return uniqueShowsNightLife
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/_vars.scss";
#nightlife-showtimes {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  //background-color: $nl-bgcolor;
  background-image: url('~assets/nl-bg-gradient.png');
  background-repeat: no-repeat;
  background-position: 0 0;
  color: $nl-color-text;
  width: $screen-width;
  height: $screen-height;
  #nightlife-showtimes-container {
    padding: 68px 100px;
    max-height: 1180px;
    overflow: hidden;
    h1 {
      color: $nl-color-headers;
      font-size: $nl-font-size-h1;
      line-height: $nl-font-size-h1;
      font-weight: 300;
      span.header-strong {
        font-weight: 600;
      }
    }
    h2 {
      margin: 0 0 38px 0;
      color: $nl-color-headers;
      font-weight: 600;
      font-size: $nl-font-size-h2;
      line-height: $nl-font-size-h2 + 6;
    }
    ul {
      margin: 0;
      padding: 0;
      width: $screen-width - 260;
      display: inline-block;
    }
    li {
      display: block;
      margin: 0 20px 36px 0;
      padding: 0;
      width: $screen-width - 260;
      float: left;
      .title {
        font-style: oblique;
        color: $nl-color-headers;
        font-weight: 600;
        font-size: $nl-font-size-show-title;
        line-height: $nl-font-size-show-title + 4;
        margin-bottom: 13px;
        opacity: 0.2;
      }
      .body {
        color: $nl-color-text;
        margin-bottom: 30px;
        font-weight: 400;
        font-size: $nl-font-size-show-body;
        line-height: $nl-font-size-show-body + 8;
        width: 700px;
        opacity: 0.2;
      }
      div.showtime {
        :nth-child(3n) {
          border-color: #ff0000 !important;
        }
      }
    }
    li.active {
      .title, .body {
          opacity: 1.0;
      }
    }
    #empty-tab-item {
      height: 0;
      outline: none;
    }
    footer {
      position: fixed;
      bottom: 66px;
      h3 {
        font-weight: 600;
        font-size: $nl-footer-h3;
        line-height: $nl-footer-h3;
        color: $nl-color-headers;
        margin-bottom: 16px;
      }
      p {
        font-size: $nl-footer-p;
        line-height: $nl-footer-p + 8;
        color: $nl-color-headers;
        font-weight: 400;
        width: 800px;
        strong {
          font-weight: 500;
        }
      }
      #nl-logo {
        width: 340px;
        float: left;
        margin-top: 30px;
      }
      .nl-sponsor-tag {
        width: 500px;
        height: 200px;
        float: left;
        background-image: url('~assets/nl-branding.png');
        background-repeat: no-repeat;
        background-position: 0 0;
        p {
          font-size: $nl-sponsor-tag;
          line-height: $nl-sponsor-tag;
          color: $nl-color-text;
          font-weight: 500;
          margin-top: 150px;
        }
      }
      .access {
        margin-top: 40px;
        padding-left: 60px;
        height: 90px;
        background-image: url('~assets/wheelchair.png');
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: 4.5%;

      }
    }
  }
}
</style>
