<template>
  <div id="passes-unavailable-standby">
    <div id="passes-unavailable-standby-container">
      <h1>Planetarium showpasses are no longer available for the day.</h1>
      <p>
        Please check with a staff member about a standby line.
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../styles/_vars.scss";

#passes-unavailable-standby {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: $blue;
  width: $screen-width;
  height: $screen-height;
  #passes-unavailable-standby-container {
    padding: 250px 130px;
    h1 {
      font-size: $out-font-size-h1;
      line-height: $out-font-size-h1 + 16;
      font-weight: 600;
      color: $white;
    }
    p {
      margin-top: 80px;
      font-size: $out-font-size-p;
      line-height: $out-font-size-p + 10;
      font-weight: 400;
      color: $white;
    }
  }
}
</style>
