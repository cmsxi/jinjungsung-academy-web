<template>
  <div id="app">
    <Header />
    <main class="content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

</script>

<style>
#app {
  min-height: 100vh;
}

.content {
  min-height: 100vh;
}
</style>