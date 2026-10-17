<script setup>
import { ref } from 'vue';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  EyeIcon, 
  SparklesIcon, 
  CheckBadgeIcon, 
  ArrowTopRightOnSquareIcon,
  CpuChipIcon,
  ServerIcon,
  CodeBracketIcon,
  BuildingStorefrontIcon
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
  },
  {
    id: 'pos_stellar',
    title: 'Modernización de Puntos de Venta (POS) & Cajas',
    client: 'Bodegones, Supermercados & Retail en Mérida',
    badge: 'Soporte Físico & POS',
    badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/30',
    summary: 'Puesta en marcha y soporte a terminales de cobro: instalación de Stellar POS, configuración de lectoras láser de códigos, impresoras térmicas fiscales y balanzas.',
    features: [
      'Configuración integral de software Stellar POS y periféricos de cobro',
      'Base de datos MySQL / SQL Server local con respaldo automatizado diario',
      'Conexión en red local para sincronizar inventarios entre múltiples cajas',
      'Mantenimiento preventivo para eliminar bloqueos de caja en horas pico'
    ],
    tags: ['Stellar POS', 'Cajas & Periféricos', 'Soporte en Sitio'],
    images: [
      {
        src: '/images/projects/sistemareportes-app.png',
        caption: 'Arquitectura de control y sincronización de puntos de venta'
      }
    ]
  },
  {
    id: 'redes_cableado',
    title: 'Cableado Estructurado Cat6 & Servidores Locales',
    client: 'Comercios & Oficinas Corporativas',
    badge: 'Redes & Conectividad',
    badgeColor: 'text-blue-400 bg-blue-950/80 border-blue-500/30',
    summary: 'Infraestructura de red de alta fidelidad para empresas: cableado de red Cat6 certificado, balanceo de WiFi para puntos de cobro y servidores de datos protegidos.',
    features: [
      'Tendido de cable Cat6 blindado punto a punto para cajas y routers',
      'Eliminación de zonas muertas e intermitencias en transacciones bancarias',
      'Auditoría y optimización de consultas en MySQL y SQL Server',
      'Esquema de contingencia eléctrica con respaldo UPS'
    ],
    tags: ['Redes Cat6', 'Servidores MySQL', 'Cero Caídas'],
    images: [
      {
        src: '/images/projects/logisync-dashboard.png',
        caption: 'Monitoreo de enlaces y sincronización de datos continua'
      }
    ]
  }
];

