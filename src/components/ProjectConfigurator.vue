<script setup>
import { ref, computed } from 'vue';
import { 
  GlobeAltIcon,
  ShoppingBagIcon,
  CalculatorIcon,
  CircleStackIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  PhoneIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline';

// Tipos de Páginas y Sistemas Web
const webTypes = [
  {
    id: 'landing',
    name: 'Web Comercial / Landing Page',
    badge: 'Para Captar Clientes',
    desc: 'Ideal para profesionales, clínicas, consultorios o empresas de servicios. Muestra quién eres, tus servicios, casos de éxito y botón directo a WhatsApp para recibir prospectos.',
    timeline: '5 a 7 días hábiles',
    baseMin: 120,
    baseMax: 190,
    icon: GlobeAltIcon,
    color: 'text-cyan-400',
    border: 'border-cyan-500/40',
    bg: 'bg-cyan-950/30'
  },
  {
    id: 'catalogo',
    name: 'Catálogo con Pedidos a WhatsApp',
    badge: 'Tienda Fácil sin Complicaciones',
    desc: 'Ideal para tiendas de ropa, repuestos, bodegones o cosméticos. Tus clientes navegan por categorías con fotos y precios, arman su pedido y te lo envían ordenado a WhatsApp.',
    timeline: '1 a 2 semanas',
    baseMin: 220,
    baseMax: 350,
    icon: ShoppingBagIcon,
    color: 'text-amber-400',
    border: 'border-amber-500/40',
    bg: 'bg-amber-950/30'
  },
  {
    id: 'calculadora',
    name: 'Calculadora de Costos / Cotizador',
    badge: 'Automatización Operativa',
    desc: 'Como El Caldero. Sistema interactivo para costeo exacto por receta, cálculo de mermas, gastos fijos y precios de venta sugeridos, o cotizador automático en PDF.',
    timeline: '2 a 3 semanas',
    baseMin: 350,
    baseMax: 550,
    icon: CalculatorIcon,
    color: 'text-purple-400',
    border: 'border-purple-500/40',
    bg: 'bg-purple-950/30'
  },
  {
    id: 'inventario',
    name: 'Sistema de Inventario & Ventas',
    badge: 'Gestión Integral del Negocio',
    desc: 'Plataforma web privada en la nube para registrar entradas y salidas de mercancía, stock en tiempo real, ventas diarias y reportes accesibles desde cualquier teléfono o PC.',
    timeline: '3 a 4 semanas',
    baseMin: 450,
    baseMax: 750,
    icon: CircleStackIcon,
    color: 'text-emerald-400',
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-950/30'
  }
];

const selectedTypeId = ref('landing');

// Características y Módulos Adicionales
const addons = ref([
  {
    id: 'whatsapp_cart',
    label: 'Carrito de compras con pedido ordenado a WhatsApp',
    desc: 'El cliente selecciona productos y te envía el detalle listo para facturar.',
    priceMin: 30,
    priceMax: 50,
    selected: true
  },
  {
    id: 'admin_panel',
    label: 'Panel administrativo para editar precios y fotos',
    desc: 'Actualiza tus propios productos y textos fácilmente sin depender de nadie.',
    priceMin: 60,
    priceMax: 90,
    selected: false
  },
  {
    id: 'pdf_reports',
    label: 'Generador de presupuestos y notas de entrega en PDF',
    desc: 'Descarga documentos formales con el logo de tu empresa en un clic.',
    priceMin: 50,
    priceMax: 80,
    selected: false
  },
  {
    id: 'cloud_backup',
    label: 'Copias de seguridad automáticas en la nube',
    desc: 'Respaldo diario de tus registros para que tu información nunca se pierda.',
    priceMin: 30,
    priceMax: 50,
    selected: true
  }
]);

const clientName = ref('');
const businessName = ref('');

const selectedType = computed(() => {
  return webTypes.find(t => t.id === selectedTypeId.value) || webTypes[0];
});

const estimatedCalculation = computed(() => {
  let min = selectedType.value.baseMin;
  let max = selectedType.value.baseMax;

  addons.value.forEach(add => {
    if (add.selected) {
      min += add.priceMin;
      max += add.priceMax;
    }
  });

  return {
    min,
    max,
    range: `$${min} - $${max} USD`,
    timeline: selectedType.value.timeline
  };
});

const generatedWhatsAppUrl = computed(() => {
  const nameStr = clientName.value ? encodeURIComponent(clientName.value) : 'Cliente Interesado';
  const bizStr = businessName.value ? encodeURIComponent(businessName.value) : 'Mi Negocio / Empresa';
  
  const activeAddons = addons.value
    .filter(a => a.selected)
    .map(a => `• ${a.label}`)
    .join('%0A');

  const text = `¡Hola Jeralth! 👋%0A%0AHe configurado una propuesta para mi proyecto web en tu simulador:%0A• *Nombre:* ${nameStr}%0A• *Empresa / Negocio:* ${bizStr}%0A• *Tipo de Web:* ${encodeURIComponent(selectedType.value.name)}%0A• *Plazo Estimado:* ${encodeURIComponent(selectedType.value.timeline)}%0A• *Características incluidas:*%0A${activeAddons || '• Configuración básica'}%0A• *Presupuesto Orientativo:* ${encodeURIComponent(estimatedCalculation.value.range)}%0A%0A¿Podemos coordinar para afinar detalles y comenzar?`;

  return `https://wa.me/584247130583?text=${text}`;
});

const techSupportWhatsAppUrl = 'https://wa.me/584247130583?text=' + encodeURIComponent('¡Hola Jeralth! 👋 Requiero servicio técnico / diagnóstico para mis cajas de cobro (Stellar POS) o cableado de red en Mérida. ¿Podemos coordinar una visita técnica?');
</script>

<template>
  <section id="cotizador" class="py-24 bg-slate-900/40 relative overflow-hidden border-t border-slate-800/80 font-sans">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4">
          <SparklesIcon class="w-4 h-4" />
          <span>SIMULADOR DE PROYECTO WEB</span>
        </div>
        <h2 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Configura tu Sitio o Sistema Web
        </h2>
        <p class="mt-4 text-base sm:text-lg text-slate-400">
          Selecciona el tipo de solución web que tu negocio necesita, los módulos que deseas incluir y conoce el proceso de construcción con una estimación honesta y transparente.
        </p>
      </div>

      <!-- Main Configurator Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
        
        <!-- Left: Options & Construction Process (Span 7) -->
        <div class="lg:col-span-7 space-y-8">
          
          <!-- Step 1: Choose Web Type -->
          <div class="p-6 sm:p-7 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5 shadow-xl">
            <div class="flex items-center justify-between pb-3 border-b border-slate-800">
              <span class="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <span>01 //</span>
                <span>¿Qué tipo de solución web necesitas?</span>
              </span>
              <span class="text-3xs font-mono text-slate-500 uppercase">Selecciona 1 opción</span>
            </div>

            <!-- Web Types Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                v-for="wt in webTypes" 
                :key="wt.id"
                @click="selectedTypeId = wt.id"
                :class="[
                  'p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group',
                  selectedTypeId === wt.id 
                    ? 'bg-slate-950 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] scale-[1.02]' 
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                ]"
              >
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <div :class="['w-10 h-10 rounded-xl flex items-center justify-center border', wt.bg, wt.border, wt.color]">
                      <component :is="wt.icon" class="w-5 h-5" />
                    </div>
                    <span class="text-3xs font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400">
                      {{ wt.timeline }}
                    </span>
                  </div>

                  <h3 class="text-sm font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                    {{ wt.name }}
                  </h3>
                  <span class="text-3xs font-mono text-cyan-400/90 block mb-2 font-medium">
                    {{ wt.badge }}
                  </span>
                  <p class="text-xs text-slate-300 leading-relaxed font-normal">
                    {{ wt.desc }}
                  </p>
                </div>

                <div class="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-2xs">
                  <span class="text-slate-500 font-mono">Inversión base:</span>
                  <span class="font-mono font-bold text-white">${{ wt.baseMin }} - ${{ wt.baseMax }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Addons & Features -->
          <div class="p-6 sm:p-7 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-xl">
            <div class="flex items-center justify-between pb-3 border-b border-slate-800">
              <span class="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <span>02 //</span>
                <span>Características &amp; Módulos Adicionales</span>
              </span>
              <span class="text-3xs font-mono text-slate-500 uppercase">Personaliza a tu gusto</span>
            </div>

            <div class="space-y-3">
              <label 
                v-for="addon in addons" 
                :key="addon.id"
                class="flex items-start justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
              >
                <div class="flex items-start gap-3 pr-4">
                  <input 
                    type="checkbox" 
                    v-model="addon.selected"
                    class="mt-1 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <strong class="text-xs text-white block">{{ addon.label }}</strong>
                    <span class="text-2xs text-slate-400 leading-snug block mt-0.5">{{ addon.desc }}</span>
                  </div>
                </div>
                <span class="text-2xs font-mono text-slate-400 shrink-0 pt-0.5">
                  +${{ addon.priceMin }}-${{ addon.priceMax }}
                </span>
              </label>
            </div>
          </div>

          <!-- Step 3: Construction Process Description -->
          <div class="p-6 sm:p-7 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-xl">
            <div class="flex items-center gap-2 pb-2 border-b border-slate-800">
              <ClockIcon class="w-4 h-4 text-emerald-400" />
              <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                03 // Cómo se Construye tu Proyecto Web
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                <span class="text-3xs font-mono font-bold text-cyan-400 uppercase block">Fase 01 &bull; Diseño</span>
                <h4 class="text-xs font-bold text-white">Estructura &amp; Estilo</h4>
                <p class="text-3xs text-slate-400 leading-relaxed">
                  Definimos secciones, colores y textos atractivos pensados para tu cliente ideal y adaptados a celular.
                </p>
              </div>

              <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                <span class="text-3xs font-mono font-bold text-purple-400 uppercase block">Fase 02 &bull; Desarrollo</span>
                <h4 class="text-xs font-bold text-white">Programación Limpia</h4>
                <p class="text-3xs text-slate-400 leading-relaxed">
                  Carga de productos/servicios, botones directos a WhatsApp, base de datos y optimización de velocidad.
                </p>
              </div>

              <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                <span class="text-3xs font-mono font-bold text-emerald-400 uppercase block">Fase 03 &bull; Lanzamiento</span>
                <h4 class="text-xs font-bold text-white">Pruebas &amp; Entrega</h4>
                <p class="text-3xs text-slate-400 leading-relaxed">
                  Publicación en tu dominio propio, pruebas finales y breve capacitación para que manejes tu sistema.
                </p>
              </div>
            </div>
          </div>

        </div>

        <!-- Right: Live Proposal Summary (Span 5 Sticky) -->
        <div class="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div class="p-7 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.6)] space-y-6">
            
            <div class="flex items-center justify-between pb-3 border-b border-slate-800 font-mono text-xs">
              <span class="text-cyan-400 font-bold uppercase tracking-wider">// RESUMEN DE TU WEB</span>
              <span class="text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full text-2xs border border-emerald-500/30 font-semibold">
                ESTIMACIÓN INMEDIATA
              </span>
            </div>

            <!-- Client Info Inputs -->
            <div class="space-y-3 font-mono text-xs">
              <div>
                <label class="block text-2xs uppercase text-slate-400 mb-1">Tu Nombre o Cargo:</label>
                <input 
                  v-model="clientName" 
                  type="text" 
                  placeholder="Ej. Roberto Gómez (Gerente)" 
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs font-sans transition-colors"
                />
              </div>

              <div>
                <label class="block text-2xs uppercase text-slate-400 mb-1">Nombre de tu Empresa / Negocio:</label>
                <input 
                  v-model="businessName" 
                  type="text" 
                  placeholder="Ej. Bodegón La Sierra / Restaurante" 
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs font-sans transition-colors"
                />
              </div>
            </div>

            <!-- Selected Summary Box -->
            <div class="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 font-mono text-xs text-slate-300 space-y-2.5">
              <div class="text-2xs text-slate-400 uppercase tracking-wider font-bold">Configuración Elegida:</div>
              
              <div class="flex items-center justify-between text-2xs">
                <span>Tipo de Web:</span>
                <span class="text-cyan-400 font-bold text-right">{{ selectedType.name }}</span>
              </div>

              <div class="flex items-center justify-between text-2xs">
                <span>Plazo de Entrega:</span>
                <span class="text-emerald-400 font-semibold">{{ estimatedCalculation.timeline }}</span>
              </div>

              <div class="pt-2 border-t border-slate-800/80 text-3xs space-y-1">
                <span class="text-slate-400 block font-semibold uppercase">Módulos activos:</span>
                <div v-for="a in addons.filter(x => x.selected)" :key="a.id" class="text-slate-300 flex items-center gap-1.5">
                  <span class="text-cyan-400">&bull;</span>
                  <span class="truncate">{{ a.label }}</span>
                </div>
              </div>
            </div>

            <!-- Price & Timeline Box -->
            <div class="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-center space-y-1">
              <span class="text-2xs font-mono text-slate-400 uppercase tracking-wider block">Rango de Inversión Orientativo:</span>
              <div class="text-2xl font-black text-cyan-400 font-mono tracking-tight">
                {{ estimatedCalculation.range }}
              </div>
              <span class="text-2xs text-slate-400 block font-sans">
                Entrega progresiva con pruebas reales. Presupuesto formal cerrado tras conversar.
              </span>
            </div>

            <!-- WhatsApp Direct Dispatch -->
            <a 
              :href="generatedWhatsAppUrl" 
              target="_blank"
              class="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-4 text-xs font-mono font-bold text-white shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] hover:scale-[1.02] transition-all cursor-pointer"
            >
              <PaperAirplaneIcon class="w-4 h-4" />
              <span>ENVIAR MI CONFIGURACIÓN A WHATSAPP</span>
            </a>

            <div class="flex items-center justify-center gap-2 text-2xs text-slate-400 font-mono">
              <ShieldCheckIcon class="w-4 h-4 text-cyan-400" />
              <span>Respuesta técnica directa el mismo día hábil.</span>
            </div>

          </div>
        </div>

      </div>

      <!-- Dedicated Banner for Hardware / POS / Cabling Support via WhatsApp -->
      <div class="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-2 text-center md:text-left max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-3xs font-mono uppercase tracking-wider font-semibold">
            <WrenchScrewdriverIcon class="w-3.5 h-3.5" />
            <span>Soporte Técnico en Sitio &bull; Mérida</span>
          </div>
          <h3 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
            ¿Necesitas Servicio Técnico para Puntos de Venta (Stellar POS) o Cables de Red?
          </h3>
          <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            El soporte físico para cajas de cobro, balanzas, impresoras térmicas y cableado de red requiere una inspección presencial directa en tu local comercial. Por eso, evaluamos tu caso y coordinamos la visita técnica directamente por WhatsApp.
          </p>
        </div>

        <a 
          :href="techSupportWhatsAppUrl" 
          target="_blank"
          class="shrink-0 inline-flex items-center gap-2.5 rounded-2xl bg-slate-950 border border-emerald-500/40 hover:border-emerald-400 px-6 py-4 text-xs font-mono font-bold text-emerald-400 hover:text-white hover:bg-emerald-600 transition-all shadow-lg hover:scale-105"
        >
          <PhoneIcon class="w-4 h-4" />
          <span>Consultar Soporte Técnico por WhatsApp &rarr;</span>
        </a>
      </div>

    </div>
  </section>
</template>
