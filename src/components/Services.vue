<script setup>
import { 
  CodeBracketSquareIcon,
  CalendarDaysIcon, 
  ComputerDesktopIcon, 
  ServerIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline';

const services = [
  {
    id: 'fullstack',
    title: 'Desarrollo Web Full-Stack a Medida',
    badge: 'Software Personalizado',
    badgeColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/30',
    desc: 'Construimos el sistema web exacto que tu negocio necesita: calculadoras de costos, portales para clientes, paneles de control y automatización para dejar atrás las hojas de Excel.',
    benefit: 'Ahorra horas de trabajo manual y centraliza tus datos en la nube de forma segura.',
    icon: CodeBracketSquareIcon
  },
  {
    id: 'citas',
    title: 'Sistemas de Citas, Turnos & Reservas',
    badge: 'Automatización 24/7',
    badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-500/30',
    desc: 'Plataformas interactivas para que tus clientes, pacientes o proveedores agenden citas automáticamente según tus horarios disponibles y capacidad de atención.',
    benefit: 'Elimina el 80% de llamadas y mensajes repetitivos de WhatsApp.',
    icon: CalendarDaysIcon
  },
  {
    id: 'pos',
    title: 'Soporte y Continuidad para Cajas (Stellar POS)',
    badge: 'Presencial en Mérida',
    badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/30',
    desc: 'Atención técnica preventiva y de emergencia para comercios con Stellar POS. Solucionamos cuelgues de caja, errores de software y fallas de impresoras térmicas.',
    benefit: 'Garantiza que tus puntos de cobro nunca se detengan en horas pico.',
    icon: ComputerDesktopIcon
  },
  {
    id: 'redes',
    title: 'Puntos de Red & Cableado Comercial',
    badge: 'Conectividad Estable',
    badgeColor: 'text-blue-400 bg-blue-950/80 border-blue-500/30',
    desc: 'Instalación y sustitución de cables de red punto a punto para conectar de forma fija y rápida tus balanzas, cajas registradoras, impresoras y computadoras.',
    benefit: 'Olvídate de la lentitud y las caídas de señal del WiFi en tus equipos de venta.',
    icon: ServerIcon
  }
];
</script>

<template>
  <section id="servicios" class="py-20 bg-slate-900/40 relative border-t border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-2xl mx-auto mb-12">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
          <SparklesIcon class="w-3.5 h-3.5" />
          <span>Servicios Profesionales</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          ¿Cómo Puedo Ayudar a tu Negocio?
        </h2>
        <p class="mt-2 text-sm sm:text-base text-slate-400">
          Soluciones claras, explicadas en tu idioma y enfocadas en rentabilidad y tranquilidad operativa.
        </p>
      </div>

      <!-- 4 Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div 
          v-for="item in services" 
          :key="item.id"
          class="service-card rounded-2xl p-6 sm:p-7 border border-slate-800/90 bg-slate-900/60 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 group"
        >
          <div>
            <!-- Top: Icon & Badge -->
            <div class="flex items-center justify-between gap-3 mb-4">
              <div class="w-11 h-11 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                <component :is="item.icon" class="w-5 h-5" />
              </div>
              <span :class="['text-3xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border', item.badgeColor]">
                {{ item.badge }}
              </span>
            </div>

            <!-- Title & Description -->
            <h3 class="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
              {{ item.title }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 font-normal">
              {{ item.desc }}
            </p>

            <!-- Direct Benefit Line -->
            <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4 flex items-start gap-2">
              <CheckCircleIcon class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p class="text-2xs sm:text-xs text-emerald-300/90 font-medium">
                {{ item.benefit }}
              </p>
            </div>
          </div>

          <!-- Bottom: Action Link -->
          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span class="text-3xs font-mono text-slate-400">
              Presupuesto personalizado
            </span>
            <a 
              href="#contacto"
              class="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 group-hover:translate-x-1 transition-transform"
            >
              <span>Consultar este servicio</span>
              <ArrowRightIcon class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
