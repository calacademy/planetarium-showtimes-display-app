<template>
  <div id="app">
    <div id="app-background" @click="hideComponents()"></div>
    <div id="nav" v-if="showNav">
      <div id="nav-container">
        <div
          tabindex="1"
          @keyup.enter="revealComponent('Logo')"
          @click="revealComponent('Logo')"
          class="menu-button">
          <img class="logo" src="~assets/btn-logo.png" />
        </div>
        <div
          tabindex="2"
          @keyup.enter="revealComponent('DayShowtimeList')"
          @click="revealComponent('DayShowtimeList')"
          class="menu-button">
          <span>Daytime Showtimes<br />
          <img class="btn-img-reload" src="~assets/btn-reload.png" /></span>
        </div>
        <div
          tabindex="3"
          @keyup.enter="revealComponent('PassesUnavailable')"
          @click="revealComponent('PassesUnavailable')"
          class="menu-button">
          <span>Showpasses no longer available</span>
        </div>
        <div
          tabindex="4"
          @keyup.enter="revealComponent('PassesUnavailableStandby')"
          @click="revealComponent('PassesUnavailableStandby')"
          class="menu-button">
          <span>Showpasses no longer available w/ standby</span>
        </div>
        <div
          tabindex="5"
          @keyup.enter="revealComponent('NightlifeShowtimes')"
          @click="revealComponent('NightlifeShowtimes')"
          class="menu-button">
          <span>NightLife Showtimes<br />
          <img class="btn-img-reload" src="~assets/btn-reload.png" /></span>
        </div>
        <div
          tabindex="6"
          @keyup.enter="revealComponent('PassesUnavailableNightlife')"
          @click="revealComponent('PassesUnavailableNightlife')"
          class="menu-button">
          <span>NightLife showpasses no longer available</span>
        </div>
      </div>
    </div>
    <day-showtime-list v-if="showDayShowtimeList"></day-showtime-list>
    <nightlife-showtimes v-if="showNightlifeShowtimes"></nightlife-showtimes>
    <logo v-if="showLogo"></logo>
    <passes-unavailable v-if="showPassesUnavailable"></passes-unavailable>
    <passes-unavailable-standby v-if="showPassesUnavailableStandby"></passes-unavailable-standby>
    <passes-unavailable-nightlife v-if="showPassesUnavailableNightlife"></passes-unavailable-nightlife>
  </div>
</template>

<script>
import DayShowtimeList from './components/DayShowtimeList'
import NightlifeShowtimes from './components/NightlifeShowtimes'
import Logo from './components/Logo'
import PassesUnavailable from './components/PassesUnavailable'
import PassesUnavailableStandby from './components/PassesUnavailableStandby'
import PassesUnavailableNightlife from './components/PassesUnavailableNightlife'

export default {
  name: 'app',
  components: {
    DayShowtimeList,
    NightlifeShowtimes,
    Logo,
    PassesUnavailable,
    PassesUnavailableStandby,
    PassesUnavailableNightlife
  },
  data () {
    return {
      showNav: true,
      showDayShowtimeList: false,
      showNightlifeShowtimes: false,
      showLogo: false,
      showPassesUnavailable: false,
      showPassesUnavailableStandby: false,
      showPassesUnavailableNightlife: false
    }
  },
  created: function () {
    document.addEventListener('keyup', this.onKeyPressEventManager, true)
    this.intervalNightlifeLaunch = setInterval(() => this.autoNightlifeLaunch(), (10000 * 1))
    this.revealComponent('DayShowtimeList')
  },
  methods: {
    onKeyPressEventManager: function (event) {
      if (event.key === '7') {
        this.hideComponents()
      }
      if (this.showNav === true) {
        var currentFocus
        var el
        if (event.key === '+') {
          currentFocus = document.activeElement
          el = this.findNextTabStop(currentFocus)
          if (el) el.focus()
        } else if (event.key === '-') {
          currentFocus = document.activeElement
          el = this.findPreviousTabStop(currentFocus)
          if (el) el.focus()
        }
      }
    },
    findNextTabStop: function (el) {
      var universe = document.querySelectorAll('div.menu-button')
      var list = Array.prototype.filter.call(universe, function (item) { return item.tabIndex >= 0 })
      var index = list.indexOf(el)
      return list[index + 1] || list[0]
    },
    findPreviousTabStop: function (el) {
      var universe = document.querySelectorAll('div.menu-button')
      var list = Array.prototype.filter.call(universe, function (item) { return item.tabIndex >= 0 })
      var index = list.indexOf(el)
      return list[index - 1] || list[0]
    },
    hideComponents: function () {
      this.showDayShowtimeList = false
      this.showNightlifeShowtimes = false
      this.showLogo = false
      this.showPassesUnavailable = false
      this.showPassesUnavailableStandby = false
      this.showPassesUnavailableNightlife = false
      this.showNav = true
    },
    revealComponent: function (comp) {
      switch (comp) {
        case 'DayShowtimeList':
          this.showDayShowtimeList = true
          break
        case 'NightlifeShowtimes':
          this.showNightlifeShowtimes = true
          break
        case 'Logo':
          this.showLogo = true
          break
        case 'PassesUnavailable':
          this.showPassesUnavailable = true
          break
        case 'PassesUnavailableStandby':
          this.showPassesUnavailableStandby = true
          break
        case 'PassesUnavailableNightlife':
          this.showPassesUnavailableNightlife = true
          break
      }
      this.showNav = false
    },
    autoNightlifeLaunch: function () {
      var date = new Date()
      var day = date.getDay()
      var hour = date.getHours()
      var minutes = date.getMinutes()
      if ((day === 4) && (hour === 17) && (minutes > 14)) {
        clearInterval(this.intervalNightlifeLaunch)
        this.revealComponent('NightlifeShowtimes')
      }
    }
  }
}
</script>

<style src="./styles/global.scss" lang="scss"></style>
