<template>
  <div id="logo">
    <div id="logo-container">
      <img src="~assets/logo.png" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../styles/_vars.scss";

#logo {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: $blue;
  width: $screen-width;
  height: $screen-height;
  #logo-container {
    margin-top: ($screen-height - $logo-height) / 2;
    margin-left: ($screen-width - $logo-width) / 2;
    img {
      width: $logo-width;
      height: $logo-height;
      border: none;
      outline: none;
    }

  }
}
</style>
