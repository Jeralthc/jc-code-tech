<script setup>
import { LINKEDIN_URL } from '../siteConfig';
import { ref, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['openCrm']);

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

const linkedInUrl = LINKEDIN_URL;

// En el mismo orden que las secciones de la página.
const links = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#sistema-crm', label: 'Demo CRM' },
  { href: '#cotizador', label: 'Cotizador' },
  { href: '#nosotros', label: 'Sobre mí' },
  { href: '#faq', label: 'Preguntas' }
];
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
        <nav class="hidden lg:flex items-center gap-6">
          <a v-for="l in links" :key="l.href" :href="l.href" class="text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-cyan-400 transition-colors">{{ l.label }}</a>
          <a v-if="linkedInUrl" :href="linkedInUrl" target="_blank" rel="noopener noreferrer" class="text-slate-300 hover:text-blue-400 transition-colors" aria-label="LinkedIn">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        </nav>

        <!-- Right Buttons: Admin Access & Contact CTA -->
        <div class="hidden sm:flex items-center gap-3">
          <button 
            @click="emit('openCrm')"
            class="text-xs font-mono font-medium text-slate-400 hover:text-cyan-400 px-3 py-2 rounded-xl border border-slate-800 hover:border-cyan-500/30 bg-slate-900/80 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Área privada para gestión de proyectos y clientes"
          >
            <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Área Privada</span>
          </button>

          <a 
            href="#contacto" 
            class="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Contactar</span>
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
        <a v-for="l in links" :key="l.href" @click="closeMenu" :href="l.href" class="block text-slate-200 hover:text-cyan-400 py-1">{{ l.label }}</a>
        <a @click="closeMenu" href="#comentarios" class="block text-slate-200 hover:text-cyan-400 py-1">Opiniones</a>

        <button 
          @click="closeMenu(); emit('openCrm')"
          class="w-full text-left text-slate-400 hover:text-cyan-400 font-mono text-xs py-1 flex items-center gap-2 pt-2 border-t border-slate-800"
        >
          <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Área Privada (Gestión)</span>
        </button>
        <a @click="closeMenu" v-if="linkedInUrl" :href="linkedInUrl" target="_blank" class="block text-blue-400 py-1 flex items-center gap-1.5">
          <span>Perfil de LinkedIn</span>
        </a>
        <div class="pt-2 border-t border-slate-800">
          <a 
            @click="closeMenu"
            href="#contacto" 
            class="block w-full text-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-xs font-bold text-white shadow-lg"
          >
            Contactar
          </a>
        </div>
      </div>
    </transition>
  </header>
</template>
