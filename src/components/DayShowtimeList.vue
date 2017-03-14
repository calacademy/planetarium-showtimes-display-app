<template>
  <div id="day-showtime-list">
    <spinner :show="loading"></spinner>
    <div id="day-showtime-list-container">
      <h1>Available Showtimes Today</h1>
      <div id="empty-tab-item" tabindex="1"></div>
      <ul>
        <li class="active" v-for="show in shows" v-if="((show.special_restriction === 'School Groups Only')
        || (show.special_restriction === 'Member Event'))" :key="show">
          <div class="special-restriction">{{show.special_restriction}}</div>
          <div :key="show.nid" class="title highlight">{{show.title}}</div>
          <showtime v-for="(foo, index) in show.time_slots" :time="foo" :class="'iter-' + index" :key="foo"></showtime>
        </li>
      </ul>
      <ul>
        <li class="active" v-for="show in shows" v-if="((show.special_restriction !== 'School Groups Only')
        && (show.special_restriction !== 'Member Event')
        && (show.special_restriction !== 'NightLife Event'))" :key="show">
          <div :key="show.nid" class="title">{{show.title}}</div>
          <showtime v-for="(foo, index) in show.time_slots" :time="foo" :class="'iter-' + index" :key="foo"></showtime>
        </li>
      </ul>
      <footer>
        <p>
          <strong>Please arrive 15 minutes before showtime.</strong><br />
          No admittance after theater doors close.<br />
          Showpasses are distributed on a first-come, first-served basis.
        </p>
        <p>
          <em><strong>Members:</strong> Inquire about Members-Only passes!</em>
        </p>
        <div class="access">
          <p>Please see attendant for accessible entrance.</p>
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
  name: 'day-showtime-list',
  components: {
    Showtime,
    Spinner
  },
  data () {
    return {
      shows: null,
      loading: true,
      showsFresh: null
    }
  },
  watch: {
    showsFresh: function (val, oldVal) {
      if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
        this.updateShowsData()
      }
    }
  },
  created: function () {
    this.fetchData()
  },
  mounted: function () {
    document.getElementById('empty-tab-item').focus()
    document.addEventListener('keydown', this.onKeyPressEventManager, true)
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
      var universe = document.getElementById('day-showtime-list').querySelectorAll('div')
      var list = Array.prototype.filter.call(universe, function (item) { return item.tabIndex >= 0 })
      var index = list.indexOf(el)
      return list[index + 1] || list[0]
    },
    findPreviousTabStop: function (el) {
      var universe = document.getElementById('day-showtime-list').querySelectorAll('div')
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
    getShowtimeStates: function () {
      if (this.$el) {
        console.log(this.$el)
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
          }
        })
      })
      self.shows.sort(function (a, b) {
        return a.time_slots[0] > b.time_slots[0]
      })
    },
    mergeDuplicateShows: function (arrShows) {
      // start with special entries (not including NightLife)
      var arrShowsSpecial = arrShows.filter(function (item) {
        return ((item.special_restriction === 'Member Event') ||
        (item.special_restriction === 'School Groups Only'))
      })

      // now get non-special shows
      var arrShowsNonSpecial = arrShows.filter(function (item) {
        return ((item.special_restriction !== 'Member Event') &&
        (item.special_restriction !== 'School Groups Only') &&
        (item.special_restriction !== 'NightLife Event'))
      })

      var uniqueShowsNonSpecial = []
      arrShowsNonSpecial.forEach(function (a) {
        arrShowsNonSpecial.forEach(function (b) {
          if ((a.title === b.title) && (a.nid !== b.nid)) {
            var ts = a.time_slots.concat(b.time_slots)
            ts.sort(function (x, y) {
              return x > y
            })
            if (uniqueShowsNonSpecial.every(function (test) {
              return test.title !== a.title
            })) {
              uniqueShowsNonSpecial.push(a)
              uniqueShowsNonSpecial[uniqueShowsNonSpecial.length - 1].time_slots = ts
            }
          }
        })
        if (uniqueShowsNonSpecial.every(function (test) {
          return test.title !== a.title
        })) {
          uniqueShowsNonSpecial.push(a)
        }
      })

      return arrShowsSpecial.concat(uniqueShowsNonSpecial)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/_vars.scss";
#day-showtime-list {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: $blue;
  width: $screen-width;
  height: $screen-height;
  #day-showtime-list-container {
    padding: 130px;
    max-height: 1260px;
    overflow: hidden;
    h1 {
      font-size: $font-size-h1;
      line-height: $font-size-h1;
      font-weight: 500;
      color: $white;
      text-transform: uppercase;
      letter-spacing: .15em;
      padding-bottom: 92px;
      margin-top: 12px;
    }
    ul {
      margin: 0;
      padding: 0;
      width: $screen-width - 260;
      display: inline-block;
    }
    li {
      display: block;
      margin: 0 20px 14px 0;
      padding: 0;
      width: $screen-width - 260;
      float: left;
      .special-restriction {
        margin-bottom: 7px;
        font-weight: 600;
        font-size: $font-size-show-special-restriction;
        line-height: $font-size-show-special-restriction;
        color: $white;
        opacity: 0.2;
      }
      .title {
        margin-bottom: 18px;
        font-weight: 600;
        font-size: $font-size-show-title;
        line-height: $font-size-show-title + 6;
        color: $white;
        opacity: 0.2;
        white-space: nowrap;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }
      div.showtime {
        :nth-child(3n) {
          border-color: #ff0000 !important;
        }
      }
    }
    li.active {
      .special-restriction {
          opacity: 1.0;
          color: $blue-highlight-dark;
      }
      .title {
          opacity: 1.0;
      }
      .highlight {
        color: $blue-highlight-light !important;
      }
    }
    #empty-tab-item {
      height: 0;
      outline: none;
    }
    footer {
      position: fixed;
      bottom: 24px;
      p {
        font-size: $font-size-footer;
        line-height: $font-size-footer + 8;
        color: $white;
        font-weight: 400;
        margin-bottom: 36px;
        width: 800px;
        em {
          font-style: oblique;
        }
        strong {
          font-weight: 600;
        }
      }
      .access {
        margin-top: 46px;
        margin-bottom: 27px;
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
