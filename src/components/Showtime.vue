<template>
  <div @keyup.enter="changeState" @click="changeState" :class="{ active: isActive }" class="showtime" tabindex="1">
    <span v-html="formatTime(time)"></span><span class="ampm" v-html="formatAMPM(time)"></span>
  </div>
</template>

<script>
export default {
  name: 'showtime',
  data () {
    return {
      isActive: true,
      isForced: false
    }
  },
  props: ['time'],
  methods: {
    changeState: function () {
      this.isActive ? this.isActive = false : this.isActive = true
      this.isForced = true
    },
    autoChangeByCurrentTime: function () {
      var date = new Date()
      var hours = date.getHours()
      var minutes = date.getMinutes() + 3 // times expire 2 minutes before
      var now = hours + ':' + minutes
      var showtime = Date.parse('01/01/2001 ' + this.time + ':00')
      now = Date.parse('01/01/2001 ' + now + ':00')
      if (this.isForced === false) {
        if (showtime < now) {
          this.isActive = false
        } else {
          this.isActive = true
        }
      }
    },
    checkStateOfOtherTimesForSameShow: function (newState) {
      if (this.$el) {
        var listItem = this.$el.parentNode
        if (listItem) {
          var others = listItem.childNodes
          var activeCount = 0
          others.forEach(function (el) {
            if (('' + el.className + '').indexOf('showtime') > -1) {
              if (('' + el.className + '').indexOf('active') > -1) {
                activeCount++
              }
            }
          })
          // newState is breaking isActive state for this showtime
          // listItem here is the parent showtime container w/ title
          // activeCount is for count of active sibling + self showtimes
          // prior to state change of self showtime
          if (newState === true) {
            this.activateShowHeaders(listItem)
          } else if (newState === false) {
            if (activeCount < 2) {
              this.deactivateShowHeaders(listItem)
            } else {
              this.activateShowHeaders(listItem)
            }
          } else {
            if (activeCount < 1) {
              this.deactivateShowHeaders(listItem)
            }
          }
        }
      }
    },
    activateShowHeaders: function (el) {
      el.className = 'active'
    },
    deactivateShowHeaders: function (el) {
      el.className = ''
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
      return amPm
    }
  },
  watch: {
    isActive: function (val, oldVal) {
      this.checkStateOfOtherTimesForSameShow(val)
    },
    props: function (val, oldVal) {
      // if this showtime changes via CMS, clear prior manual state change
      this.isForced = false
    }
  },
  created: function () {
    this.intervalChangeByTime = setInterval(() => this.autoChangeByCurrentTime(), (10000 * 1))
    this.intervalOtherTimes = setInterval(() => this.checkStateOfOtherTimesForSameShow(), (10000 * 1))
  },
  mounted: function () {
    this.autoChangeByCurrentTime()
    this.checkStateOfOtherTimesForSameShow(true)
  },
  beforeDestroy: function () {
    clearInterval(this.intervalOtherTimes)
    clearInterval(this.intervalChangeByTime)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../styles/_vars.scss";

div {
  width: 236px;
  padding: 15px 0 20px 0;
  font-weight: 500;
  font-size: $font-size-showtime;
  line-height: $font-size-showtime;
  border: 2px solid;
  border-color: $white;
  margin-bottom: 27px;
  margin-right: 45px;
  color: $white;
  opacity: 0.2;
  text-align: center;
  float: left;
}
div.active {
  opacity: 1.0;
}
div:focus {
  outline: none;
  background-color: $orange;
}
.ampm {
  font-size: $font-size-ampm;
  line-height: $font-size-ampm;
}
.iter-2, .iter-5, .iter-8, .iter-11, .iter-14, .iter-17 {
  margin-right: 0 !important;
}
</style>
