<template>
  <div id="passes-unavailable">
    <div id="passes-unavailable-container">
      <h1>Planetarium showpasses are no longer available for the day.</h1>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../styles/_vars.scss";

#passes-unavailable {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: $blue;
  width: $screen-width;
  height: $screen-height;
  #passes-unavailable-container {
    padding: 250px 130px;
    h1 {
      font-size: $out-font-size-h1;
      line-height: $out-font-size-h1 + 16;
      font-weight: 600;
      color: $white;
    }
  }
}
</style>
