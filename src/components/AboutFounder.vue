<script setup>
import { 
  SparklesIcon,
  CheckBadgeIcon,
  CodeBracketIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline';
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
              <span>Desarrollador Web (PHP, Laravel, Vue)</span>
              <span class="text-slate-600">•</span>
              <span class="text-emerald-400">Ciberseguridad Defensiva</span>
            </div>

            <!-- Exact Bio Text from User -->
            <div class="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed font-sans font-normal">
              <p>
                Soy <strong class="text-white font-semibold">Jeralth Contreras</strong>, Analista de Soporte TI, Desarrollador Web y especialista en Ciberseguridad Defensiva.
              </p>
              <p>
                Con sede en <strong class="text-white font-semibold">Mérida</strong>, me dedico a resolver los cuellos de botella tecnológicos de tu empresa. Conecto el mundo físico (soporte técnico L1-L3 a puntos de venta, experiencia práctica con negocios que usan <strong class="text-cyan-300 font-semibold">Stellar POS</strong>, cables de red y mantenimiento) con el mundo digital (desarrollo de sistemas internos como citas y mesa de ayuda en PHP, Laravel + Vue, digitalización de inventarios y bases de datos).
              </p>
              <p class="text-cyan-100 font-medium">
                Entiendo la urgencia de tu negocio y construyo soluciones seguras para que nunca dejes de operar.
              </p>
            </div>

            <!-- Stack Badges -->
            <div class="flex flex-wrap gap-2 pt-1 font-mono text-2xs">
              <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300">PHP &amp; Laravel</span>
              <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300">Vue.js 3</span>
              <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300">MySQL &amp; PostgreSQL</span>
              <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300">Python</span>
              <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300">Stellar POS &amp; Cajas</span>
              <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300">Soporte TI L1-L3</span>
            </div>

            <!-- Action Button scrolling to central contact -->
            <div class="pt-4 flex flex-wrap gap-4">
              <a 
                href="#contacto"
                class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 transition-all"
              >
                <span>Hablemos de tu Proyecto</span>
                <ArrowRightIcon class="w-4 h-4" />
              </a>

              <a 
                href="https://www.linkedin.com/public-profile/settings/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_self_edit_contact_info%3BYvU0JnRKSNi6Tv%2B03l%2FOdg%3D%3D" 
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 hover:text-white hover:border-blue-400 transition-all"
              >
                <span>Ver Perfil en LinkedIn</span>
              </a>
            </div>

          </div>

          <!-- Right: Value Proposition & Core Values Card -->
          <div class="lg:col-span-5 space-y-4">
            <div class="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
              <div class="text-xs text-slate-300 uppercase tracking-wider font-bold pb-2 border-b border-slate-800">
                Compromiso de Trabajo
              </div>

              <div class="flex items-start gap-3">
                <CheckBadgeIcon class="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div class="text-xs">
                  <strong class="text-white block font-semibold text-sm">Experiencia Práctica en Stellar POS</strong>
                  <span class="text-slate-400">Atención técnica y resolución de fallas en terminales de cobro e impresoras.</span>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <CpuChipIcon class="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div class="text-xs">
                  <strong class="text-white block font-semibold text-sm">Conexión Física + Digital</strong>
                  <span class="text-slate-400">Dominio de cables, hardware y programación backend/frontend.</span>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <CodeBracketIcon class="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div class="text-xs">
                  <strong class="text-white block font-semibold text-sm">Desarrollo Web PHP &amp; Laravel</strong>
                  <span class="text-slate-400">Software a medida con Laravel, Vue.js y bases de datos relacionales.</span>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <ShieldCheckIcon class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div class="text-xs">
                  <strong class="text-white block font-semibold text-sm">Ciberseguridad Aplicada</strong>
                  <span class="text-slate-400">Buenas prácticas defensivas y respaldos automáticos garantizados.</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>