const selectedProjectIndex = ref(0);
const activeImageIndex = ref(0);

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
  <section id="proyectos" class="py-24 bg-slate-950 relative border-t border-slate-800/80 overflow-hidden">
    <!-- Ambient Lighting Glow -->
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-14">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4">
          <SparklesIcon class="w-4 h-4" />
          <span>PROYECTOS DESARROLLADOS // CASOS REALES EN PRODUCCIÓN</span>
        </div>
        <h2 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Soluciones de Software &amp; Soporte en Marcha
        </h2>
        <p class="mt-4 text-base sm:text-lg text-slate-400">
          No mostramos plantillas vacías: estos son sistemas reales construidos para empresas que hoy en día optimizan sus costos, controlan inventarios y operan sin caídas.
        </p>
      </div>

      <!-- Project Selector Tabs -->
      <div class="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
        <button
          v-for="(proj, idx) in projects"
          :key="proj.id"
          @click="selectProject(idx)"
          :class="[
            'px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 border flex items-center gap-2 cursor-pointer',
            selectedProjectIndex === idx
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)] scale-105'
              : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
          ]"
        >
          <CheckBadgeIcon class="w-4 h-4 shrink-0 text-cyan-300" />
          <span>{{ proj.title.split(':')[0] }}</span>
        </button>
      </div>

      <!-- Main Showcase Container -->
      <div class="service-card rounded-3xl p-6 sm:p-10 border border-slate-800 bg-slate-900/60 shadow-2xl mb-14">
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
                  Captura de Sistema Real
                </span>
              </div>

              <!-- Main Screenshot Image -->
              <div class="relative aspect-[16/10] bg-slate-950 flex items-center justify-center overflow-hidden">
                <img 
                  :src="projects[selectedProjectIndex].images[activeImageIndex].src" 
                  :alt="projects[selectedProjectIndex].title"
                  class="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.02]"
                />

                <!-- Prev / Next Navigation Arrows -->
                <div 
                  v-if="projects[selectedProjectIndex].images.length > 1"
                  class="absolute inset-x-3 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none"
                >
                  <button 
                    @click="prevImage"
                    class="pointer-events-auto w-10 h-10 rounded-full bg-slate-900/80 border border-white/20 text-white flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all shadow-lg backdrop-blur-md cursor-pointer"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeftIcon class="w-5 h-5" />
                  </button>
                  <button 
                    @click="nextImage"
                    class="pointer-events-auto w-10 h-10 rounded-full bg-slate-900/80 border border-white/20 text-white flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all shadow-lg backdrop-blur-md cursor-pointer"
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRightIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <!-- Caption Bar -->
              <div class="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-2xs text-slate-300">
                <span class="truncate pr-2">
                  {{ projects[selectedProjectIndex].images[activeImageIndex].caption }}
                </span>
                <span v-if="projects[selectedProjectIndex].images.length > 1" class="font-mono text-cyan-400 shrink-0">
                  {{ activeImageIndex + 1 }} / {{ projects[selectedProjectIndex].images.length }}
                </span>
              </div>

            </div>
          </div>

          <!-- Right: Business Value & Technical Highlights (5 Columns) -->
          <div class="lg:col-span-5 space-y-5">
            
            <!-- Category Badge -->
            <div class="flex items-center gap-2">
              <span :class="['px-3 py-1 rounded-full text-2xs font-mono font-bold uppercase border', projects[selectedProjectIndex].badgeColor]">
                {{ projects[selectedProjectIndex].badge }}
              </span>
            </div>

            <!-- Title & Client -->
            <div>
              <h3 class="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                {{ projects[selectedProjectIndex].title }}
              </h3>
              <p class="text-xs font-mono text-cyan-400 mt-1">
                Cliente: {{ projects[selectedProjectIndex].client }}
              </p>
            </div>

            <!-- Plain Language Summary -->
            <p class="text-sm text-slate-300 leading-relaxed font-normal">
              {{ projects[selectedProjectIndex].summary }}
            </p>

            <!-- Key Functional Capabilities Checklist -->
            <div class="space-y-2 pt-2 border-t border-slate-800">
              <span class="text-2xs font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                Lo que resuelve este desarrollo:
              </span>
              <ul class="space-y-2">
                <li 
                  v-for="(feat, fIdx) in projects[selectedProjectIndex].features" 
                  :key="fIdx"
                  class="flex items-start gap-2.5 text-xs text-slate-200"
                >
                  <CheckBadgeIcon class="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{{ feat }}</span>
                </li>
              </ul>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 pt-3 border-t border-slate-800">
              <span 
                v-for="(tag, tIdx) in projects[selectedProjectIndex].tags" 
                :key="tIdx"
                class="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-2xs font-mono text-slate-400"
              >
                #{{ tag }}
              </span>
            </div>

          </div>

        </div>
      </div>

      <!-- Quick All Projects Summary Cards (Cards Grid showing all 5 solutions at a glance) -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div 
          v-for="(proj, idx) in projects" 
          :key="proj.id"
          @click="selectProject(idx)"
          :class="[
            'p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group',
            selectedProjectIndex === idx 
              ? 'bg-slate-900 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
              : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
          ]"
        >
          <div>
            <span :class="['text-3xs font-mono px-2 py-0.5 rounded border inline-block mb-2', proj.badgeColor]">
              {{ proj.badge }}
            </span>
            <h4 class="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
              {{ proj.title }}
            </h4>
          </div>
          <span class="text-3xs font-mono text-slate-400 mt-3 block pt-2 border-t border-slate-800/80">
            {{ proj.client.split('(')[0] }}
          </span>
        </div>
      </div>

    </div>
  </section>
</template>
