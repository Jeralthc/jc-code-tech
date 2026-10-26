<script setup>
import {
  FunnelIcon, DocumentTextIcon, BanknotesIcon, DevicePhoneMobileIcon,
  ArrowRightIcon, ChatBubbleOvalLeftEllipsisIcon
} from '@heroicons/vue/24/outline';

const emit = defineEmits(['openDemo']);

const features = [
  { icon: FunnelIcon, title: 'Pipeline de ventas', text: 'Cada prospecto y cuánto dinero tienes en negociación.' },
  { icon: DocumentTextIcon, title: 'Cotizaciones en 1 minuto', text: 'En PDF y enviadas directo por WhatsApp.' },
  { icon: BanknotesIcon, title: 'Cobros bajo control', text: 'Anticipos, abonos y saldos pendientes.' },
  { icon: DevicePhoneMobileIcon, title: 'Desde el celular', text: 'En la nube, con acceso privado.' }
];

const whatsapp = 'https://wa.me/584247130583?text=' + encodeURIComponent('Hola Jeralth, vi la demo del CRM y me interesa un sistema a la medida para mi negocio.');

const bars = [38, 52, 44, 68, 60, 86];
const stages = [
  { label: 'Prospecto', n: 2, color: 'bg-slate-400' },
  { label: 'Propuesta', n: 2, color: 'bg-violet-400' },
  { label: 'Negociación', n: 1, color: 'bg-amber-400' },
  { label: 'Ganado', n: 3, color: 'bg-emerald-400' }
];
</script>

<template>
  <section id="sistema-crm" class="py-14 sm:py-20 relative border-t border-slate-800/80 overflow-hidden">
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-3xl"></div>
      <div class="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl"></div>
    </div>

    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 ring-1 ring-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>Sistema a medida · Demo en vivo
          </span>
          <h2 class="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Un ejemplo de lo que desarrollo: <span class="gradient-text-cyan">un CRM para tu negocio</span>
          </h2>
          <p class="mt-4 text-slate-400 leading-relaxed">
            Un gestor de clientes, ventas y cobros como este, adaptado a cómo trabaja tu negocio. Pruébalo con datos de ejemplo.
          </p>

          <div class="mt-6 grid grid-cols-2 gap-4">
            <div v-for="f in features" :key="f.title" class="flex gap-3">
              <div class="w-10 h-10 shrink-0 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                <component :is="f.icon" class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-white">{{ f.title }}</h3>
                <p class="text-sm text-slate-400 mt-0.5 leading-snug">{{ f.text }}</p>
              </div>
            </div>
          </div>

          <div class="mt-7 flex flex-col sm:flex-row gap-3">
            <button class="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(6,182,212,0.35)] hover:scale-[1.02] transition-transform" @click="emit('openDemo')">
              Probar la demo en vivo <ArrowRightIcon class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <a :href="whatsapp" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors">
              <ChatBubbleOvalLeftEllipsisIcon class="w-5 h-5" />Quiero un sistema así
            </a>
          </div>
        </div>

        <!-- Vista previa estilizada del panel -->
        <button class="group relative text-left hidden lg:block" aria-label="Abrir la demo del CRM" @click="emit('openDemo')">
          <div class="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 to-blue-600/10 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative rounded-2xl border border-slate-700/80 bg-slate-950 shadow-2xl overflow-hidden group-hover:-translate-y-1 transition-transform duration-500">
            <div class="flex items-center gap-1.5 px-4 py-3 border-b border-slate-800 bg-slate-900">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-400/80"></span><span class="w-2.5 h-2.5 rounded-full bg-amber-400/80"></span><span class="w-2.5 h-2.5 rounded-full bg-emerald-400/80"></span>
              <span class="ml-3 text-2xs text-slate-500 font-mono">crm · resumen</span>
            </div>
            <div class="flex">
              <div class="hidden sm:flex flex-col gap-2 p-3 border-r border-slate-800 w-36">
                <div v-for="(n, i) in ['Inicio', 'Pipeline', 'Clientes', 'Cotizaciones', 'Proyectos', 'Cobranzas']" :key="n" :class="['text-2xs px-2 py-1.5 rounded-md', i === 0 ? 'bg-cyan-500/15 text-cyan-200' : 'text-slate-500']">{{ n }}</div>
              </div>
              <div class="flex-1 p-4 space-y-3">
                <div class="grid grid-cols-3 gap-2">
                  <div class="rounded-lg bg-slate-900 border border-slate-800 p-2.5"><p class="text-2xs text-slate-500">Cobrado mes</p><p class="text-sm font-bold text-white font-mono">$2,340</p><p class="text-2xs text-emerald-400">+18%</p></div>
                  <div class="rounded-lg bg-slate-900 border border-slate-800 p-2.5"><p class="text-2xs text-slate-500">Por cobrar</p><p class="text-sm font-bold text-white font-mono">$1,060</p><p class="text-2xs text-slate-500">3 proyectos</p></div>
                  <div class="rounded-lg bg-slate-900 border border-slate-800 p-2.5"><p class="text-2xs text-slate-500">Pipeline</p><p class="text-sm font-bold text-white font-mono">$5,400</p><p class="text-2xs text-slate-500">7 oportunidades</p></div>
                </div>
                <div class="rounded-lg bg-slate-900 border border-slate-800 p-3">
                  <p class="text-2xs text-slate-400 mb-2">Cobros últimos 6 meses</p>
                  <div class="flex items-end gap-2 h-20">
                    <div v-for="(b, i) in bars" :key="i" :class="['flex-1 rounded-t-[3px]', i === 5 ? 'bg-cyan-400' : 'bg-cyan-500/40']" :style="{ height: b + '%' }"></div>
                  </div>
                </div>
                <div class="grid grid-cols-4 gap-2">
                  <div v-for="st in stages" :key="st.label" class="rounded-lg bg-slate-900 border border-slate-800 p-2">
                    <p class="text-2xs text-slate-400 flex items-center gap-1"><span :class="['w-1.5 h-1.5 rounded-full', st.color]"></span>{{ st.label }}</p>
                    <div v-for="n in st.n" :key="n" class="h-3 rounded bg-slate-800 mt-1.5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span class="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white text-slate-950 text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Clic para explorar →</span>
        </button>
      </div>
    </div>
  </section>
</template>
