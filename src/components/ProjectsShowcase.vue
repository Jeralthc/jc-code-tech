<script setup>
import { ref } from 'vue';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  EyeIcon, 
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
    short: 'LogiSync',
    title: 'LogiSync: Portal de Citas & Recepción de Carga',
    client: 'Sector Logístico & Cadenas Comerciales',
    badge: 'Sistema Empresarial',
    badgeColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/30',
    summary: 'Plataforma web para programar turnos de descarga de camiones, conectada directamente al sistema administrativo central. Eliminó cientos de llamadas diarias y el desorden en muelles.',
    features: [
      'Selector interactivo de horarios por turno y muelle de carga',
      'Validación automática de facturas, peso en toneladas y tipo de camión',
      'Notificaciones automáticas por correo a compradores y choferes',
      'Sincronización inmediata con el sistema de inventario y compras'
    ],
    tags: ['Logística Inteligente', 'Control de Turnos', 'Sistemas a Medida'],
    images: [
      {
        src: '/images/projects/logisync-dashboard.webp',
        caption: 'Panel de Citas Programadas con estado en tiempo real'
      },
      {
        src: '/images/projects/logisync-horarios.webp',
        caption: 'Selector interactivo de horarios disponibles por muelle y día'
      },
      {
        src: '/images/projects/logisync-formulario.webp',
        caption: 'Formulario inteligente de despacho con cálculo de horas de descarga'
      }
    ]
  },
  {
    id: 'caldero',
    short: 'Costos El Caldero',
    title: 'Calculadora de Costos & Rentabilidad Gastronómica',
    client: 'Industria de Alimentos & Restaurantes (El Caldero)',
    badge: 'Software Financiero',
    badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-500/30',
    summary: 'Sistema especializado en costeo de recetas culinarias: calcula el costo real por gramo, descuenta mermas, reparte gastos fijos (alquiler, nómina, luz) y define el precio de venta ideal con margen neto asegurado.',
    features: [
      'Costeo exacto de ingredientes por gramo y rendimiento neto de porciones',
      'Distribución inteligente de gastos fijos de local entre cada plato o producto',
      'Cálculo automático del precio de venta sugerido según la ganancia deseada',
      'Acceso seguro en la nube desde el celular, tablet o computadora'
    ],
    tags: ['Costeo de Recetas', 'Finanzas Gastronómicas', 'Control de Márgenes'],
    images: [
      {
        src: '/images/projects/caldero-app.webp',
        caption: 'Interfaz de acceso y panel de la Calculadora de Costos en producción'
      }
    ]
  },
  {
    id: 'reportes',
    short: 'Reportes y catálogo',
    title: 'Sistema de Reportes Ejecutivos & Catálogo Web',
    client: 'Empresas de Tecnología & Seguridad',
    badge: 'Inteligencia de Negocio',
    badgeColor: 'text-purple-400 bg-purple-950/80 border-purple-500/30',
    summary: 'Panel administrativo para control total de ventas, generación instantánea de presupuestos oficiales en PDF, registro de seriales de garantía y catálogo con pedidos directos a WhatsApp.',
    features: [
      'Resumen visual de ventas diarias y productos más rentables del negocio',
      'Catálogo interactivo para clientes con pedidos enviados directamente a WhatsApp',
      'Generación formal de presupuestos y notas de entrega en PDF con 1 clic',
      'Control de números de serie para responder garantías de equipos sin confusiones'
    ],
    tags: ['Reportes de Ventas', 'Catálogo a WhatsApp', 'Generación de PDFs'],
    images: [
      {
        src: '/images/projects/sistemareportes-app.webp',
        caption: 'Módulo de Catálogo y Reportes Ejecutivos para clientes comerciales'
      }
    ]
  },
  {
    id: 'pos_stellar',
    short: 'Cajas POS',
    title: 'Modernización de Puntos de Venta (POS) & Cajas',
    client: 'Bodegones, Supermercados & Retail en Mérida',
    badge: 'Soporte Físico & POS',
    badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/30',
    summary: 'Puesta en marcha y soporte continuo a terminales de cobro: instalación de Stellar POS, configuración de lectoras láser de códigos, impresoras térmicas fiscales y balanzas.',
    features: [
      'Configuración integral de software Stellar POS y periféricos de cobro',
      'Base de datos protegida con respaldo automático todos los días',
      'Conexión en red local para sincronizar inventarios entre múltiples cajas',
      'Mantenimiento preventivo para eliminar bloqueos de caja en horas pico'
    ],
    tags: ['Stellar POS', 'Cajas & Periféricos', 'Soporte en Sitio'],
    images: [
      {
        src: '/images/projects/pos-checkout-setup.webp',
        illustrative: true,
        caption: 'Terminal de cobro comercial con software POS, balanza digital, lector láser e impresora térmica'
      }
    ]
  },
  {
    id: 'redes_cableado',
    short: 'Redes y servidores',
    title: 'Red de Alta Velocidad & Servidores Locales',
    client: 'Comercios & Oficinas Corporativas',
    badge: 'Redes & Conectividad',
    badgeColor: 'text-blue-400 bg-blue-950/80 border-blue-500/30',
    summary: 'Infraestructura de red estable para comercios: tendido de cables de alta velocidad punto a punto, balanceo de WiFi para puntos de cobro y servidores de datos protegidos.',
    features: [
      'Tendido de cable de red de alta velocidad punto a punto para cajas y routers',
      'Eliminación de zonas muertas e intermitencias en transacciones bancarias',
      'Mantenimiento a la base de datos para que los cobros nunca se tranquen',
      'Esquema de contingencia eléctrica con respaldo UPS ante cortes de luz'
    ],
    tags: ['Red de Alta Velocidad', 'Servidores Protegidos', 'Cero Caídas'],
    images: [
      {
        src: '/images/projects/network-server-rack.webp',
        illustrative: true,
        caption: 'Gabinete de servidor y cableado de red de alta velocidad con respaldo eléctrico continuo'
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
  <section id="proyectos" class="py-14 sm:py-20 bg-slate-950 relative border-t border-slate-800/80 overflow-hidden">
    <!-- Ambient Lighting Glow -->
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      <!-- Section Header -->
      <div class="text-center max-w-2xl mx-auto mb-8">
        <span class="text-xs font-semibold uppercase tracking-widest text-cyan-400">Proyectos reales</span>
        <h2 class="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Sistemas que ya están funcionando</h2>
        <p class="mt-3 text-slate-400">Trabajos entregados a negocios que hoy controlan mejor sus costos, inventario y ventas.</p>
      </div>

      <!-- Project Selector Tabs -->
      <div class="flex sm:flex-wrap sm:justify-center gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          v-for="(proj, idx) in projects"
          :key="proj.id"
          @click="selectProject(idx)"
          :class="[
            'shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border flex items-center gap-2 cursor-pointer whitespace-nowrap',
            selectedProjectIndex === idx
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)]'
              : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
          ]"
        >
          <CheckBadgeIcon class="w-4 h-4 shrink-0 text-cyan-300" />
          <span>{{ proj.short }}</span>
        </button>
      </div>

      <!-- Main Showcase Container -->
      <div class="service-card rounded-3xl p-4 sm:p-8 border border-slate-800 bg-slate-900/60 shadow-2xl">
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
                  {{ projects[selectedProjectIndex].images[activeImageIndex].illustrative ? 'Imagen de referencia' : 'Captura del sistema real' }}
                </span>
              </div>

              <!-- Main Screenshot Image -->
              <div class="relative aspect-[16/10] bg-slate-950 flex items-center justify-center overflow-hidden">
                <img 
                  :src="projects[selectedProjectIndex].images[activeImageIndex].src" 
                  :alt="projects[selectedProjectIndex].title"
                  loading="lazy"
                  decoding="async"
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

          </div>

        </div>
      </div>

    </div>
  </section>
</template>
