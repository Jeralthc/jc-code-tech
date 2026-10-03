<script setup>
import { ref, computed } from 'vue';
import { 
  SparklesIcon, 
  CalendarDaysIcon, 
  TicketIcon, 
  CircleStackIcon, 
  ComputerDesktopIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketSquareIcon,
  ShieldCheckIcon,
  CpuChipIcon
} from '@heroicons/vue/24/outline';

const activeFilter = ref('all');

const projects = [
  {
    id: 'citas-app',
    category: 'software',
    title: 'Sistema de Gestión de Citas & Turnos Web',
    subtitle: 'Automatización de reservas para clínicas, consultorios y servicios',
    tag: 'Desarrollo Web Full-Stack',
    tagColor: 'text-cyan-400 bg-cyan-950/70 border-cyan-500/30',
    icon: CalendarDaysIcon,
    iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    description: 'Plataforma web reactiva que reemplaza los cuadernos y mensajes desorganizados de WhatsApp por un agendamiento automatizado 24/7 con confirmaciones y panel administrativo.',
    problemSolved: 'Elimina el 80% del tiempo perdido en responder mensajes repetitivos y previene citas duplicadas o ausencias no confirmadas.',
    architecture: ['Laravel 11 (PHP)', 'Vue.js 3', 'Tailwind CSS', 'PostgreSQL / MySQL', 'REST API'],
    features: [
      'Calendario interactivo con asignación de especialistas y horarios flexibles',
      'Panel multi-rol para administradores, especialistas y recepcionistas',
      'Generación de recordatorios y confirmaciones automáticas vía WhatsApp/Email',
      'Historial clínico/comercial centralizado por cliente o paciente'
    ],
    niche: 'Clínicas, Consultorios Médicos, Centros de Estética, Spas y Talleres',
    metrics: 'Reducción de cancelaciones y atención 24/7'
  },
  {
    id: 'helpdesk-app',
    category: 'software',
    title: 'Mesa de Ayuda & Helpdesk TI para Empresas',
    subtitle: 'Control de incidencias, tickets de soporte y cumplimiento de SLAs',
    tag: 'Software Operativo Interno',
    tagColor: 'text-indigo-400 bg-indigo-950/70 border-indigo-500/30',
    icon: TicketIcon,
    iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    description: 'Sistema centralizado para registrar, priorizar y resolver incidencias de hardware, software y redes en empresas con múltiples cajas, terminales o departamentos.',
    problemSolved: 'Pone fin al caos de reportes perdidos por llamadas o chats informales, asegurando trazabilidad exacta de cada falla.',
    architecture: ['PHP 8.2+', 'Laravel Sanctum', 'Vue 3 Composition API', 'MySQL', 'WebSockets / Polling'],
    features: [
      'Clasificación de tickets por niveles de urgencia (L1 a L3) y criticidad',
      'Trazabilidad de tiempos de respuesta y solución por técnico',
      'Base de conocimiento interna con soluciones a fallas frecuentes de POS y redes',
      'Métricas de desempeño y reportes exportables de disponibilidad'
    ],
    niche: 'Cadenas de retail, supermercados, distribuidoras y empresas con sucursales',
    metrics: 'Trazabilidad del 100% de incidencias operativas'
  },
  {
    id: 'pos-stellar',
    category: 'soporte',
    title: 'Soporte y Continuidad Operativa para Stellar POS',
    subtitle: 'Mantenimiento preventivo, correctivo y conectividad en punto de venta',
    tag: 'Soporte TI & Hardware Retail',
    tagColor: 'text-amber-400 bg-amber-950/70 border-amber-500/30',
    icon: ComputerDesktopIcon,
    iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    description: 'Servicio técnico especializado para comercios que operan con terminales Stellar POS, impresoras fiscales/térmicas, gavetas de dinero y lectores de códigos.',
    problemSolved: 'Resuelve caídas de cajas en horas pico, fallas de comunicación con impresoras y bloqueos de bases de datos locales.',
    architecture: ['Stellar POS', 'Windows / Drivers POS', 'Redes LAN RJ45', 'Bases de Datos Locales', 'Respaldos Offline'],
    features: [
      'Diagnóstico y resolución rápida de errores de software y cuelgues de caja',
      'Configuración e integración de impresoras térmicas y periféricos',
      'Esquemas de respaldo diario para proteger ventas históricas e inventario',
      'Planes de contingencia para operar de forma ininterrumpida'
    ],
    niche: 'Bodegones, Supermercados, Farmacias, Panaderías y Tiendas de Repuestos en Mérida',
    metrics: 'Tiempo mínimo de inactividad en caja'
  },
  {
    id: 'inventarios-db',
    category: 'datos',
    title: 'Digitalizador & Gestor de Inventarios Relacionales',
    subtitle: 'Migración desde hojas de cálculo a bases de datos seguras y rápidas',
    tag: 'Bases de Datos & Arquitectura',
    tagColor: 'text-emerald-400 bg-emerald-950/70 border-emerald-500/30',
    icon: CircleStackIcon,
    iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    description: 'Desarrollo de módulos de inventario y kárdex con bases de datos relacionales normalizadas (PostgreSQL / MySQL) para negocios que superaron la capacidad de Excel.',
    problemSolved: 'Evita descuadres de stock, pérdidas de datos por archivos de Excel dañados o bloqueados y falta de control de usuarios.',
    architecture: ['PostgreSQL', 'MySQL InnoDB', 'PHP / Laravel API', 'Vue.js Dashboard', 'Scripts Python'],
    features: [
      'Control estricto de entradas, salidas, mermas y transferencias entre depósitos',
      'Alertas automáticas de stock mínimo y compras sugeridas',
      'Auditoría y registro inmutable de qué usuario modificó cada registro',
      'Consultas optimizadas con índices para catálogos de más de 50.000 SKUs'
    ],
    niche: 'Mayoristas, Ferreterías, Tiendas de Conveniencia y Fabricantes locales',
    metrics: 'Integridad de datos 100% libre de duplicados'
  }
];

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') return projects;
  return projects.filter(p => p.category === activeFilter.value);
});
</script>

