<script setup>
import { 
  SparklesIcon, 
  MapPinIcon, 
  ArrowRightIcon,
  CheckBadgeIcon
} from '@heroicons/vue/24/outline';

const linkedInUrl = 'https://www.linkedin.com/public-profile/settings/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_self_edit_contact_info%3BYvU0JnRKSNi6Tv%2B03l%2FOdg%3D%3D';
</script>

<template>
  <section id="nosotros" class="py-16 bg-slate-950 relative border-t border-slate-800/80">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="service-card rounded-3xl p-6 sm:p-10 border border-slate-800 bg-slate-900/60 shadow-xl relative overflow-hidden">
        
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          
          <!-- Avatar / Brand Badge -->
          <div class="shrink-0 text-center">
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <div class="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-cyan-400 font-mono font-extrabold text-2xl sm:text-3xl">
                JC
              </div>
            </div>
            <div class="mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-3xs font-mono font-semibold">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Activo en Mérida</span>
            </div>
          </div>

          <!-- Bio & Pitch -->
          <div class="space-y-4 text-center sm:text-left flex-grow">
            <div>
              <div class="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-semibold mb-1">
                <SparklesIcon class="w-3.5 h-3.5" />
                <span>Sobre Mí</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-white">
                Jeralth Contreras
              </h2>
              <p class="text-xs sm:text-sm text-cyan-300/90 font-medium">
                Analista de Soporte TI &bull; Desarrollador Web Full-Stack
              </p>
            </div>

            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans font-normal">
              Ayudo a comercios y empresas a resolver sus cuellos de botella tecnológicos. Conecto el mundo físico (soporte práctico a cajas con <strong class="text-white font-semibold">Stellar POS</strong>, terminales e instalación de cables de red) con el mundo digital (desarrollo web a medida en <strong class="text-white font-semibold">PHP, Laravel y Vue.js</strong>, bases de datos y respaldos seguros).
            </p>

            <!-- Stack Badges -->
            <div class="flex flex-wrap justify-center sm:justify-start gap-1.5 font-mono text-3xs pt-1">
              <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">Stellar POS &amp; Cajas</span>
              <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">PHP 8 &amp; Laravel 11</span>
              <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">Vue.js 3</span>
              <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">Redes LAN RJ45</span>
              <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">MySQL &amp; PostgreSQL</span>
            </div>

            <!-- Action Buttons -->
            <div class="pt-2 flex flex-wrap justify-center sm:justify-start gap-3">
              <a 
                href="#contacto"
                class="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:scale-105 transition-all"
              >
                <span>Hablemos de tu Proyecto</span>
                <ArrowRightIcon class="w-3.5 h-3.5" />
              </a>

              <a 
                :href="linkedInUrl" 
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-blue-400 transition-all"
              >
                <svg class="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>

          </div>

        </div>

      </div>

    </div>
  </section>
</template>
