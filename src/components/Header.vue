<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);
const mobileMenuOpen = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const closeMenu = () => {
  mobileMenuOpen.value = false;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const linkedInUrl = 'https://www.linkedin.com/public-profile/settings/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_self_edit_contact_info%3BYvU0JnRKSNi6Tv%2B03l%2FOdg%3D%3D';
const whatsappUrl = 'https://wa.me/584247130583?text=Hola%20Jeralth,%20deseo%20solicitar%20un%20diagn%C3%B3stico%20t%C3%A9cnico%20para%20mi%20negocio.';
</script>

<template>
  <header 
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'py-3' : 'py-5'
    ]"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div 
        :class="[
          'rounded-2xl px-5 py-3 flex items-center justify-between transition-all duration-300',
          isScrolled ? 'glass-nav shadow-[0_10px_30px_rgba(0,0,0,0.6)]' : 'bg-slate-900/70 backdrop-blur-md border border-white/10'
        ]"
      >
        <!-- Logo -->
        <a href="#" class="flex items-center gap-2.5 group">
          <div class="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
            JC
          </div>
          <span class="text-lg font-extrabold tracking-tight text-white">
            JC Code <span class="text-cyan-400 font-mono">&amp;</span> Tech
          </span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center gap-7">
          <a href="#servicios" class="text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-cyan-400 transition-colors">Servicios</a>
          <a href="#nosotros" class="text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-cyan-400 transition-colors">Sobre Mí</a>
          <a href="#metodologia" class="text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-cyan-400 transition-colors">Cómo Trabajamos</a>
          <a href="#faq" class="text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-cyan-400 transition-colors">Preguntas</a>
          <a :href="linkedInUrl" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-blue-400 flex items-center gap-1 transition-colors">
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            <span>LinkedIn</span>
          </a>
        </nav>

        <!-- Right CTA Button -->
        <div class="hidden sm:flex items-center gap-3">
          <a 
            :href="whatsappUrl" 
            target="_blank"
            class="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Diagnóstico Gratuito</span>
          </a>
        </div>

        <!-- Mobile Menu Toggle -->
        <button 
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="lg:hidden text-slate-300 hover:text-cyan-400 p-1.5 rounded-lg focus:outline-none"
          aria-label="Abrir menú"
        >
          <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div 
        v-if="mobileMenuOpen" 
        class="lg:hidden mx-4 mt-3 rounded-2xl glass-nav p-5 border border-white/10 shadow-2xl space-y-4 text-sm"
      >
        <a @click="closeMenu" href="#servicios" class="block text-slate-200 hover:text-cyan-400 py-1">Servicios</a>
        <a @click="closeMenu" href="#nosotros" class="block text-slate-200 hover:text-cyan-400 py-1">Sobre Mí</a>
        <a @click="closeMenu" href="#metodologia" class="block text-slate-200 hover:text-cyan-400 py-1">Cómo Trabajamos</a>
        <a @click="closeMenu" href="#faq" class="block text-slate-200 hover:text-cyan-400 py-1">Preguntas Frecuentes</a>
        <a @click="closeMenu" :href="linkedInUrl" target="_blank" class="block text-blue-400 py-1 flex items-center gap-1.5">
          <span>Perfil de LinkedIn</span>
        </a>
        <div class="pt-2 border-t border-slate-800">
          <a 
            :href="whatsappUrl" 
            target="_blank"
            class="block w-full text-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-xs font-bold text-white shadow-lg"
          >
            Contactar por WhatsApp (+58 424-7130583)
          </a>
        </div>
      </div>
    </transition>
  </header>
</template>
