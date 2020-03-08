<template>
  <a-layout
    id="layout"
    class="layout"
  >
    <a-layout-header class="header">
      <div class="logo">
        一言审核员中心（Alpha）
      </div>
    </a-layout-header>
    <a-layout-content>
      <nuxt />
    </a-layout-content>
    <a-layout-footer class="mt-m footer">
      <div class="di-color cl colorful-line">
        <div class="di-color-a" />
        <div class="di-color-b" />
        <div class="di-color-c" />
        <div class="di-color-d" />
        <div class="di-color-e" />
      </div>
      MoeTeam ©2020 All Rights Reserved. Powered by ThinkJS & Nuxt.
    </a-layout-footer>
  </a-layout>
</template>
<style>
#layout {
  min-height: 100vh;
}

.logo {
  color: #fff;
  font-weight: 400;
  font-size: 1.4em;
}

.header {
  height: 4.2em;
  padding: 0 1rem;
  line-height: 4.2em;
  background-color: #343a40 !important;
}

.footer {
  padding: 15px 0;
  padding-top: 0;
  text-align: center;
  background-color: #fcfcfc;
  box-shadow: 0 20px 20px 8px #636363;
}

.colorful-line {
  margin-bottom: 14px;
}

.di-color {
  margin-top: 0;
}

.cl {
  zoom: 1;
}

.di-color div {
  float: left;
  width: 20%;
  height: 2px;
}

.di-color-a {
  background-color: #f92672;
}

.di-color-b {
  background-color: #fd971f;
}

.di-color-c {
  background-color: #8acf00;
}

.di-color-d {
  background-color: #0092ff;
}

.di-color-e {
  background-color: #ae74ac;
}

.ad {
  width: 73%;
  margin-bottom: 10px;
}
</style>
