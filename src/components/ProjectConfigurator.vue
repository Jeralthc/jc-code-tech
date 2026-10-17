<script setup>
import { ref, computed } from 'vue';
import { 
  PaperAirplaneIcon, 
  WrenchScrewdriverIcon, 
  CodeBracketIcon, 
  CpuChipIcon, 
  CheckBadgeIcon,
  SparklesIcon,
  CalculatorIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline';

const posCount = ref('1 a 2 cajas');
const needsNetworking = ref(true);
const needsDatabase = ref(true);
const needsWebApp = ref(false);
const supportType = ref('diagnostico'); // 'diagnostico', 'mensual'
const clientName = ref('');
const businessName = ref('');

const estimatedInvestment = computed(() => {
  let min = 0;
  let max = 0;

  // POS Infrastructure
  if (posCount.value === '1 a 2 cajas') {
    min += 100;
    max += 160;
  } else if (posCount.value === '3 a 5 cajas') {
    min += 200;
    max += 320;
  } else {
    min += 350;
    max += 550;
  }

  // Cableado y Red LAN
  if (needsNetworking.value) {
    min += 120;
    max += 200;
  }

  // Base de datos / Inventarios SQL
  if (needsDatabase.value) {
    min += 180;
    max += 280;
  }

  // Web App / Software a medida
  if (needsWebApp.value) {
    min += 450;
    max += 800;
  }

  return {
    min,
    max,
    range: `$${min} - $${max} USD`,
    isMonthly: supportType.value === 'mensual'
  };
});

const generatedWhatsAppUrl = computed(() => {
  const nameStr = clientName.value ? encodeURIComponent(clientName.value) : 'Cliente Interesado';
  const bizStr = businessName.value ? encodeURIComponent(businessName.value) : 'Comercio / Empresa';
  
  const text = `¡Hola Jeralth! 👋%0A%0AHe armado una propuesta técnica con el *Simulador de Presupuesto* en tu web:%0A• *Contacto:* ${nameStr}%0A• *Empresa / Negocio:* ${bizStr}%0A• *Infraestructura POS:* ${encodeURIComponent(posCount.value)}%0A• *Cableado de Red / WiFi:* ${needsNetworking.value ? 'Sí, requerido' : 'No requerido'}%0A• *Control de Inventario / Datos:* ${needsDatabase.value ? 'Sí, requerido' : 'No requerido'}%0A• *Software / Sistema Web a Medida:* ${needsWebApp.value ? 'Sí, requerido' : 'No requerido'}%0A• *Modalidad:* ${supportType.value === 'mensual' ? 'Póliza Mensual' : 'Diagnóstico Inicial'}%0A• *Estimado Calculado:* ${encodeURIComponent(estimatedInvestment.value.range)}%0A%0A¿Podemos coordinar para evaluar el levantamiento técnico y afinar los detalles?`;

  return `https://wa.me/584227130583?text=${text}`;
});
</script>

<template>
  <section id="cotizador" class="py-24 bg-slate-900/40 relative overflow-hidden border-t border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4">
          <CalculatorIcon class="w-4 h-4" />
          <span>// COTIZADOR INTERACTIVO PARA CLIENTES</span>
        </div>
        <h2 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Simula tu Presupuesto Técnico
        </h2>
        <p class="mt-4 text-base sm:text-lg text-slate-400">
          Selecciona lo que tu negocio necesita en hardware, redes y software para calcular un rango de inversión orientativo y solicitar tu propuesta personalizada.
        </p>
      </div>

      <!-- Configurator Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left: Interactive Options Panel (Span 7) -->
        <div class="lg:col-span-7 space-y-6">
          
          <!-- Step 1: Hardware & POS -->
          <div class="p-6 sm:p-7 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
            <div class="flex items-center gap-2.5 text-cyan-400 font-mono text-xs font-bold uppercase pb-2 border-b border-slate-800">
              <CpuChipIcon class="w-4 h-4" />
              <span>Paso 01: Infraestructura &amp; Puntos de Venta (POS)</span>
            </div>

            <div>
              <label class="block text-xs font-mono text-slate-300 mb-2 uppercase">Cantidad de Cajas de Cobro:</label>
              <div class="grid grid-cols-3 gap-3 font-mono text-xs">
                <button
                  type="button"
                  v-for="opt in ['1 a 2 cajas', '3 a 5 cajas', '+5 cajas']"
                  :key="opt"
                  @click="posCount = opt"
                  :class="[
                    'py-2.5 px-3 rounded-xl border text-center font-bold transition-all',
                    posCount === opt ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md scale-[1.02]' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  ]"
                >
                  {{ opt }}
                </button>
              </div>
            </div>

            <div class="pt-2">
              <label class="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/30 cursor-pointer transition-colors">
                <div class="text-xs text-slate-300 pr-3">
                  <strong class="text-white block font-mono">Cableado de Red &amp; Conexión de Cajas</strong>
                  <span class="text-2xs text-slate-400">Conectar cajas de forma directa para evitar cobros caídos y lentitud de red.</span>
                </div>
                <input type="checkbox" v-model="needsNetworking" class="rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700 w-4 h-4" />
              </label>
            </div>
          </div>

          <!-- Step 2: Software & Datos -->
          <div class="p-6 sm:p-7 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
            <div class="flex items-center gap-2.5 text-purple-400 font-mono text-xs font-bold uppercase pb-2 border-b border-slate-800">
              <CodeBracketIcon class="w-4 h-4" />
              <span>Paso 02: Software &amp; Base de Datos</span>
            </div>

            <div class="space-y-3 font-mono text-xs">
              <label class="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/30 cursor-pointer transition-colors">
                <div class="text-xs text-slate-300 pr-3 font-sans">
                  <strong class="text-white block font-mono text-xs">Inventario Digital Organizado</strong>
                  <span class="text-2xs text-slate-400">Migra tus hojas de Excel a un sistema seguro con respaldos automáticos y acceso desde cualquier equipo.</span>
                </div>
                <input type="checkbox" v-model="needsDatabase" class="rounded text-purple-500 focus:ring-0 bg-slate-900 border-slate-700 w-4 h-4" />
              </label>

              <label class="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/30 cursor-pointer transition-colors">
                <div class="text-xs text-slate-300 pr-3 font-sans">
                  <strong class="text-white block font-mono text-xs">Software a Medida (Sistemas Web)</strong>
                  <span class="text-2xs text-slate-400">Calculadora de costos, plataforma de presupuestos o gestión de turnos, accesible desde el navegador.</span>
                </div>
                <input type="checkbox" v-model="needsWebApp" class="rounded text-purple-500 focus:ring-0 bg-slate-900 border-slate-700 w-4 h-4" />
              </label>
            </div>
          </div>

          <!-- Step 3: Modalidad -->
          <div class="p-6 sm:p-7 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
            <div class="flex items-center gap-2.5 text-emerald-400 font-mono text-xs font-bold uppercase pb-2 border-b border-slate-800">
              <WrenchScrewdriverIcon class="w-4 h-4" />
              <span>Paso 03: Modalidad de Atención</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <button
                type="button"
                @click="supportType = 'diagnostico'"
                :class="[
                  'p-4 rounded-xl border text-left transition-all',
                  supportType === 'diagnostico' ? 'bg-emerald-950/60 border-emerald-500/60 text-white shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400'
                ]"
              >
                <strong class="block text-white mb-1">Diagnóstico Inicial</strong>
                <span class="text-2xs text-slate-400">Inspección técnica presencial o remota y cotización puntual formal sin compromiso.</span>
              </button>

              <button
                type="button"
                @click="supportType = 'mensual'"
                :class="[
                  'p-4 rounded-xl border text-left transition-all',
                  supportType === 'mensual' ? 'bg-emerald-950/60 border-emerald-500/60 text-white shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400'
                ]"
              >
                <strong class="block text-white mb-1">Póliza Mensual B2B</strong>
                <span class="text-2xs text-slate-400">Mantenimiento preventivo, soporte continuo para cajas y monitoreo de base de datos.</span>
              </button>
            </div>
          </div>

        </div>

        <!-- Right: Live Proposal Card & WhatsApp Trigger (Span 5 Sticky) -->
        <div class="lg:col-span-5 lg:sticky lg:top-24">
          <div class="p-7 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.6)] space-y-6">
            
            <div class="flex items-center justify-between pb-3 border-b border-slate-800 font-mono text-xs">
              <span class="text-cyan-400 font-bold uppercase tracking-wider">// PROPUESTA ORIENTATIVA</span>
              <span class="text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full text-2xs border border-emerald-500/30 font-semibold">
                COTIZACIÓN INMEDIATA
              </span>
            </div>

            <!-- Customer inputs -->
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

            <!-- Specification Summary -->
            <div class="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 font-mono text-xs text-slate-300 space-y-2.5">
              <div class="text-2xs text-slate-400 uppercase tracking-wider font-bold">Servicios Seleccionados:</div>
              <div class="flex items-center justify-between text-2xs">
                <span>Puntos de Venta (POS):</span>
                <span class="text-cyan-400 font-bold">{{ posCount }}</span>
              </div>
              <div class="flex items-center justify-between text-2xs">
                <span>Cableado LAN / WiFi:</span>
                <span :class="needsNetworking ? 'text-emerald-400 font-semibold' : 'text-slate-600'">{{ needsNetworking ? 'Incluido' : 'No' }}</span>
              </div>
              <div class="flex items-center justify-between text-2xs">
                <span>Inventario Digital:</span>
                <span :class="needsDatabase ? 'text-purple-400 font-semibold' : 'text-slate-600'">{{ needsDatabase ? 'Incluido' : 'No' }}</span>
              </div>
              <div class="flex items-center justify-between text-2xs">
                <span>Software / App Web:</span>
                <span :class="needsWebApp ? 'text-purple-400 font-semibold' : 'text-slate-600'">{{ needsWebApp ? 'Incluido' : 'No' }}</span>
              </div>
              <div class="flex items-center justify-between text-2xs pt-2 border-t border-slate-800">
                <span>Modalidad:</span>
                <span class="text-cyan-300 font-bold uppercase">{{ supportType === 'mensual' ? 'Póliza Mensual' : 'Diagnóstico Inicial' }}</span>
              </div>
            </div>

            <!-- Financial Estimated Range -->
            <div class="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-center space-y-1">
              <span class="text-2xs font-mono text-slate-400 uppercase tracking-wider block">Rango de Inversión Estimado:</span>
              <div class="text-2xl font-black text-cyan-400 font-mono tracking-tight">
                {{ estimatedInvestment.range }}
              </div>
              <span class="text-2xs text-slate-400 block font-sans">
                {{ estimatedInvestment.isMonthly ? 'Implementación inicial + plan de mantenimiento mensual' : 'Cotización orientativa formal sujeta a inspección técnica' }}
              </span>
            </div>

            <!-- WhatsApp Instant Button -->
            <a 
              :href="generatedWhatsAppUrl" 
              target="_blank"
              class="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-4 text-xs font-mono font-bold text-white shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] hover:scale-[1.02] transition-all"
            >
              <PaperAirplaneIcon class="w-4 h-4" />
              <span>ENVIAR SOLICITUD A WHATSAPP</span>
            </a>

            <div class="flex items-center justify-center gap-2 text-2xs text-slate-400 font-mono">
              <ShieldCheckIcon class="w-4 h-4 text-cyan-400" />
              <span>Respuesta técnica directa el mismo día hábil. Presupuesto sin compromiso.</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  </section>
</template>
