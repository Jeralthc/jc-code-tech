<script setup>
import { ref } from 'vue';
import { 
  ComputerDesktopIcon, 
  CircleStackIcon, 
  ServerIcon, 
  CodeBracketIcon, 
  ShieldCheckIcon,
  CheckCircleIcon,
  PlayIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline';

// State for Interactive POS Simulator
const posStatus = ref('active'); // 'active', 'testing', 'recovered'
const testLog = ref('Terminal POS 01: En línea y transmitiendo sin errores.');

const runPosDiagnostic = () => {
  posStatus.value = 'testing';
  testLog.value = 'Ejecutando prueba de velocidad y comunicación en caja...';
  
  setTimeout(() => {
    posStatus.value = 'recovered';
    testLog.value = '✓ Prueba completada: Latencia 14ms. Impresora e internet sincronizados.';
  }, 1400);
};

// State for SQL Inventory Simulator
const inventoryItems = ref([
  { id: 'SKU-104', name: 'Producto A (Stock Central)', qty: 142, status: 'Óptimo' },
  { id: 'SKU-209', name: 'Insumo Crítico B', qty: 28, status: 'Reabastecer' },
  { id: 'SKU-315', name: 'Equipo Terminal Venta', qty: 64, status: 'Óptimo' },
]);
</script>

<template>
  <section id="bento" class="py-24 bg-slate-950 relative overflow-hidden border-t border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4">
          <span>// 02. BENTO MATRIX</span>
        </div>
        <h2 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Matriz de Capacidades Interactivas
        </h2>
        <p class="mt-4 text-base sm:text-lg text-slate-400">
          Explora en vivo los módulos tecnológicos que desplegamos en tu negocio.
        </p>
      </div>

      <!-- Asymmetrical Bento Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
        
        <!-- ================= BENTO ITEM 1 (Span 7): POS & Hardware Test-Bench ================= -->
        <div class="lg:col-span-7 bento-card rounded-3xl p-8 border border-slate-800 flex flex-col justify-between group">
          <div>
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <ComputerDesktopIcon class="w-5 h-5" />
                </div>
                <div>
                  <span class="text-2xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">TEST-BENCH EN VIVO</span>
                  <h3 class="text-xl font-bold text-white">Mantenimiento y Estabilidad POS</h3>
                </div>
              </div>
              <button 
                @click="runPosDiagnostic"
                class="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <PlayIcon class="w-3.5 h-3.5" />
                <span>TESTEAR CAJA</span>
              </button>
            </div>

            <p class="text-sm text-slate-300 mb-6 leading-relaxed">
              Mantenemos tus computadoras de caja, impresoras fiscales y terminales de cobro operando sin bloqueos durante los momentos de mayor afluencia de clientes.
            </p>

            <!-- Interactive Terminal Output inside Bento -->
            <div class="rounded-xl bg-slate-950/90 border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-2">
              <div class="flex items-center justify-between text-2xs text-slate-400 border-b border-slate-800 pb-2">
                <span>POS_DIAGNOSTIC_CONSOLE // COM1</span>
                <span class="text-emerald-400 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  ONLINE
                </span>
              </div>
              <p class="text-cyan-300">> {{ testLog }}</p>
              <div class="flex items-center gap-4 text-2xs text-slate-400 pt-1">
                <span>Hardware: OK</span>
                <span>Puertos Fiscales: OK</span>
                <span>Latencia: 14ms</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-800/80 font-mono text-2xs text-slate-400">
            <div class="flex items-center gap-1.5 text-slate-300">
              <CheckCircleIcon class="w-4 h-4 text-cyan-400" />
              <span>Soporte L1 - L3</span>
            </div>
            <div class="flex items-center gap-1.5 text-slate-300">
              <CheckCircleIcon class="w-4 h-4 text-cyan-400" />
              <span>Limpieza &amp; Pasta</span>
            </div>
            <div class="flex items-center gap-1.5 text-slate-300">
              <CheckCircleIcon class="w-4 h-4 text-cyan-400" />
              <span>Cero Fricción</span>
            </div>
          </div>
        </div>

        <!-- ================= BENTO ITEM 2 (Span 5): SQL & Inventory Matrix ================= -->
        <div class="lg:col-span-5 bento-card rounded-3xl p-8 border border-slate-800 flex flex-col justify-between group">
          <div>
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <CircleStackIcon class="w-5 h-5" />
              </div>
              <div>
                <span class="text-2xs font-mono text-purple-400 font-bold uppercase tracking-wider block">POSTGRESQL / MYSQL</span>
                <h3 class="text-xl font-bold text-white">Inventarios &amp; Datos Relacionales</h3>
              </div>
            </div>

            <p class="text-sm text-slate-300 mb-6 leading-relaxed">
              Eliminamos el desorden de hojas de cálculo creando bases de datos relacionales robustas y digitalización de inventarios sin descuadres.
            </p>

            <!-- Mini Live Data Table -->
            <div class="rounded-xl bg-slate-950/90 border border-slate-800 p-3 font-mono text-xs space-y-2">
              <div class="text-2xs text-slate-400 uppercase tracking-wider">Tabla en Tiempo Real:</div>
              <div 
                v-for="item in inventoryItems" 
                :key="item.id"
                class="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800/80 text-2xs"
              >
                <span class="text-slate-300 font-semibold">{{ item.name }}</span>
                <div class="flex items-center gap-2">
                  <span class="text-purple-300 font-bold">{{ item.qty }} un.</span>
                  <span :class="item.status === 'Óptimo' ? 'text-emerald-400' : 'text-amber-400'">{{ item.status }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between font-mono text-xs">
            <span class="text-slate-400">Migración sin pérdidas</span>
            <span class="text-purple-400 font-bold">SQL SCHEMA 100%</span>
          </div>
        </div>

        <!-- ================= BENTO ITEM 3 (Span 5): LAN Topology & Cableado ================= -->
        <div class="lg:col-span-5 bento-card rounded-3xl p-8 border border-slate-800 flex flex-col justify-between group">
          <div>
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <ServerIcon class="w-5 h-5" />
              </div>
              <div>
                <span class="text-2xs font-mono text-blue-400 font-bold uppercase tracking-wider block">REDES ESTRUCTURADAS</span>
                <h3 class="text-xl font-bold text-white">Cableado LAN &amp; WiFi Robusto</h3>
              </div>
            </div>

            <p class="text-sm text-slate-300 mb-6 leading-relaxed">
              Diseño y ordenamiento de cableado de red, switches comerciales y cobertura WiFi en cada rincón de tu local o sucursal.
            </p>

            <div class="p-4 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
              <div class="flex items-center justify-between text-2xs text-slate-400">
                <span>ESTADO DE SWITCH &amp; PUERTOS</span>
                <span class="text-emerald-400">GIGABIT ACTIVO</span>
              </div>
              <div class="grid grid-cols-4 gap-2 pt-2 text-center text-2xs">
                <div class="p-1.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">P1: POS 1</div>
                <div class="p-1.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">P2: POS 2</div>
                <div class="p-1.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">P3: WiFi</div>
                <div class="p-1.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">P4: Server</div>
              </div>
            </div>
          </div>

          <div class="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between font-mono text-xs">
            <span class="text-slate-400">Eliminación de zonas muertas</span>
            <span class="text-blue-400 font-bold">100% CABLEADO OK</span>
          </div>
        </div>

        <!-- ================= BENTO ITEM 4 (Span 7): Vue.js Dashboards & Python Scripts ================= -->
        <div class="lg:col-span-7 bento-card rounded-3xl p-8 border border-slate-800 flex flex-col justify-between group">
          <div>
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CodeBracketIcon class="w-5 h-5" />
                </div>
                <div>
                  <span class="text-2xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">VUE.JS 3 + NODE + PYTHON</span>
                  <h3 class="text-xl font-bold text-white">Dashboards &amp; Automatización de Procesos</h3>
                </div>
              </div>
              <span class="text-2xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                APPS INTERNAS
              </span>
            </div>

            <p class="text-sm text-slate-300 mb-6 leading-relaxed">
              Programamos paneles de control interactivos, sistemas de citas, control de asistencia y scripts en Python para procesar datos automáticamente.
            </p>

            <div class="p-4 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
              <div class="text-slate-500 text-2xs">// Automatización en Python para reportes y alertas:</div>
              <p class="text-emerald-400">def <span class="text-cyan-300">sync_business_metrics</span>(db, pos_network):</p>
              <p class="text-slate-400 pl-4">report = db.generate_daily_audit()</p>
              <p class="text-slate-400 pl-4">send_whatsapp_alert(report, status="COMPLETED")</p>
              <p class="text-purple-300 pl-4">return { "uptime": "99.99%", "synced": True }</p>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-800/80 font-mono text-2xs text-slate-400">
            <div class="flex items-center gap-1.5 text-slate-300">
              <SparklesIcon class="w-4 h-4 text-emerald-400" />
              <span>Sistemas de Citas</span>
            </div>
            <div class="flex items-center gap-1.5 text-slate-300">
              <SparklesIcon class="w-4 h-4 text-emerald-400" />
              <span>Control de Asistencia</span>
            </div>
            <div class="flex items-center gap-1.5 text-slate-300">
              <SparklesIcon class="w-4 h-4 text-emerald-400" />
              <span>Alertas Automáticas</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>
