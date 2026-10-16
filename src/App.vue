<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Header from './components/Header.vue';
import Hero from './components/Hero.vue';
import ProjectsShowcase from './components/ProjectsShowcase.vue';
import Services from './components/Services.vue';
import ProjectConfigurator from './components/ProjectConfigurator.vue';
import CrmWorkspace from './components/CrmWorkspace.vue';
import ReviewsSection from './components/ReviewsSection.vue';
import AboutFounder from './components/AboutFounder.vue';
import ContactSection from './components/ContactSection.vue';
import Footer from './components/Footer.vue';
import WhatsAppButton from './components/WhatsAppButton.vue';

// Mode: 'public' | 'crm'
const currentMode = ref('public');

const checkRouteMode = () => {
  if (window.location.hash === '#crm') {
    currentMode.value = 'crm';
  } else {
    currentMode.value = 'public';
  }
};

const enterCrm = () => {
  currentMode.value = 'crm';
  window.location.hash = '#crm';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const exitCrm = () => {
  currentMode.value = 'public';
  history.replaceState(null, null, ' ');
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <Header @openCrm="enterCrm" />
      <main class="flex-grow">
        <Hero />
        <ProjectsShowcase />
        <Services />
        <ProjectConfigurator />
        
        <!-- Executive CRM Workspace Access Banner -->
        <section class="py-12 bg-slate-900/40 border-y border-slate-800/80">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-cyan-500/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
              <div class="space-y-2 text-center lg:text-left">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider">
                  <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>JC STUDIO OS // SUITE OPERATIVA PRIVADA</span>
                </div>
                <h3 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Portal CRM &amp; Gestión Integral de Proyectos
                </h3>
                <p class="text-xs sm:text-sm text-slate-400 max-w-2xl">
                  Acceso exclusivo para administrar cartera de clientes, hitos técnicos de proyectos activos, emitir presupuestos proforma en PDF y supervisar balances comerciales.
                </p>
              </div>
              
              <button
                @click="enterCrm"
                class="px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-105 flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <span>Acceder a Mi Portal CRM</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </section>

        <ReviewsSection />
        <AboutFounder />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}
</style>
