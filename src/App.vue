<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Header from './components/Header.vue';
import Hero from './components/Hero.vue';
import PainPoints from './components/PainPoints.vue';
import ProjectsShowcase from './components/ProjectsShowcase.vue';
import Services from './components/Services.vue';
import Methodology from './components/Methodology.vue';
import ProjectConfigurator from './components/ProjectConfigurator.vue';
import Faq from './components/Faq.vue';
import CrmWorkspace from './components/CrmWorkspace.vue';
import CrmLoginModal from './components/CrmLoginModal.vue';
import ReviewsSection from './components/ReviewsSection.vue';
import AboutFounder from './components/AboutFounder.vue';
import ContactSection from './components/ContactSection.vue';
import Footer from './components/Footer.vue';
import WhatsAppButton from './components/WhatsAppButton.vue';

// Mode: 'public' | 'crm'
const currentMode = ref('public');
const showLoginModal = ref(false);

const requestCrmAccess = () => {
  const isAuth = localStorage.getItem('jc_crm_auth') === 'true';
  if (isAuth) {
    currentMode.value = 'crm';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    showLoginModal.value = true;
  }
};

const handleLoginSuccess = () => {
  showLoginModal.value = false;
  currentMode.value = 'crm';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const exitCrm = () => {
  currentMode.value = 'public';
  history.replaceState(null, null, ' ');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const checkRouteMode = () => {
  if (window.location.hash === '#crm') {
    requestCrmAccess();
  } else {
    currentMode.value = 'public';
  }
};

onMounted(() => {
  checkRouteMode();
  window.addEventListener('hashchange', checkRouteMode);
});

onUnmounted(() => {
  window.removeEventListener('hashchange', checkRouteMode);
});
</script>

<template>
  <div>
    <!-- Dedicated Full-Screen Enterprise CRM Suite -->
    <div v-if="currentMode === 'crm'">
      <CrmWorkspace @exitCrm="exitCrm" />
    </div>

    <!-- Public High-Converting Sales Landing Page -->
    <div v-else class="min-h-screen flex flex-col relative bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Header @openCrm="requestCrmAccess" />
      <main class="flex-grow">
        <Hero />
        <PainPoints />
        <ProjectsShowcase />
        <Services />
        <Methodology />
        <ProjectConfigurator />
        <Faq />
        <ReviewsSection />
        <AboutFounder />
        <ContactSection />
      </main>
      <Footer @openCrm="requestCrmAccess" />
      <WhatsAppButton />

      <!-- CRM Login Modal with Credentials & Quick Demo Login -->
      <CrmLoginModal 
        :isOpen="showLoginModal" 
        @close="showLoginModal = false" 
        @loginSuccess="handleLoginSuccess" 
      />
    </div>
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}
</style>
