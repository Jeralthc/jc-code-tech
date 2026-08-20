<script setup>
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline';

const linkedInUrl = 'https://www.linkedin.com/public-profile/settings/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_self_edit_contact_info%3BYvU0JnRKSNi6Tv%2B03l%2FOdg%3D%3D';
const githubUrl = 'https://github.com/Jeralthc';
const whatsappUrl = 'https://wa.me/584247130583?text=Hola%20Jeralth,%20un%20gusto%20saludarte.%20Deseo%20conversar%20sobre%20un%20proyecto.';
</script>

<template>
  <section id="nosotros" class="py-24 bg-slate-950 relative border-t border-slate-800/80 overflow-hidden">
    <!-- Ambient Accent Glow -->
    <div class="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none"></div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="service-card rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <!-- Left: Text & Bio -->
          <div class="lg:col-span-7 space-y-6">
            
            <!-- Section Badge -->
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <SparklesIcon class="w-4 h-4" />
              <span>Conoce a tu Aliado Tecnológico</span>
            </div>

            <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Jeralth Contreras
            </h2>

            <div class="text-sm sm:text-base text-cyan-400 font-semibold flex flex-wrap items-center gap-2">
              <span>Analista de Soporte TI</span>
              <span class="text-slate-600">•</span>
              <span>Desarrollador Web (Laravel + Vue)</span>
              <span class="text-slate-600">•</span>
              <span class="text-emerald-400">Ciberseguridad Defensiva</span>
            </div>

            <!-- Exact Bio Text from User -->
            <div class="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              <p>
                Soy <strong class="text-white">Jeralth Contreras</strong>, Analista de Soporte TI, Desarrollador Web y especialista en Ciberseguridad Defensiva.
              </p>
              <p>
                Con sede en <strong class="text-white">Mérida</strong>, me dedico a resolver los cuellos de botella tecnológicos de tu empresa. Conecto el mundo físico (soporte técnico L1-L3, cables de red y mantenimiento de equipos) con el mundo digital (desarrollo de sistemas internos como citas y mesa de ayuda en Laravel + Vue, digitalización de inventarios y bases de datos).
              </p>
              <p class="text-cyan-100 font-medium">
                Entiendo la urgencia de tu negocio y construyo soluciones seguras para que nunca dejes de operar.
              </p>
            </div>

            <!-- Stack Badges -->
            <div class="flex flex-wrap gap-2 pt-1 font-mono text-2xs">
              <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300">Laravel / PHP</span>
              <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300">Vue.js 3</span>
              <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300">MySQL &amp; PostgreSQL</span>
              <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300">Python</span>
              <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300">Soporte TI &amp; POS</span>
            </div>

            <!-- Action Buttons -->
            <div class="pt-4 flex flex-wrap gap-4">
              <a 
                :href="whatsappUrl" 
                target="_blank"
                class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 transition-all"
              >
                <span>Conversar Directamente</span>
              </a>

              <a 
                :href="linkedInUrl" 
                target="_blank"
                class="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 hover:text-white hover:border-blue-400 transition-all"
              >
                <span>Ver Perfil en LinkedIn</span>
              </a>
            </div>

          </div>

          <!-- Right: Contact Card & Credentials -->
          <div class="lg:col-span-5 space-y-4">
            <div class="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 font-mono text-xs">
              <div class="text-2xs text-slate-400 uppercase tracking-widest font-bold pb-2 border-b border-slate-800">
                Canales de Contacto Directo
              </div>

              <!-- Location -->
              <div class="flex items-center gap-3 text-slate-200">
                <MapPinIcon class="w-5 h-5 text-cyan-400 shrink-0" />
                <span class="font-sans text-sm">Mérida, Venezuela</span>
              </div>

              <!-- Phone / WhatsApp -->
              <a href="tel:+584247130583" class="flex items-center gap-3 text-slate-200 hover:text-cyan-400 transition-colors">
                <PhoneIcon class="w-5 h-5 text-cyan-400 shrink-0" />
                <span class="font-bold text-sm">+58 424-7130583 / 0422-7130583</span>
              </a>

              <!-- Email -->
              <a href="mailto:jeralthc@gmail.com" class="flex items-center gap-3 text-slate-200 hover:text-cyan-400 transition-colors">
                <EnvelopeIcon class="w-5 h-5 text-cyan-400 shrink-0" />
                <span class="font-sans text-sm">jeralthc@gmail.com</span>
              </a>

              <!-- GitHub -->
              <a :href="githubUrl" target="_blank" class="flex items-center gap-3 text-slate-200 hover:text-cyan-400 transition-colors">
                <svg class="w-5 h-5 text-cyan-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                </svg>
                <span class="font-sans text-sm">github.com/Jeralthc</span>
              </a>

              <!-- Focus Tag -->
              <div class="pt-2 border-t border-slate-800 flex items-center gap-2 text-2xs text-emerald-400 font-semibold">
                <ShieldCheckIcon class="w-4 h-4 shrink-0" />
                <span>Especializándose en Ciberseguridad Defensiva y CTI (En Formación Continua)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>
