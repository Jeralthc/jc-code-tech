<script setup>
import { ref, computed } from 'vue';
import { 
  PaperAirplaneIcon, 
  WrenchScrewdriverIcon, 
  CodeBracketIcon, 
  CpuChipIcon, 
  CheckBadgeIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline';

const posCount = ref('1 a 2 cajas');
const needsNetworking = ref(true);
const needsDatabase = ref(true);
const needsWebApp = ref(false);
const supportType = ref('diagnostico'); // 'diagnostico', 'mensual'
const clientName = ref('');
const businessName = ref('');

const generatedWhatsAppUrl = computed(() => {
  const nameStr = clientName.value ? encodeURIComponent(clientName.value) : 'Cliente';
  const bizStr = businessName.value ? encodeURIComponent(businessName.value) : 'Comercio/Empresa';
  
  const text = `¡Hola JC Code & Tech! 👋%0A%0AHe armado una propuesta con el *Configurador de Proyectos*:%0A• *Contacto:* ${nameStr}%0A• *Negocio:* ${bizStr}%0A• *Puntos de Venta (POS):* ${encodeURIComponent(posCount.value)}%0A• *Red LAN / WiFi:* ${needsNetworking.value ? 'Sí, requiero instalación/optimización' : 'No requiero por ahora'}%0A• *Base de Datos / Inventario SQL:* ${needsDatabase.value ? 'Sí, digitalización requerida' : 'No requerida'}%0A• *Aplicación Web / Dashboard:* ${needsWebApp.value ? 'Sí, software a medida requerido' : 'No requerido'}%0A• *Modalidad de Interés:* ${supportType.value === 'mensual' ? 'Póliza de Soporte Mensual B2B' : 'Diagnóstico Inicial Gratuito'}%0A%0A¿Podemos coordinar para evaluar la propuesta técnica?`;

  return `https://wa.me/584227130583?text=${text}`;
});
</script>

<template>
  <section id="configurador" class="py-24 bg-slate-900/60 relative overflow-hidden border-t border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4">
          <SparklesIcon class="w-4 h-4" />
          <span>// 05. CONFIGURADOR INTERACTIVO</span>
        </div>
        <h2 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Personaliza tu Solución Técnica
        </h2>
        <p class="mt-4 text-base sm:text-lg text-slate-400">
          Selecciona las necesidades exactas de tu comercio o empresa para armar una propuesta técnica inmediata.
        </p>
      </div>

      <!-- Configurator Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left: Interactive Options Panel (Span 7) -->
        <div class="lg:col-span-7 space-y-6">
          
          <!-- Step A: Hardware & POS -->
          <div class="bento-card rounded-3xl p-7 border border-slate-800 space-y-4">
            <div class="flex items-center gap-2.5 text-cyan-400 font-mono text-xs font-bold uppercase pb-2 border-b border-slate-800">
              <CpuChipIcon class="w-4 h-4" />
              <span>Paso 01: Infraestructura &amp; Puntos de Venta</span>
            </div>

            <div>
              <label class="block text-xs font-mono text-slate-300 mb-2 uppercase">Cantidad de Cajas / POS:</label>
              <div class="grid grid-cols-3 gap-3 font-mono text-xs">
                <button
                  type="button"
                  v-for="opt in ['1 a 2 cajas', '3 a 5 cajas', '+5 cajas']"
                  :key="opt"
                  @click="posCount = opt"
                  :class="[
                    'py-2.5 px-3 rounded-xl border text-center font-bold transition-all',
                    posCount === opt ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md' : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  ]"
                >
                  {{ opt }}
                </button>
              </div>
            </div>

            <div class="pt-2">
              <label class="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 cursor-pointer">
                <div class="text-xs text-slate-300">
                  <strong class="text-white block font-mono">Cableado LAN &amp; Optimización WiFi</strong>
                  <span class="text-2xs text-slate-400">Conectar puntos de cobro y eliminar zonas lentas de internet.</span>
                </div>
                <input type="checkbox" v-model="needsNetworking" class="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700 w-4 h-4" />
              </label>
            </div>
          </div>

          <!-- Step B: Software & Datos -->
          <div class="bento-card rounded-3xl p-7 border border-slate-800 space-y-4">
            <div class="flex items-center gap-2.5 text-purple-400 font-mono text-xs font-bold uppercase pb-2 border-b border-slate-800">
              <CodeBracketIcon class="w-4 h-4" />
              <span>Paso 02: Software &amp; Bases de Datos</span>
            </div>

            <div class="space-y-3 font-mono text-xs">
              <label class="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/30 cursor-pointer">
                <div class="text-xs text-slate-300 font-sans">
                  <strong class="text-white block font-mono text-xs">Digitalización de Inventarios (SQL)</strong>
                  <span class="text-2xs text-slate-400">Migrar de Excel a base de datos relacional segura en MySQL / PostgreSQL.</span>
                </div>
                <input type="checkbox" v-model="needsDatabase" class="rounded text-purple-500 focus:ring-0 bg-slate-950 border-slate-700 w-4 h-4" />
              </label>

              <label class="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/30 cursor-pointer">
                <div class="text-xs text-slate-300 font-sans">
                  <strong class="text-white block font-mono text-xs">App Web Interna / Dashboard a Medida</strong>
                  <span class="text-2xs text-slate-400">Plataforma personalizada para control de citas, asistencia o ventas en Vue.js.</span>
                </div>
                <input type="checkbox" v-model="needsWebApp" class="rounded text-purple-500 focus:ring-0 bg-slate-950 border-slate-700 w-4 h-4" />
              </label>
            </div>
          </div>

          <!-- Step C: Modalidad -->
          <div class="bento-card rounded-3xl p-7 border border-slate-800 space-y-4">
            <div class="flex items-center gap-2.5 text-emerald-400 font-mono text-xs font-bold uppercase pb-2 border-b border-slate-800">
              <WrenchScrewdriverIcon class="w-4 h-4" />
              <span>Paso 03: Modalidad de Soporte</span>
            </div>

            <div class="grid grid-cols-2 gap-4 font-mono text-xs">
              <button
                type="button"
                @click="supportType = 'diagnostico'"
                :class="[
                  'p-4 rounded-xl border text-left transition-all',
                  supportType === 'diagnostico' ? 'bg-emerald-950/60 border-emerald-500/60 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-400'
                ]"
              >
                <strong class="block text-white mb-1">Diagnóstico Inicial</strong>
                <span class="text-2xs text-slate-400">Inspección y cotización puntual sin compromiso.</span>
              </button>

              <button
                type="button"
                @click="supportType = 'mensual'"
                :class="[
                  'p-4 rounded-xl border text-left transition-all',
                  supportType === 'mensual' ? 'bg-emerald-950/60 border-emerald-500/60 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-400'
                ]"
              >
                <strong class="block text-white mb-1">Soporte Mensual B2B</strong>
                <span class="text-2xs text-slate-400">Mantenimiento preventivo recurrente y monitoreo.</span>
              </button>
            </div>
          </div>

        </div>

        <!-- Right: Live Proposal Card & WhatsApp Trigger (Span 5) -->
        <div class="lg:col-span-5 lg:sticky lg:top-28">
          <div class="hud-panel rounded-3xl p-8 border border-cyan-500/40 shadow-2xl space-y-6">
            
            <div class="flex items-center justify-between pb-4 border-b border-slate-800 font-mono text-xs">
              <span class="text-cyan-400 font-bold">// RESUMEN TÉCNICO</span>
              <span class="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">LISTO PARA ENVIAR</span>
            </div>

            <!-- Customer inputs -->
            <div class="space-y-3 font-mono text-xs">
              <div>
                <label class="block text-2xs uppercase text-slate-400 mb-1">Tu Nombre:</label>
                <input 
                  v-model="clientName" 
                  type="text" 
                  placeholder="Ej. Roberto García" 
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs font-sans"
                />
              </div>

              <div>
                <label class="block text-2xs uppercase text-slate-400 mb-1">Nombre de tu Negocio / Empresa:</label>
                <input 
                  v-model="businessName" 
                  type="text" 
                  placeholder="Ej. Supermercado El Faro" 
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs font-sans"
                />
              </div>
            </div>

            <!-- Specification Summary -->
            <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 font-mono text-xs text-slate-300 space-y-2">
              <div class="text-2xs text-slate-400 uppercase tracking-wider">Alcance Configurado:</div>
              <div class="flex items-center justify-between text-2xs">
                <span>Puntos de Venta (POS):</span>
                <span class="text-cyan-400 font-bold">{{ posCount }}</span>
              </div>
              <div class="flex items-center justify-between text-2xs">
                <span>Red &amp; Cableado LAN:</span>
                <span :class="needsNetworking ? 'text-emerald-400' : 'text-slate-500'">{{ needsNetworking ? 'Incluido' : 'No' }}</span>
              </div>
              <div class="flex items-center justify-between text-2xs">
                <span>Inventario SQL:</span>
                <span :class="needsDatabase ? 'text-purple-400' : 'text-slate-500'">{{ needsDatabase ? 'Incluido' : 'No' }}</span>
              </div>
              <div class="flex items-center justify-between text-2xs">
                <span>App Web / Dashboard:</span>
                <span :class="needsWebApp ? 'text-purple-400' : 'text-slate-500'">{{ needsWebApp ? 'Incluido' : 'No' }}</span>
              </div>
              <div class="flex items-center justify-between text-2xs pt-2 border-t border-slate-800">
                <span>Modalidad:</span>
                <span class="text-cyan-300 font-bold uppercase">{{ supportType === 'mensual' ? 'Póliza Mensual' : 'Diagnóstico Inicial' }}</span>
              </div>
            </div>

            <!-- WhatsApp Instant Button -->
            <a 
              :href="generatedWhatsAppUrl" 
              target="_blank"
              class="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-4 text-sm font-mono font-bold text-white shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] hover:scale-[1.02] transition-all"
            >
              <PaperAirplaneIcon class="w-5 h-5" />
              <span>ENVIAR A WHATSAPP (0422-7130583)</span>
            </a>

            <p class="text-center font-mono text-2xs text-slate-400">
              Respuesta en menos de 2 horas hábiles. Sin compromisos.
            </p>

          </div>
        </div>

      </div>

    </div>
  </section>
</template>
