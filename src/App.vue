<script setup>
import Hero from './components/Hero.vue'
import Services from './components/Services.vue'
import Differentiator from './components/Differentiator.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <main class="flex-grow">
      <Hero />
      <Services />
      <Differentiator />
    </main>
    <Footer />
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}
</style>
