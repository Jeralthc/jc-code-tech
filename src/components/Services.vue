<script setup>
import { 
  CalculatorIcon,
  CalendarDaysIcon, 
  ChartBarIcon, 
  ComputerDesktopIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline';

const solutions = [
  {
    id: 'costos',
    title: 'Calculadoras de Costos & Rentabilidad',
    category: 'Alimentos & Gastronomía',
    badgeClass: 'text-amber-400 bg-amber-950/80 border-amber-500/30',
    caseBadge: 'Caso Real: Industria Gastronómica',
    desc: 'Costeo de recetas con merma, prorrateo inteligente de gastos fijos (alquiler, luz, nómina) y cálculo automático del margen de ganancia neto real por producto.',
    stack: ['Laravel 11', 'Vue.js 3', 'MySQL / In-Memory Calc'],
    target: 'Restaurantes, franquicias de comida, panaderías y mayoristas',
    icon: CalculatorIcon,
    accentBorder: 'hover:border-amber-500/40',
    iconColor: 'text-amber-400'
  },
  {
    id: 'logistica-citas',
    title: 'Sistemas de Citas, Logística & Turnos',
    category: 'Logística & Operaciones',
    badgeClass: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/30',
    caseBadge: 'Caso Real: LogiSync & ERP',
    desc: 'Plataforma para coordinar citas de proveedores y muelle de carga con sincronización ERP, ventanas horarias, control de transportistas y avisos por correo.',
    stack: ['Laravel 11', 'Vue.js 3', 'Inertia.js', 'API ERP'],
    target: 'Cadenas de retail, distribuidoras, muelles y consultorios',
    icon: CalendarDaysIcon,
    accentBorder: 'hover:border-cyan-500/40',
    iconColor: 'text-cyan-400'
  },
  {
    id: 'reportes-bi',
    title: 'Sistemas de Reportes & Catálogo Web',
    category: 'Empresas & Tecnología',
    badgeClass: 'text-purple-400 bg-purple-950/80 border-purple-500/30',
    caseBadge: 'Caso Real: Sector Tecnológico',
    desc: 'Dashboards ejecutivos con métricas de ventas y stock, catálogo digital con pedidos automáticos a WhatsApp, exportación de PDFs y trazabilidad de seriales.',
    stack: ['Laravel', 'Vue.js', 'Tailwind', 'Generación PDF'],
    target: 'Empresas de tecnología, distribuidores de repuestos y comercios B2B',
    icon: ChartBarIcon,
    accentBorder: 'hover:border-purple-500/40',
    iconColor: 'text-purple-400'
  },
  {
    id: 'pos-soporte',
    title: 'Soporte Stellar POS & Redes Físicas',
    category: 'Comercios en Mérida',
    badgeClass: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/30',
    caseBadge: 'Presencial en Mérida & Remoto',
    desc: 'Atención técnica preventiva y correctiva para negocios que usan Stellar POS. Instalación de cables de red punto a punto (router a balanzas/cajas) y respaldos.',
    stack: ['Stellar POS', 'Redes LAN RJ45', 'Respaldos Automáticos'],
    target: 'Bodegones, supermercados, farmacias y tiendas locales',
    icon: ComputerDesktopIcon,
    accentBorder: 'hover:border-emerald-500/40',
    iconColor: 'text-emerald-400'
  }
];
</script>

<template>
  <section id="servicios" class="py-20 bg-slate-900/40 relative border-t border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-2xl mx-auto mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
          <SparklesIcon class="w-3.5 h-3.5" />
          <span>Experiencia Real en Producción</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Soluciones de Software &amp; Soporte
        </h2>
        <p class="mt-3 text-sm sm:text-base text-slate-400">
          Sistemas probados en empresas reales para resolver finanzas, logística y continuidad operativa.
        </p>
      </div>

      <!-- Solutions Grid (4 Compact, High-Impact Cards) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div 
          v-for="item in solutions" 
          :key="item.id"
          :class="[
            'service-card rounded-2xl p-6 sm:p-7 border border-slate-800/90 bg-slate-900/60 flex flex-col justify-between transition-all duration-300 group',
            item.accentBorder
          ]"
        >
          <div>
            <!-- Top Row: Icon + Badges -->
            <div class="flex items-center justify-between gap-3 mb-4">
              <div class="w-11 h-11 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center group-hover:scale-105 transition-all">
                <component :is="item.icon" :class="['w-5 h-5', item.iconColor]" />
              </div>
              <div class="flex flex-wrap items-center gap-1.5 justify-end">
                <span class="text-3xs font-mono font-medium text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {{ item.caseBadge }}
                </span>
                <span :class="['text-3xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border', item.badgeClass]">
                  {{ item.category }}
                </span>
              </div>
            </div>

            <!-- Title & Description -->
            <h3 class="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
              {{ item.title }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 font-normal">
              {{ item.desc }}
            </p>

            <!-- Target Audience -->
            <div class="text-2xs text-slate-400 mb-4 flex items-start gap-1.5">
              <span class="text-cyan-400 font-semibold shrink-0">Dirigido a:</span>
              <span>{{ item.target }}</span>
            </div>
          </div>

          <!-- Bottom: Tech Stack & WhatsApp Action -->
          <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
            <div class="flex flex-wrap gap-1.5">
              <span 
                v-for="tech in item.stack" 
                :key="tech"
                class="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-3xs font-mono text-slate-400"
              >
                {{ tech }}
              </span>
            </div>

            <a 
              href="#contacto"
              class="shrink-0 text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
            >
              <span>Consultar</span>
              <ArrowRightIcon class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <!-- Trust Action Banner -->
      <div class="rounded-2xl p-6 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg">
        <div>
          <h4 class="text-base sm:text-lg font-bold text-white">
            ¿Necesitas una solución similar adaptada al flujo de tu empresa?
          </h4>
          <p class="text-xs sm:text-sm text-slate-400">
            Diseñamos el sistema o atendemos tus cajas sin ningún costo inicial por el diagnóstico.
          </p>
        </div>
        <a 
          href="#contacto"
          class="shrink-0 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:scale-105 transition-all"
        >
          Solicitar Evaluación
        </a>
      </div>

    </div>
  </section>
</template>
