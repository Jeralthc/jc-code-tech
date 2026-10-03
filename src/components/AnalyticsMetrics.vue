<script setup>
import { ref, computed } from 'vue';
import { 
  ChartBarIcon, 
  CalculatorIcon, 
  TruckIcon, 
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline';

const activeTab = ref('costos');

// Interactive Calculator Simulator for Caldero
const baseIngredientCost = ref(1.20); // $1.20 materia prima
const overheadPercentage = ref(20); // 20% gastos fijos
const targetMargin = ref(35); // 35% margen objetivo

const fixedExpenseAmount = computed(() => {
  return Number((baseIngredientCost.value * (overheadPercentage.value / 100)).toFixed(2));
});

const totalProductionCost = computed(() => {
  return Number((baseIngredientCost.value + fixedExpenseAmount.value).toFixed(2));
});

const suggestedPrice = computed(() => {
  // Price = Total Cost / (1 - (margin / 100))
  const marginFactor = 1 - (targetMargin.value / 100);
  if (marginFactor <= 0) return 0;
  return Number((totalProductionCost.value / marginFactor).toFixed(2));
});

const netProfit = computed(() => {
  return Number((suggestedPrice.value - totalProductionCost.value).toFixed(2));
});

// Logistics Metrics for LogiSync
const logisticsData = [
  { day: 'Lun', before: 180, after: 40 },
  { day: 'Mar', before: 210, after: 45 },
  { day: 'Mié', before: 195, after: 35 },
  { day: 'Jue', before: 240, after: 50 },
  { day: 'Vie', before: 260, after: 55 },
  { day: 'Sáb', before: 150, after: 30 }
];
</script>

<template>
  <section id="analisis" class="py-20 bg-slate-950 relative border-t border-slate-800/80 overflow-hidden">
    <!-- Ambient Lighting Glows -->
    <div class="absolute top-1/2 right-1/4 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      <!-- Section Header -->
      <div class="text-center max-w-2xl mx-auto mb-12">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
          <ChartBarIcon class="w-3.5 h-3.5" />
          <span>Gráficas, Datos &amp; Inteligencia de Negocio</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Análisis en Tiempo Real &amp; Métricas
        </h2>
        <p class="mt-2 text-sm sm:text-base text-slate-400">
          Así es como el software que construimos transforma números desordenados en rentabilidad y decisiones claras.
        </p>
      </div>

      <!-- KPI Summary Cards (4 Pillars) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div class="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 text-center sm:text-left">
          <span class="text-3xs font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
            Costeo Gastronómico
          </span>
          <div class="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            100%
          </div>
          <p class="text-2xs text-slate-400 mt-1">Control de mermas y gastos fijos</p>
        </div>

        <div class="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 text-center sm:text-left">
          <span class="text-3xs font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1">
            Eficiencia en Muelle
          </span>
          <div class="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            -78%
          </div>
          <p class="text-2xs text-slate-400 mt-1">Reducción de espera de camiones</p>
        </div>

        <div class="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 text-center sm:text-left">
          <span class="text-3xs font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-1">
            Trazabilidad ERP
          </span>
          <div class="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            0 Colas
          </div>
          <p class="text-2xs text-slate-400 mt-1">Sincronización de compras y citas</p>
        </div>

        <div class="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 text-center sm:text-left">
          <span class="text-3xs font-mono uppercase tracking-wider text-blue-400 font-bold block mb-1">
            Continuidad POS
          </span>
          <div class="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            24/7
          </div>
          <p class="text-2xs text-slate-400 mt-1">Cajas estables y redes fijas</p>
        </div>
      </div>

      <!-- Interactive Analysis Widget -->
      <div class="service-card rounded-3xl p-6 sm:p-10 border border-slate-800 bg-slate-900/60 shadow-2xl">
        
        <!-- Toggle Tabs -->
        <div class="flex flex-wrap gap-2 border-b border-slate-800 pb-6 mb-8">
          <button 
            @click="activeTab = 'costos'"
            :class="[
            'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border flex items-center gap-2',
            activeTab === 'costos' 
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 shadow-sm' 
              : 'text-slate-400 border-transparent hover:text-white'
          ]"
          >
            <CalculatorIcon class="w-4 h-4" />
            <span>Simulador de Costeo &amp; Rentabilidad (El Caldero)</span>
          </button>

          <button 
            @click="activeTab = 'logistica'"
            :class="[
            'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border flex items-center gap-2',
            activeTab === 'logistica' 
              ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40 shadow-sm' 
              : 'text-slate-400 border-transparent hover:text-white'
          ]"
          >
            <TruckIcon class="w-4 h-4" />
            <span>Gráfica de Tiempos de Recepción (LogiSync)</span>
          </button>
        </div>

        <!-- Tab 1: Interactive Cost Calculator & Margin Breakdown -->
        <div v-if="activeTab === 'costos'" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <!-- Left Controls (5 cols) -->
          <div class="lg:col-span-5 space-y-5">
            <div>
              <span class="text-3xs font-mono text-amber-400 uppercase tracking-wider font-bold block mb-1">
                Demostración Interactiva
              </span>
              <h3 class="text-lg sm:text-xl font-bold text-white">
                Cómo Calcula la Rentabilidad Real
              </h3>
              <p class="text-xs text-slate-400 mt-1">
                Prueba ajustando los valores para ver cómo el sistema prorratea costos y garantiza tu margen de ganancia neto.
              </p>
            </div>

            <!-- Slider 1: Margen de Ganancia Objetivo -->
            <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-slate-300 font-semibold">Margen Neto Objetivo:</span>
                <span class="text-amber-400 font-mono font-bold text-sm">{{ targetMargin }}%</span>
              </div>
              <input 
                v-model="targetMargin" 
                type="range" 
                min="15" 
                max="60" 
                step="5"
                class="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div class="flex justify-between text-3xs text-slate-500 font-mono">
                <span>15% (Mínimo)</span>
                <span>60% (Premium)</span>
              </div>
            </div>

            <!-- Slider 2: Gastos Fijos (Alquiler, Luz, Nómina) -->
            <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-slate-300 font-semibold">Carga de Gastos Fijos:</span>
                <span class="text-cyan-400 font-mono font-bold text-sm">{{ overheadPercentage }}%</span>
              </div>
              <input 
                v-model="overheadPercentage" 
                type="range" 
                min="5" 
                max="40" 
                step="5"
                class="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div class="flex justify-between text-3xs text-slate-500 font-mono">
                <span>5% (Bajo)</span>
                <span>40% (Alto)</span>
              </div>
            </div>
          </div>

          <!-- Right Visual Chart & Price Breakdown (7 cols) -->
          <div class="lg:col-span-7 bg-slate-950 rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
            
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span class="text-3xs font-mono uppercase tracking-wider text-slate-400">Precio Sugerido de Venta</span>
                <div class="text-3xl sm:text-4xl font-extrabold text-white font-mono flex items-baseline gap-1">
                  <span class="text-emerald-400">${{ suggestedPrice }}</span>
                  <span class="text-xs text-slate-500 font-sans font-normal">/ unidad</span>
                </div>
              </div>

              <div class="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
                Ganancia Neta: +${{ netProfit }}
              </div>
            </div>

            <!-- Visual Bar Distribution -->
            <div class="space-y-2">
              <div class="flex justify-between text-2xs font-mono">
                <span class="text-slate-400">Distribución de cada dólar vendido:</span>
                <span class="text-slate-300 font-bold">100% Cubierto</span>
              </div>

              <div class="w-full h-7 rounded-xl overflow-hidden flex bg-slate-900 border border-slate-800 text-3xs font-mono font-bold text-slate-950 text-center leading-7">
                <div 
                  class="bg-amber-400 transition-all duration-300 truncate px-1"
                  :style="{ width: `${(baseIngredientCost / suggestedPrice) * 100}%` }"
                  title="Ingredientes"
                >
                  Ingredientes ${{ baseIngredientCost }}
                </div>
                <div 
                  class="bg-cyan-400 transition-all duration-300 truncate px-1"
                  :style="{ width: `${(fixedExpenseAmount / suggestedPrice) * 100}%` }"
                  title="Gastos Fijos"
                >
                  Fijos ${{ fixedExpenseAmount }}
                </div>
                <div 
                  class="bg-emerald-400 transition-all duration-300 truncate px-1"
                  :style="{ width: `${(netProfit / suggestedPrice) * 100}%` }"
                  title="Ganancia"
                >
                  Ganancia ${{ netProfit }}
                </div>
              </div>

              <!-- Legend -->
              <div class="flex flex-wrap gap-4 pt-2 text-2xs">
                <span class="flex items-center gap-1.5 text-slate-300">
                  <span class="w-2.5 h-2.5 rounded bg-amber-400"></span> Materia Prima (${{ baseIngredientCost }})
                </span>
                <span class="flex items-center gap-1.5 text-slate-300">
                  <span class="w-2.5 h-2.5 rounded bg-cyan-400"></span> Gastos Fijos (${{ fixedExpenseAmount }})
                </span>
                <span class="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span class="w-2.5 h-2.5 rounded bg-emerald-400"></span> Margen Neto (${{ netProfit }})
                </span>
              </div>
            </div>

            <p class="text-2xs text-slate-400 leading-relaxed italic">
              Este sistema garantiza que ningún plato o producto se venda a pérdida por no tomar en cuenta el alquiler, el gas o la nómina.
            </p>

          </div>

        </div>

        <!-- Tab 2: Logistics Wait Time Chart (Before vs After LogiSync) -->
        <div v-else class="space-y-6">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-lg sm:text-xl font-bold text-white">
                Tiempos de Descarga en Muelle (Minutos por Camión)
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">
                Comparativa real: proceso manual sin turnos vs. plataforma LogiSync con ventanas horarias sincronizadas al ERP.
              </p>
            </div>

            <!-- Legend -->
            <div class="flex items-center gap-4 text-xs font-mono">
              <span class="flex items-center gap-1.5 text-rose-400">
                <span class="w-3 h-3 rounded bg-rose-500/80"></span> Antes (Sin Citas)
              </span>
              <span class="flex items-center gap-1.5 text-cyan-400 font-bold">
                <span class="w-3 h-3 rounded bg-cyan-400"></span> Con LogiSync
              </span>
            </div>
          </div>

          <!-- SVG Bar Chart -->
          <div class="bg-slate-950 p-6 rounded-2xl border border-slate-800 overflow-x-auto">
            <div class="min-w-[480px] space-y-4">
              <div 
                v-for="(item, idx) in logisticsData" 
                :key="idx"
                class="flex items-center gap-4 text-xs font-mono"
              >
                <span class="w-10 text-slate-400 font-bold">{{ item.day }}</span>
                
                <div class="flex-grow space-y-1.5">
                  <!-- Before Bar -->
                  <div class="flex items-center gap-2">
                    <div 
                      class="h-4 rounded bg-rose-500/40 border border-rose-500/50 transition-all duration-500 flex items-center justify-end pr-2 text-3xs text-rose-200"
                      :style="{ width: `${(item.before / 280) * 100}%` }"
                    >
                      {{ item.before }} min
                    </div>
                  </div>

                  <!-- After Bar (LogiSync) -->
                  <div class="flex items-center gap-2">
                    <div 
                      class="h-4 rounded bg-gradient-to-r from-cyan-500 to-blue-500 font-bold transition-all duration-500 flex items-center justify-end pr-2 text-3xs text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                      :style="{ width: `${(item.after / 280) * 100}%` }"
                    >
                      {{ item.after }} min
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-200 flex items-start gap-2.5">
            <CheckCircleIcon class="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Resultado de Negocio:</strong> Se eliminaron más de 3 horas de espera por transportista, optimizando el uso de montacargas y reduciendo reclamos entre compradores y proveedores a cero.
            </span>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>
