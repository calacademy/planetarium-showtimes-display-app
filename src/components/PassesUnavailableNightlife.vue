<template>
  <div id="passes-unavailable-standby">
    <div id="passes-unavailable-standby-container">
      <h1>Planetarium show passes are sold out for tonight.</h1>
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
  //background-color: $nl-bgcolor;
  background-image: url('~assets/nl-bg-gradient.png');
  background-repeat: no-repeat;
  background-position: 0 0;
  width: $screen-width;
  height: $screen-height;
  #passes-unavailable-standby-container {
    padding: 250px 130px;
    h1 {
      font-size: $out-font-size-h1;
      line-height: $out-font-size-h1 + 16;
      font-weight: 600;
      color: $nl-color-headers;
    }
    p {
      margin-top: 80px;
      font-size: $out-font-size-p;
      line-height: $out-font-size-p + 10;
      font-weight: 400;
      color: $nl-color-text;
    }
  }
}
</style>
