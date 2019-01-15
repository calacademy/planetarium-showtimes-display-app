<template>
  <div class="loader-mask" :class="{ show: show }" v-show="show">
    <transition>
      <svg class="spinner" :class="{ show: show }" v-show="show" width="50px" height="50px" viewBox="0 0 50 50">
        <circle class="path" fill="none" stroke-width="8" stroke-linecap="round" cx="25" cy="25" r="16"></circle>
      </svg>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'spinner',
  props: ['show'],
  serverCacheKey: props => props.show
}
</script>

<style lang="scss" scoped>
@import "../styles/_vars.scss";
$offset: 126;
$duration: 1.4s;
.loader-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: $screen-width;
  height: $screen-height;
  background-color: #000;
  opacity: 0.8;
  z-index: 1000;
  .spinner {
    margin-top: (($screen-height - 25) / 2);
    margin-left: (($screen-width - 25) / 2);
    transition: opacity .15s ease;
    animation: rotator $duration linear infinite;
    animation-play-state: paused;
    &.show {
      animation-play-state: running;
      opacity: .8;
    }
    &.v-enter, &.v-leave-active {
      opacity: 0;
    }
    &.v-enter-active, &.v-leave {
      opacity: .8;
    }
  }
  @keyframes rotator {
    0% {
      transform: scale(1.5) rotate(0deg);
    }
    100% {
      transform: scale(1.5) rotate(270deg);
    }
  }

  .spinner {
    .path {
      stroke: $white;
      stroke-dasharray: $offset;
      stroke-dashoffset: 0;
      transform-origin: center;
      animation: dash $duration ease-in-out infinite;
    }
  }

  @keyframes dash {
    0% {
      stroke-dashoffset: $offset;
    }
    50% {
      stroke-dashoffset: ($offset/2);
      transform: rotate(135deg);
    }
    100% {
      stroke-dashoffset: $offset;
      transform: rotate(450deg);
    }
  }
}

</style>
