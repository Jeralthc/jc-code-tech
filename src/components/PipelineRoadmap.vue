<script setup>
import { ref } from 'vue';
import { 
  MagnifyingGlassIcon, 
  CpuChipIcon, 
  RocketLaunchIcon, 
  LifebuoyIcon,
  CheckCircleIcon 
} from '@heroicons/vue/24/outline';

const activeStage = ref(0);

const stages = [
  {
    code: 'STAGE_01',
    title: 'Auditoría & Diagnóstico Gratuito',
    badge: 'Sin Costo',
    icon: MagnifyingGlassIcon,
    summary: 'Inspección minuciosa del hardware, topología de red y requerimientos lógicos.',
    deliverables: [
      'Evaluación de computadoras de caja (POS) y estado térmico/eléctrico',
      'Testeo de cobertura WiFi y puertos de switch/router',
      'Levantamiento de requerimientos para software web o base de datos',
      'Entrega de informe preliminar con presupuesto transparente'
    ]
  },
  {
    code: 'STAGE_02',
    title: 'Arquitectura & Plan de Acción',
    badge: 'Diseño Técnico',
    icon: CpuChipIcon,
    summary: 'Definición de componentes, diagramas de cableado y modelado de datos.',
    deliverables: [
      'Selección de hardware comercial duradero según presupuesto',
      'Estructura de esquemas de bases de datos (MySQL / PostgreSQL)',
      'Diseño de interfaces web en Vue.js y flujos de usuario',
      'Cronograma claro sin letra chica ni sobrecostos ocultos'
    ]
  },
  {
    code: 'STAGE_03',
    title: 'Despliegue Zero-Downtime',
    badge: 'Ejecución Limpia',
    icon: RocketLaunchIcon,
    summary: 'Montaje de red, configuración de terminales y lanzamiento de software.',
    deliverables: [
      'Canalización y ordenamiento de cables sin entorpecer la atención al público',
      'Puesta a punto de Puntos de Venta (POS) e impresoras',
      'Despliegue de aplicaciones web en servidores locales o en la nube',
      'Pruebas de estrés y verificación de copias de seguridad automáticas'
    ]
  },
  {
    code: 'STAGE_04',
    title: 'Monitoreo & Soporte Continuo',
    badge: 'Garantía SLA',
    icon: LifebuoyIcon,
    summary: 'Acompañamiento post-instalación, mantenimiento preventivo y respuesta rápida.',
    deliverables: [
      'Canal prioritario directo a WhatsApp (0422-7130583)',
      'Visitas de mantenimiento preventivo y limpieza de hardware',
      'Supervisión de salud de bases de datos y respaldos',
      'Actualizaciones y extensiones de software a medida según crecimiento'
    ]
  }
];
</script>

<template>
  <section id="pipeline" class="py-24 bg-slate-950 relative overflow-hidden border-t border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4">
          <span>// 04. PIPELINE DE EJECUCIÓN</span>
        </div>
        <h2 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Protocolo de Implementación y Soporte
        </h2>
        <p class="mt-4 text-base sm:text-lg text-slate-400">
          Haz clic en cada fase para inspeccionar los entregables técnicos y la metodología sin paradas operativas.
        </p>
      </div>

      <!-- Pipeline Interactive Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left: Stage Selectors (4 Buttons) -->
        <div class="lg:col-span-5 space-y-3 font-mono text-xs">
          <button
            v-for="(stage, idx) in stages"
            :key="idx"
            @click="activeStage = idx"
            :class="[
              'w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group',
              activeStage === idx
                ? 'bento-card bento-card-active border-cyan-500/60 bg-cyan-950/20'
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400'
            ]"
          >
            <div class="flex items-center gap-3.5">
              <div 
                :class="[
                  'w-9 h-9 rounded-xl flex items-center justify-center transition-colors',
                  activeStage === idx ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 group-hover:text-white'
                ]"
              >
                <component :is="stage.icon" class="w-5 h-5" />
              </div>
              <div>
                <span class="text-2xs text-cyan-400 font-bold block">{{ stage.code }}</span>
                <strong :class="activeStage === idx ? 'text-white font-sans text-sm' : 'text-slate-300 font-sans text-sm'">
                  {{ stage.title }}
                </strong>
              </div>
            </div>

            <span 
              :class="[
                'text-2xs px-2.5 py-1 rounded-full border',
                activeStage === idx ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
              ]"
            >
              {{ stage.badge }}
            </span>
          </button>
        </div>

        <!-- Right: Active Stage Inspection Console -->
        <div class="lg:col-span-7">
          <div class="hud-panel rounded-3xl p-8 border border-cyan-500/30 shadow-2xl relative">
            <div class="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 font-mono text-xs">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span class="text-cyan-400 font-bold">// DETALLE TÉCNICO: {{ stages[activeStage].code }}</span>
              </div>
              <span class="text-slate-400 text-2xs uppercase">ESTÁNDAR JC CODE &amp; TECH</span>
            </div>

            <h3 class="text-2xl font-bold text-white mb-2 font-sans">
              {{ stages[activeStage].title }}
            </h3>
            <p class="text-sm text-slate-300 mb-6 font-sans leading-relaxed">
              {{ stages[activeStage].summary }}
            </p>

            <div class="space-y-3 font-mono text-xs">
              <span class="text-2xs text-slate-400 uppercase tracking-wider block font-bold">
                Entregables y Acciones Concretas:
              </span>

              <div 
                v-for="(item, i) in stages[activeStage].deliverables" 
                :key="i"
                class="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 font-sans text-sm text-slate-200"
              >
                <CheckCircleIcon class="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{{ item }}</span>
              </div>
            </div>

            <!-- Footer note inside HUD -->
            <div class="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between font-mono text-2xs text-slate-400">
              <span>Compromiso de cero interrupciones en ventas</span>
              <span class="text-emerald-400 font-bold">100% GARANTIZADO</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>
