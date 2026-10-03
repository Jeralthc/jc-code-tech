<script setup>
import { ref } from 'vue';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  EyeIcon, 
  SparklesIcon,
  CheckBadgeIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/vue/24/outline';

const projects = [
  {
    id: 'logisync',
    title: 'LogiSync: Portal de Citas & Recepción con ERP',
    client: 'Sector Logístico & Cadenas Comerciales',
    badge: 'Sistema Empresarial',
    badgeColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/30',
    summary: 'Plataforma para programar ventanas de descarga de camiones, sincronizada con el ERP corporativo. Reemplazó cientos de llamadas y desorden en muelle.',
    features: [
      'Selector interactivo de horarios por turno y muelle',
      'Validación de facturas, peso en toneladas y tipo de vehículo',
      'Notificaciones automáticas por correo a compradores y transportistas',
      'Sincronización bidireccional automática con ERP'
    ],
    tags: ['Desarrollo Web Full-Stack', 'Integración ERP', 'Gestión de Turnos'],
    images: [
      {
        src: '/images/projects/logisync-dashboard.png',
        caption: 'Panel de Citas Programadas con estado en tiempo real y sincronización ERP'
      },
      {
        src: '/images/projects/logisync-horarios.png',
        caption: 'Selector interactivo de horarios disponibles por muelle y día'
      },
      {
        src: '/images/projects/logisync-formulario.png',
        caption: 'Formulario inteligente de despacho con cálculo de horas de descarga'
      }
    ]
  },
  {
    id: 'caldero',
    title: 'Calculadora de Costos & Rentabilidad Gastronómica',
    client: 'Industria de Alimentos & Restaurantes (El Caldero)',
    badge: 'Software Financiero',
    badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-500/30',
    summary: 'Sistema especializado en costeo de recetas culinarias con factor de merma, matriz de prorrateo de gastos fijos (alquiler, nómina, luz) y margen neto garantizado.',
    features: [
      'Costeo exacto de ingredientes por gramo y rendimiento neto',
      'Distribución matricial de gastos fijos entre múltiples productos',
      'Cálculo automático de precio de venta sugerido según margen de ganancia',
      'Base de datos en la nube con acceso seguro multi-dispositivo'
    ],
    tags: ['Costeo de Recetas', 'Finanzas Gastronómicas', 'Desarrollo a Medida'],
    images: [
      {
        src: '/images/projects/caldero-app.png',
        caption: 'Interfaz de acceso y panel de la Calculadora de Costos en producción'
      }
    ]
  },
  {
    id: 'reportes',
    title: 'Sistema de Reportes Ejecutivos & Catálogo Web',
    client: 'Empresas de Tecnología & Seguridad',
    badge: 'Inteligencia de Negocio',
    badgeColor: 'text-purple-400 bg-purple-950/80 border-purple-500/30',
    summary: 'Dashboard administrativo para trazabilidad de ventas, generación automática de presupuestos en PDF, control de seriales y catálogo con pedidos a WhatsApp.',
    features: [
      'Métricas gerenciales de facturación y productos más rentables',
      'Catálogo interactivo para clientes con carrito de compras directo a WhatsApp',
      'Exportación oficial de presupuestos, pedidos y notas de entrega en PDF',
      'Trazabilidad de números de serie para garantías de equipos'
    ],
    tags: ['Dashboards Ejecutivos', 'Catálogo WhatsApp', 'Generación de PDFs'],
    images: [
      {
        src: '/images/projects/sistemareportes-app.png',
        caption: 'Módulo de Catálogo y Reportes Ejecutivos para clientes comerciales'
      }
    ]
  }
];

const selectedProjectIndex = ref(0);
const activeImageIndex = ref(0);
const isZoomed = ref(false);

const selectProject = (index) => {
  selectedProjectIndex.value = index;
  activeImageIndex.value = 0;
};

const nextImage = () => {
  const currentImages = projects[selectedProjectIndex.value].images;
  activeImageIndex.value = (activeImageIndex.value + 1) % currentImages.length;
};

const prevImage = () => {
  const currentImages = projects[selectedProjectIndex.value].images;
  activeImageIndex.value = (activeImageIndex.value - 1 + currentImages.length) % currentImages.length;
};
</script>