<template>
  <section id="proyectos" class="py-24 bg-slate-950 relative overflow-hidden border-t border-slate-800/80">
    <!-- Ambient Accent Background Glow -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-12">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4">
          <SparklesIcon class="w-4 h-4" />
          <span>// PORTAFOLIO DE SOLUCIONES REALES</span>
        </div>
        <h2 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Proyectos, Software &amp; Casos de Estudio
        </h2>
        <p class="mt-4 text-base sm:text-lg text-slate-400">
          Soluciones construidas para resolver dolores operativos concretos. Conectamos software web a medida con la infraestructura física de tu negocio.
        </p>
      </div>

      <!-- Filter Tabs -->
      <div class="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
        <button 
          @click="activeFilter = 'all'"
          :class="[
            'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border',
            activeFilter === 'all' 
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
              : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
          ]"
        >
          Todos los Proyectos ({{ projects.length }})
        </button>
        <button 
          @click="activeFilter = 'software'"
          :class="[
            'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border',
            activeFilter === 'software' 
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
              : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
          ]"
        >
          Software Web &amp; APIs (Laravel + Vue)
        </button>
        <button 
          @click="activeFilter = 'soporte'"
          :class="[
            'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border',
            activeFilter === 'soporte' 
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
              : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
          ]"
        >
          Soporte POS &amp; Redes Físicas
        </button>
        <button 
          @click="activeFilter = 'datos'"
          :class="[
            'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border',
            activeFilter === 'datos' 
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
              : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
          ]"
        >
          Bases de Datos &amp; Inventarios
        </button>
      </div>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div 
          v-for="project in filteredProjects" 
          :key="project.id"
          class="service-card rounded-3xl p-6 sm:p-8 border border-slate-800 bg-slate-900/50 flex flex-col justify-between relative group hover:border-cyan-500/40 transition-all duration-300"
        >
          
          <!-- Top Card Meta -->
          <div>
            <div class="flex items-start justify-between gap-4 mb-5">
              <div class="flex items-center gap-3">
                <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center border', project.iconColor]">
                  <component :is="project.icon" class="w-6 h-6" />
                </div>
                <div>
                  <span :class="['text-2xs font-mono font-bold px-2.5 py-0.5 rounded-md border uppercase tracking-wider inline-block mb-1', project.tagColor]">
                    {{ project.tag }}
                  </span>
                  <h3 class="text-xl sm:text-2xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                    {{ project.title }}
                  </h3>
                </div>
              </div>
            </div>

            <p class="text-xs sm:text-sm font-medium text-cyan-200/90 mb-3">
              {{ project.subtitle }}
            </p>

            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
              {{ project.description }}
            </p>

            <!-- Problem / Solution Highlight -->
            <div class="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-5">
              <span class="text-2xs font-mono font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Problema que Resuelve:
              </span>
              <p class="text-xs text-slate-300 leading-relaxed">
                {{ project.problemSolved }}
              </p>
            </div>

            <!-- Key Features List -->
            <div class="space-y-2 mb-6">
              <span class="text-2xs font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                Capacidades &amp; Módulos Clave:
              </span>
              <div 
                v-for="(feat, idx) in project.features" 
                :key="idx"
                class="flex items-start gap-2 text-xs text-slate-300"
              >
                <CheckCircleIcon class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{{ feat }}</span>
              </div>
            </div>
          </div>

          <!-- Bottom Card: Tech Stack & Target Niche -->
          <div class="pt-5 border-t border-slate-800/80 space-y-4">
            
            <!-- Tech Badges -->
            <div class="flex flex-wrap gap-1.5">
              <span 
                v-for="tech in project.architecture" 
                :key="tech"
                class="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-700/60 font-mono text-2xs text-slate-300 font-medium"
              >
                {{ tech }}
              </span>
            </div>

            <!-- Niche & Action Row -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
              <div class="text-2xs text-slate-400">
                <span class="font-bold text-slate-300">Enfoque de Nicho:</span> {{ project.niche }}
              </div>

              <a 
                href="#contacto"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-xs font-bold text-cyan-400 border border-slate-700 hover:border-cyan-400 transition-all duration-200 shrink-0"
              >
                <ChatBubbleLeftRightIcon class="w-3.5 h-3.5" />
                <span>Consultar Implementación</span>
              </a>
            </div>

          </div>

        </div>
      </div>

      <!-- Bottom Banner: Custom Software Consultation -->
      <div class="mt-14 rounded-3xl p-8 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase font-bold">
            <CpuChipIcon class="w-4 h-4" />
            <span>¿Tienes una necesidad técnica específica en tu empresa?</span>
          </div>
          <h4 class="text-lg sm:text-2xl font-bold text-white">
            Diseñamos el software o la estructura de soporte adaptada exactamente a tu flujo de trabajo.
          </h4>
          <p class="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Desde la configuración de terminales de cobro hasta plataformas web completas con bases de datos seguras.
          </p>
        </div>

        <a 
          href="#contacto"
          class="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 transition-all shrink-0"
        >
          Solicitar Evaluación Técnica
        </a>
      </div>

    </div>
  </section>
</template>
