<script setup>
import {
  ArrowDownIcon,
  MapPinIcon,
  CodeBracketSquareIcon,
  ComputerDesktopIcon,
  CircleStackIcon,
  ServerIcon,
  CheckCircleIcon,
  BoltIcon
} from '@heroicons/vue/24/outline';

const whatsappUrl = 'https://wa.me/584247130583?text=' + encodeURIComponent('¡Hola Jeralth! 👋 Vi tu página y quiero consultarte sobre mi negocio.');

const pillars = [
  {
    title: 'Cajas y puntos de venta',
    desc: 'Soporte a Stellar POS, impresoras, lectores y balanzas para que no se traben en horas pico.',
    icon: ComputerDesktopIcon,
    color: 'text-amber-400 bg-amber-500/10 ring-amber-500/30'
  },
  {
    title: 'Sistemas web a medida',
    desc: 'Costos, inventario, citas y cotizaciones: deja atrás el Excel y controla tu negocio desde el celular.',
    icon: CodeBracketSquareIcon,
    color: 'text-cyan-400 bg-cyan-500/10 ring-cyan-500/30'
  },
  {
    title: 'Redes estables',
    desc: 'Cableado directo para que tus cajas, routers y equipos no pierdan conexión.',
    icon: ServerIcon,
    color: 'text-blue-400 bg-blue-500/10 ring-blue-500/30'
  },
  {
    title: 'Respaldos y seguridad',
    desc: 'Copias automáticas de tus ventas para que nunca pierdas información.',
    icon: CircleStackIcon,
    color: 'text-emerald-400 bg-emerald-500/10 ring-emerald-500/30'
  }
];

const commitments = ['Respuesta el mismo día hábil', 'Atención en tu local en Mérida', 'Presupuestos cerrados, sin sorpresas'];
</script>

<template>
  <section class="relative pt-32 sm:pt-36 pb-20 overflow-hidden">
    <!-- Luces de fondo -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-cyan-500/10 blur-3xl"></div>
      <div class="absolute top-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl"></div>
      <div class="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:48px_48px]"></div>
    </div>

    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-14 items-center">
        <!-- Mensaje -->
        <div class="text-center lg:text-left">
          <div class="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs text-slate-300">
            <MapPinIcon class="w-4 h-4 text-cyan-400" />
            <span class="font-semibold">Mérida, Venezuela</span>
            <span class="text-slate-600">•</span>
            <span class="text-cyan-300">Soporte TI y sistemas para comercios</span>
          </div>

          <h1 class="mt-6 text-4xl sm:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
            Tu negocio funcionando
            <span class="block gradient-text-cyan pb-1">sin fallas ni papeleo</span>
          </h1>

          <p class="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Soy <strong class="text-white">Jeralth Contreras</strong>. Mantengo funcionando las <strong class="text-white">cajas y redes</strong> de tu comercio y creo <strong class="text-white">sistemas web a medida</strong> para que controles costos, inventario y ventas desde cualquier lugar.
          </p>

          <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <a :href="whatsappUrl" target="_blank" rel="noopener"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:scale-[1.02] transition-all">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.72.97 1-3.62-.24-.37a9.78 9.78 0 0 1-1.5-5.22c0-5.41 4.41-9.82 9.83-9.82 2.63 0 5.1 1.03 6.95 2.88a9.75 9.75 0 0 1 2.87 6.95c0 5.42-4.4 9.82-9.82 9.82zm8.36-18.18A11.75 11.75 0 0 0 12.05.17C5.5.17.17 5.5.17 12.05c0 2.1.55 4.13 1.59 5.93L.07 24l6.16-1.62a11.82 11.82 0 0 0 5.82 1.48h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.24-6.16-3.48-8.4z"/></svg>
              Escríbeme por WhatsApp
            </a>
            <a href="#proyectos"
              class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:border-cyan-500/50 hover:text-white transition-colors">
              Ver proyectos reales <ArrowDownIcon class="w-4 h-4" />
            </a>
          </div>

          <ul class="mt-7 flex flex-col sm:flex-row flex-wrap gap-x-5 gap-y-2 justify-center lg:justify-start text-sm text-slate-400">
            <li v-for="c in commitments" :key="c" class="flex items-center justify-center gap-1.5">
              <CheckCircleIcon class="w-4 h-4 text-emerald-400" />{{ c }}
            </li>
          </ul>
        </div>

        <!-- Vista de trabajos reales -->
        <div class="relative hidden sm:block max-w-xl mx-auto w-full">
          <div class="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-cyan-500/15 to-blue-600/10 blur-2xl"></div>
          <div class="relative rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl overflow-hidden">
            <div class="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-800 bg-slate-900">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-400/80"></span><span class="w-2.5 h-2.5 rounded-full bg-amber-400/80"></span><span class="w-2.5 h-2.5 rounded-full bg-emerald-400/80"></span>
              <span class="ml-3 text-xs text-slate-500">Portal de citas · LogiSync</span>
            </div>
            <img src="/images/projects/logisync-dashboard.webp" alt="Sistema de citas LogiSync desarrollado por Jeralth Contreras" width="1600" height="900" class="w-full aspect-[16/10] object-cover object-top bg-white" fetchpriority="high" />
          </div>
          <div class="absolute -bottom-10 -left-8 w-56 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden rotate-[-3deg]">
            <img src="/images/projects/caldero-app.webp" alt="Calculadora de costos El Caldero" width="560" height="350" loading="lazy" class="w-full aspect-[16/10] object-cover object-top" />
            <p class="px-3 py-2 text-xs text-slate-300">Calculadora de costos</p>
          </div>
          <div class="absolute -top-5 -right-4 flex items-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900/95 px-4 py-3 shadow-2xl">
            <span class="w-9 h-9 rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/30 flex items-center justify-center"><BoltIcon class="w-5 h-5 text-emerald-400" /></span>
            <div>
              <p class="text-sm font-bold text-white leading-tight">+5 proyectos</p>
              <p class="text-xs text-slate-400">entregados a negocios reales</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Pilares -->
      <div class="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="p in pillars" :key="p.title" class="service-card rounded-2xl p-5">
          <div :class="['w-10 h-10 rounded-xl ring-1 flex items-center justify-center', p.color]">
            <component :is="p.icon" class="w-5 h-5" />
          </div>
          <h2 class="mt-4 text-base font-bold text-white">{{ p.title }}</h2>
          <p class="mt-1.5 text-sm text-slate-400 leading-relaxed">{{ p.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