<template>
  <section id="proyectos" class="py-20 bg-slate-950 relative border-t border-slate-800/80 overflow-hidden">
    <!-- Ambient Lighting Glow -->
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      <!-- Section Header: Customer-oriented -->
      <div class="text-center max-w-2xl mx-auto mb-12">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
          <SparklesIcon class="w-3.5 h-3.5" />
          <span>Trabajos Reales &bull; Resultados Comprobados</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Sistemas Desarrollados en Producción
        </h2>
        <p class="mt-2 text-sm sm:text-base text-slate-400">
          No vendemos conceptos: aquí puedes ver capturas directas de plataformas operativas que construimos para empresas reales.
        </p>
      </div>

      <!-- Project Selector Tabs (Quick, Visual, Non-technical) -->
      <div class="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
        <button
          v-for="(proj, idx) in projects"
          :key="proj.id"
          @click="selectProject(idx)"
          :class="[
            'px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 border flex items-center gap-2',
            selectedProjectIndex === idx
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)] scale-105'
              : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
          ]"
        >
          <CheckBadgeIcon class="w-4 h-4 shrink-0 text-cyan-300" />
          <span>{{ proj.title.split(':')[0] }}</span>
        </button>
      </div>

      <!-- Main Showcase Container (Split: Left Screenshots Carousel, Right Business Value) -->
      <div class="service-card rounded-3xl p-6 sm:p-10 border border-slate-800 bg-slate-900/60 shadow-2xl">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          <!-- Left: Screenshot Frame / Carousel (7 Columns) -->
          <div class="lg:col-span-7">
            <div class="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-2xl group">
              
              <!-- Browser Mockup Window Header -->
              <div class="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                  <span class="text-3xs font-mono text-slate-400 ml-2 truncate max-w-[200px] sm:max-w-xs">
                    {{ projects[selectedProjectIndex].client }}
                  </span>
                </div>
                <span class="text-3xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                  Captura Real
                </span>
              </div>

              <!-- Main Screenshot Image -->
              <div class="relative aspect-[16/10] bg-slate-950 flex items-center justify-center overflow-hidden">
                <img 
                  :src="projects[selectedProjectIndex].images[activeImageIndex].src" 
                  :alt="projects[selectedProjectIndex].title"
                  class="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.02]"
                />

                <!-- Prev / Next Navigation Arrows (if project has multiple images) -->
                <div 
                  v-if="projects[selectedProjectIndex].images.length > 1"
                  class="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none"
                >
                  <button 
                    @click="prevImage"
                    class="pointer-events-auto w-9 h-9 rounded-full bg-slate-900/80 border border-white/20 text-white flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all shadow-lg backdrop-blur-md"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeftIcon class="w-5 h-5" />
                  </button>
                  <button 
                    @click="nextImage"
                    class="pointer-events-auto w-9 h-9 rounded-full bg-slate-900/80 border border-white/20 text-white flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all shadow-lg backdrop-blur-md"
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRightIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <!-- Caption Bar -->
              <div class="px-4 py-2 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-2xs text-slate-300">
                <span class="truncate">
                  📸 {{ projects[selectedProjectIndex].images[activeImageIndex].caption }}
                </span>
                <span 
                  v-if="projects[selectedProjectIndex].images.length > 1"
                  class="text-3xs font-mono text-slate-400 shrink-0 ml-2"
                >
                  {{ activeImageIndex + 1 }} de {{ projects[selectedProjectIndex].images.length }}
                </span>
              </div>
            </div>

            <!-- Image Thumbnail Selector (when project has multiple captures) -->
            <div 
              v-if="projects[selectedProjectIndex].images.length > 1" 
              class="flex gap-2 mt-3 overflow-x-auto pb-1"
            >
              <button
                v-for="(img, imgIdx) in projects[selectedProjectIndex].images"
                :key="imgIdx"
                @click="activeImageIndex = imgIdx"
                :class="[
                  'w-16 h-11 rounded-lg overflow-hidden border transition-all shrink-0 bg-slate-950',
                  activeImageIndex === imgIdx ? 'border-cyan-400 ring-2 ring-cyan-400/40' : 'border-slate-800 opacity-60 hover:opacity-100'
                ]"
              >
                <img :src="img.src" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Right: Business Value & Client Highlights (5 Columns) -->
          <div class="lg:col-span-5 space-y-5">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span :class="['text-3xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border', projects[selectedProjectIndex].badgeColor]">
                  {{ projects[selectedProjectIndex].badge }}
                </span>
                <span class="text-2xs text-slate-400">
                  {{ projects[selectedProjectIndex].client }}
                </span>
              </div>

              <h3 class="text-xl sm:text-2xl font-extrabold text-white">
                {{ projects[selectedProjectIndex].title }}
              </h3>
            </div>

            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {{ projects[selectedProjectIndex].summary }}
            </p>

            <!-- Key Features Checklist -->
            <div class="space-y-2">
              <span class="text-3xs font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Beneficios Operativos Logrados:
              </span>
              <ul class="space-y-1.5 text-xs text-slate-300">
                <li 
                  v-for="(feat, fIdx) in projects[selectedProjectIndex].features" 
                  :key="fIdx"
                  class="flex items-start gap-2"
                >
                  <span class="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                  <span>{{ feat }}</span>
                </li>
              </ul>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 pt-1">
              <span 
                v-for="tag in projects[selectedProjectIndex].tags" 
                :key="tag"
                class="px-2.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-3xs font-mono text-cyan-300"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Action CTA -->
            <div class="pt-3">
              <a 
                href="#contacto"
                class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:scale-105 transition-all"
              >
                <span>Solicitar una Solución Similar</span>
                <ArrowTopRightOnSquareIcon class="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>
      </div>

    </div>
  </section>
</template>
