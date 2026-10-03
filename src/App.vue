<script setup>
import Header from './components/Header.vue';
import Hero from './components/Hero.vue';
import ProjectsShowcase from './components/ProjectsShowcase.vue';
import Services from './components/Services.vue';
import TestimonialsSection from './components/TestimonialsSection.vue';
import AboutFounder from './components/AboutFounder.vue';
import ContactSection from './components/ContactSection.vue';
import Footer from './components/Footer.vue';
import WhatsAppButton from './components/WhatsAppButton.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col relative bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
    <Header />
    <main class="flex-grow">
      <Hero />
      <ProjectsShowcase />
      <Services />
      <TestimonialsSection />
      <AboutFounder />
      <ContactSection />
    </main>
    <Footer />
    <WhatsAppButton />
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}
</style>
