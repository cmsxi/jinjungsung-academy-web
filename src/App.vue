<template>
  <div id="app">
    <Header />
    <main class="content">
      <router-view />
    </main>
    <Footer />
    <QuickCall />
  </div>
</template>

<script setup>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import QuickCall from "./components/QuickCall.vue";
</script>

<style>
#app {
  min-height: 100vh;
}

.content {
  min-height: 100vh;
  padding-top: var(--header-height);
}
</style>
