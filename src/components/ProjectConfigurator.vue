<script setup>
import { ref, computed } from 'vue';
import {
  GlobeAltIcon,
  ShoppingBagIcon,
  CalculatorIcon,
  CircleStackIcon,
  CheckIcon,
  PaperAirplaneIcon
} from '@heroicons/vue/24/outline';
import { WHATSAPP_NUMBER } from '../siteConfig';

// Tipos de páginas y sistemas web con su rango orientativo.
const webTypes = [
  { id: 'landing', name: 'Página web comercial', desc: 'Quién eres, tus servicios y botón a WhatsApp.', timeline: '5 a 7 días', baseMin: 120, baseMax: 190, icon: GlobeAltIcon },
  { id: 'catalogo', name: 'Catálogo con pedidos a WhatsApp', desc: 'Productos con fotos y precios; el pedido te llega ordenado.', timeline: '1 a 2 semanas', baseMin: 220, baseMax: 350, icon: ShoppingBagIcon },
  { id: 'calculadora', name: 'Calculadora de costos / cotizador', desc: 'Costeo por receta, mermas y precios sugeridos, o cotizaciones en PDF.', timeline: '2 a 3 semanas', baseMin: 350, baseMax: 550, icon: CalculatorIcon },
  { id: 'inventario', name: 'Inventario y ventas', desc: 'Entradas, salidas, stock en tiempo real y reportes.', timeline: '3 a 4 semanas', baseMin: 450, baseMax: 750, icon: CircleStackIcon }
];

const addons = ref([
  { id: 'whatsapp_cart', label: 'Carrito con pedido a WhatsApp', priceMin: 30, priceMax: 50, selected: false },
  { id: 'admin_panel', label: 'Panel para editar precios y fotos', priceMin: 60, priceMax: 90, selected: false },
  { id: 'pdf_reports', label: 'Presupuestos y notas de entrega en PDF', priceMin: 50, priceMax: 80, selected: false },
  { id: 'cloud_backup', label: 'Respaldos automáticos en la nube', priceMin: 30, priceMax: 50, selected: true }
]);

const selectedTypeId = ref('landing');
const businessName = ref('');

const selectedType = computed(() => webTypes.find(t => t.id === selectedTypeId.value) || webTypes[0]);
const estimate = computed(() => {
  let min = selectedType.value.baseMin;
  let max = selectedType.value.baseMax;
  addons.value.filter(a => a.selected).forEach(a => { min += a.priceMin; max += a.priceMax; });
  return { min, max };
});

const whatsappUrl = computed(() => {
  const extras = addons.value.filter(a => a.selected).map(a => `• ${a.label}`).join('\n') || '• Sin módulos adicionales';
  const text = [
    '¡Hola Jeralth! 👋 Usé el cotizador de tu página:',
    `• Negocio: ${businessName.value.trim() || 'Mi negocio'}`,
    `• Solución: ${selectedType.value.name} (${selectedType.value.timeline})`,
    '• Módulos:',
    extras,
    `• Rango orientativo: $${estimate.value.min} - $${estimate.value.max} USD`,
    '',
    '¿Podemos conversar para afinar detalles?'
  ].join('\n');
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
});
</script>

<template>
  <section id="cotizador" class="py-14 sm:py-20 border-t border-slate-800/80 bg-slate-900/30">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto">
        <span class="text-xs font-semibold uppercase tracking-widest text-cyan-400">Cotizador</span>
        <h2 class="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">¿Cuánto cuesta tu web o sistema?</h2>
        <p class="mt-3 text-slate-400">Elige una opción y obtén un rango orientativo al instante.</p>
      </div>

      <div class="mt-10 grid lg:grid-cols-5 gap-5 items-start">
        <div class="lg:col-span-3 space-y-5">
          <!-- Tipo de solución -->
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="wt in webTypes" :key="wt.id" type="button"
              :class="['text-left rounded-2xl border p-4 transition-all cursor-pointer',
                selectedTypeId === wt.id ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'border-slate-800 bg-slate-950/60 hover:border-slate-600']"
              @click="selectedTypeId = wt.id"
            >
              <component :is="wt.icon" :class="['w-5 h-5', selectedTypeId === wt.id ? 'text-cyan-300' : 'text-slate-400']" />
              <p class="mt-2 text-sm font-bold text-white leading-snug">{{ wt.name }}</p>
              <p class="hidden sm:block mt-1 text-xs text-slate-400 leading-relaxed">{{ wt.desc }}</p>
              <p class="mt-2 text-xs font-mono text-cyan-300">${{ wt.baseMin }} – ${{ wt.baseMax }}</p>
            </button>
          </div>

          <!-- Módulos -->
          <div class="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p class="text-sm font-semibold text-white mb-2">Módulos opcionales</p>
            <div class="grid sm:grid-cols-2 gap-1">
              <label v-for="a in addons" :key="a.id" class="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-slate-900 cursor-pointer">
                <input v-model="a.selected" type="checkbox" class="accent-cyan-500 w-4 h-4" />
                <span class="text-sm text-slate-300 flex-1">{{ a.label }}</span>
                <span class="text-xs font-mono text-slate-500">+${{ a.priceMin }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Resumen -->
        <div class="lg:col-span-2 lg:sticky lg:top-28 rounded-2xl border border-cyan-500/30 bg-slate-950 p-5 sm:p-6 shadow-2xl">
          <p class="text-sm text-slate-400">{{ selectedType.name }}</p>
          <p class="mt-1 text-3xl sm:text-4xl font-extrabold font-mono text-white">${{ estimate.min }} – ${{ estimate.max }}</p>
          <p class="mt-1 text-sm text-slate-400">USD · entrega en {{ selectedType.timeline }}</p>
          <ul class="mt-4 space-y-1.5 text-sm text-slate-300">
            <li class="flex gap-2"><CheckIcon class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />Entregas por etapas para que veas avances</li>
            <li class="flex gap-2"><CheckIcon class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />Presupuesto formal cerrado tras conversar</li>
          </ul>
          <input v-model="businessName" type="text" placeholder="Nombre de tu negocio (opcional)"
            class="mt-5 w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" />
          <a :href="whatsappUrl" target="_blank" rel="noopener"
            class="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 py-3.5 text-sm font-bold text-white transition-colors">
            <PaperAirplaneIcon class="w-5 h-5" />Enviar por WhatsApp
          </a>
          <p class="mt-3 text-xs text-slate-500 text-center">¿Soporte para cajas o redes? Se cotiza tras una visita: <a :href="`https://wa.me/${WHATSAPP_NUMBER}`" target="_blank" rel="noopener" class="text-cyan-300 hover:underline">escríbeme</a>.</p>
        </div>
      </div>
    </div>
  </section>
</template>
