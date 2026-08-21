<script setup>
import { 
  ComputerDesktopIcon, 
  ServerIcon, 
  CodeBracketIcon, 
  ShieldCheckIcon,
  CheckIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline';

const services = [
  {
    icon: ComputerDesktopIcon,
    badge: 'Hardware & Cajas',
    badgeColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/30',
    title: 'Mantenimiento de Puntos de Venta (POS)',
    description: 'Aseguramos que tus equipos de cobro, computadoras comerciales e impresoras funcionen siempre con fluidez y sin bloqueos.',
    points: [
      'Soporte técnico especializado L1, L2 y L3',
      'Mantenimiento preventivo y limpieza física interna',
      'Sustitución de piezas y optimización de rendimiento'
    ]
  },
  {
    icon: ServerIcon,
    badge: 'Conectividad Comercial',
    badgeColor: 'text-blue-400 bg-blue-950/80 border-blue-500/30',
    title: 'Puntos de Red & Cableado Comercial',
    description: 'Instalación y reemplazo de cables de red para conectar de forma estable tus cajas, balanzas, impresoras y computadoras al router o switch.',
    points: [
      'Tendido de cables de red entre puntos (ej. switch a balanza o caja)',
      'Cambio de cables deteriorados y sustitución de conectores RJ45',
      'Optimización de la conexión directa para evitar caídas en cajas'
    ]
  },
  {
    icon: CodeBracketIcon,
    badge: 'Software & Backend',
    badgeColor: 'text-purple-400 bg-purple-950/80 border-purple-500/30',
    title: 'Desarrollo Web (Laravel + Vue.js) & SQL',
    description: 'Convertimos procesos manuales y hojas de Excel en aplicaciones web robustas con Laravel, Vue.js y bases de datos relacionales seguras.',
    points: [
      'Sistemas de Citas y Mesa de Ayuda (Helpdesk) en Laravel + Vue.js',
      'Digitalización y estructuración de inventarios en PostgreSQL / MySQL',
      'Paneles administrativos y automatización con Python'
    ]
  },
  {
    icon: ShieldCheckIcon,
    badge: 'Seguridad & Datos',
    badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/30',
    title: 'Buenas Prácticas de Ciberseguridad & Backups',
    description: 'Aplicamos principios de ciberseguridad defensiva y copias de seguridad automáticas para proteger tu información comercial.',
    points: [
      'Configuración de copias de seguridad automáticas periódicas',
      'En formación continua y especialización en Ciberseguridad Defensiva',
      'Protección de datos comerciales y recuperación ante imprevistos'
    ]
  }
];
</script>

<template>
  <section id="servicios" class="py-24 bg-slate-900/40 relative border-t border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-2 font-mono">
          Soluciones Prácticas
        </span>
        <h2 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Servicios Integrales para tu Negocio
        </h2>
        <p class="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
          Atendemos el hardware y cables de tus equipos comerciales y programamos el software que hace crecer tu empresa.
        </p>
      </div>

      <!-- Services Grid (2x2 Clean Layout) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        
        <div 
          v-for="(service, idx) in services" 
          :key="idx"
          class="service-card rounded-3xl p-8 sm:p-10 border border-slate-800 flex flex-col justify-between group"
        >
          <div>
            <!-- Top Badge & Icon -->
            <div class="flex items-center justify-between mb-6">
              <div class="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300">
                <component :is="service.icon" class="w-6 h-6" />
              </div>
              <span :class="['text-2xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border', service.badgeColor]">
                {{ service.badge }}
              </span>
            </div>

            <!-- Content -->
            <h3 class="text-xl sm:text-2xl font-bold text-white mb-3">{{ service.title }}</h3>
            <p class="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed font-normal">
              {{ service.description }}
            </p>

            <!-- Bullets -->
            <ul class="space-y-3 text-sm text-slate-300">
              <li v-for="(pt, pIdx) in service.points" :key="pIdx" class="flex items-start gap-2.5">
                <CheckIcon class="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{{ pt }}</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

      <!-- Unified Service CTA Bar (Clean, no clutter) -->
      <div class="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-xl">
        <div>
          <h4 class="text-lg sm:text-xl font-bold text-white mb-1">
            ¿Tienes dudas sobre qué servicio requiere tu negocio?
          </h4>
          <p class="text-sm text-slate-300">
            Realizamos una evaluación técnica inicial sin ningún costo ni compromiso.
          </p>
        </div>
        <a 
          href="#contacto"
          class="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:scale-105 transition-all"
        >
          <span>Solicitar Evaluación</span>
          <ArrowRightIcon class="w-4 h-4" />
        </a>
      </div>

    </div>
  </section>
</template>
