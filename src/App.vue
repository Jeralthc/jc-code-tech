<script setup>
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import Header from './components/Header.vue';
import Hero from './components/Hero.vue';
import PainPoints from './components/PainPoints.vue';
import ProjectsShowcase from './components/ProjectsShowcase.vue';
import CrmShowcase from './components/CrmShowcase.vue';
import Services from './components/Services.vue';
import Methodology from './components/Methodology.vue';
import ProjectConfigurator from './components/ProjectConfigurator.vue';
import Faq from './components/Faq.vue';
import CrmLoginModal from './components/CrmLoginModal.vue';
import ReviewsSection from './components/ReviewsSection.vue';
import AboutFounder from './components/AboutFounder.vue';
import ContactSection from './components/ContactSection.vue';
import Footer from './components/Footer.vue';
import WhatsAppButton from './components/WhatsAppButton.vue';
import { getSession, onAuthChange, signOut } from './crm/auth';
import { viewFromSlug, slugFromView } from './crm/ui';

// El CRM se carga aparte para no hacer más pesada la landing.
const CrmApp = defineAsyncComponent(() => import('./components/crm/CrmApp.vue'));

// Rutas: #demo[/vista] (demo pública) y #crm[/vista] (espacio privado con login).
const mode = ref('public'); // 'public' | 'crm'
const workspace = ref('demo');
const view = ref('dashboard');
const session = ref(null);
const showLogin = ref(false);
const recovery = ref(false);

const parseHash = () => {
  const [root, slug] = window.location.hash.replace(/^#/, '').split('/');
  return { root, view: viewFromSlug(slug) };
};

const route = () => {
  const { root, view: v } = parseHash();
  if (root === 'demo') {
    workspace.value = 'demo';
    view.value = v;
    mode.value = 'crm';
    showLogin.value = false;
  } else if (root === 'crm') {
    if (session.value) {
      workspace.value = 'private';
      view.value = v;
      mode.value = 'crm';
      showLogin.value = false;
    } else {
      mode.value = 'public';
      showLogin.value = true;
    }
  } else {
    mode.value = 'public';
  }
};

const setHash = (hash) => {
  if (window.location.hash === hash) route();
  else window.location.hash = hash;
};
const openAccess = () => {
  if (session.value) setHash('#crm');
  else showLogin.value = true;
};
const openDemo = () => {
  showLogin.value = false;
  setHash('#demo');
};
const onLogin = (s) => {
  session.value = s;
  setHash('#crm');
};
const onRecovered = () => {
  recovery.value = false;
  setHash('#crm');
};
const onNavigate = (v) => {
  const root = workspace.value === 'demo' ? 'demo' : 'crm';
  const hash = v === 'dashboard' ? `#${root}` : `#${root}/${slugFromView(v)}`;
  if (window.location.hash !== hash) history.pushState(null, '', hash);
  view.value = v;
};
const exitCrm = () => {
  history.pushState(null, '', window.location.pathname);
  mode.value = 'public';
  window.scrollTo({ top: 0 });
};
const logout = async () => {
  await signOut();
  session.value = null;
  exitCrm();
};
const closeLogin = () => {
  showLogin.value = false;
  recovery.value = false;
  if (parseHash().root === 'crm') history.replaceState(null, '', window.location.pathname);
};

let unsubscribe = null;
onMounted(async () => {
  window.addEventListener('hashchange', route);
  window.addEventListener('popstate', route);
  unsubscribe = onAuthChange((event, s) => {
    session.value = s;
    if (event === 'PASSWORD_RECOVERY') {
      recovery.value = true;
      showLogin.value = true;
    }
    if (event === 'SIGNED_OUT' && workspace.value === 'private' && mode.value === 'crm') exitCrm();
  });
  session.value = await getSession();
  route();
});
onUnmounted(() => {
  window.removeEventListener('hashchange', route);
  window.removeEventListener('popstate', route);
  unsubscribe?.();
});
</script>

<template>
  <div>
    <CrmApp
      v-if="mode === 'crm'"
      :key="workspace + (session?.user?.id || '')"
      :workspace="workspace"
      :view="view"
      :user="workspace === 'private' ? session?.user : null"
      @navigate="onNavigate"
      @exit="exitCrm"
      @logout="logout"
    />

    <div v-else class="min-h-screen flex flex-col relative bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Header @openCrm="openAccess" />
      <main class="flex-grow">
        <Hero />
        <PainPoints />
        <ProjectsShowcase />
        <CrmShowcase @openDemo="openDemo" />
        <Services />
        <Methodology />
        <ProjectConfigurator />
        <Faq />
        <ReviewsSection />
        <AboutFounder />
        <ContactSection />
      </main>
      <Footer @openCrm="openAccess" />
      <WhatsAppButton />
    </div>

    <CrmLoginModal
      :isOpen="showLogin"
      :recovery="recovery"
      @close="closeLogin"
      @loginSuccess="onLogin"
      @openDemo="openDemo"
      @recovered="onRecovered"
    />
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}
</style>
