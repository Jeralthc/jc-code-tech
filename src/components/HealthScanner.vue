<script setup>
import { ref, computed } from 'vue';
import { 
  ShieldExclamationIcon, 
  ShieldCheckIcon, 
  ArrowRightIcon, 
  CheckIcon 
} from '@heroicons/vue/24/outline';

const checks = ref({
  posSlow: true,
  excelMessy: true,
  noBackups: false,
  wifiDeadZones: false,
  needsWebApp: false
});

const calculatedScore = computed(() => {
  let issues = 0;
  if (checks.value.posSlow) issues += 25;
  if (checks.value.excelMessy) issues += 25;
  if (checks.value.noBackups) issues += 30;
  if (checks.value.wifiDeadZones) issues += 10;
  if (checks.value.needsWebApp) issues += 10;
  
  return Math.min(100, issues);
});

const whatsappDiagnosisUrl = computed(() => {
  const selectedIssues = [];
  if (checks.value.posSlow) selectedIssues.push('Puntos de Venta lentos o caídas');
  if (checks.value.excelMessy) selectedIssues.push('Inventario desorganizado en Excel');
  if (checks.value.noBackups) selectedIssues.push('Falta de backups automáticos');
  if (checks.value.wifiDeadZones) selectedIssues.push('Zonas muertas de WiFi/red');
  if (checks.value.needsWebApp) selectedIssues.push('Requiero aplicación web a medida');

  const issuesText = selectedIssues.join(', ');
  return `https://wa.me/584227130583?text=Hola%20JC%20Code%20%26%20Tech,%20complet%C3%A9%20el%20esc%C3%A1ner%20de%20salud%20t%C3%A9cnica.%20Mis%20puntos%20cr%C3%ADticos%20son:%20${encodeURIComponent(issuesText)}.%20Deseo%20coordinar%20el%20diagn%C3%B3stico%20gratuito.`;
});
</script>

<template>
  <section id="scanner" class="py-24 bg-slate-950/90 relative overflow-hidden border-t border-slate-800/80">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4">
          <span>// 03. ESCÁNER INTERACTIVO</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Calcula el Nivel de Riesgo Técnico de tu Negocio
        </h2>
        <p class="mt-4 text-base text-slate-400">
          Marca los síntomas actuales en tus instalaciones para obtener un diagnóstico preliminar y plan de mitigación.
        </p>
      </div>

      <!-- Scanner Interface Container -->
      <div class="bento-card rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <!-- Left: Checkbox Questionnaire -->
          <div class="lg:col-span-7 space-y-4 font-mono text-xs">
            <span class="text-2xs text-slate-400 uppercase tracking-widest font-bold block mb-3">
              Selecciona las situaciones que ocurren en tu empresa:
            </span>

            <label class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all">
              <input type="checkbox" v-model="checks.posSlow" class="mt-0.5 rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700" />
              <div class="text-slate-300 font-sans text-sm">
                <strong class="text-white block font-mono text-xs font-bold">Puntos de Venta (POS) o cajas lentas</strong>
                <span class="text-xs text-slate-400">Las computadoras de cobro se traban o sufren caídas de conexión en horas de alta venta.</span>
              </div>
            </label>

            <label class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all">
              <input type="checkbox" v-model="checks.excelMessy" class="mt-0.5 rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700" />
              <div class="text-slate-300 font-sans text-sm">
                <strong class="text-white block font-mono text-xs font-bold">Inventarios en Excel desorganizados</strong>
                <span class="text-xs text-slate-400">Falta de sincronización en stock, descuadres continuos y pérdida de tiempo en reportes manuales.</span>
              </div>
            </label>

            <label class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all">
              <input type="checkbox" v-model="checks.noBackups" class="mt-0.5 rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700" />
              <div class="text-slate-300 font-sans text-sm">
                <strong class="text-white block font-mono text-xs font-bold">Sin copias de seguridad automáticas</strong>
                <span class="text-xs text-slate-400">Si un disco falla o hay un corte eléctrico, no existe certeza de recuperar la información de facturación.</span>
              </div>
            </label>

            <label class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all">
              <input type="checkbox" v-model="checks.wifiDeadZones" class="mt-0.5 rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700" />
              <div class="text-slate-300 font-sans text-sm">
                <strong class="text-white block font-mono text-xs font-bold">Zonas muertas de WiFi o cables sueltos</strong>
                <span class="text-xs text-slate-400">La señal de internet no cubre todo el local comercial o el cableado está desordenado.</span>
              </div>
            </label>

            <label class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all">
              <input type="checkbox" v-model="checks.needsWebApp" class="mt-0.5 rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700" />
              <div class="text-slate-300 font-sans text-sm">
                <strong class="text-white block font-mono text-xs font-bold">Necesito un sistema web / control de citas</strong>
                <span class="text-xs text-slate-400">Deseo automatizar procesos internos para que mi equipo y clientes operen digitalmente.</span>
              </div>
            </label>
          </div>

          <!-- Right: Live Result Meter -->
          <div class="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span class="text-2xs font-mono text-slate-400 uppercase tracking-wider mb-2">Índice de Fricción Operativa</span>
            
            <div class="text-5xl font-extrabold font-mono mb-2" :class="calculatedScore > 40 ? 'text-rose-400' : 'text-emerald-400'">
              {{ calculatedScore }}%
            </div>
            
            <div class="text-xs font-mono font-semibold uppercase px-3 py-1 rounded-full mb-6" :class="calculatedScore > 40 ? 'bg-rose-950 text-rose-300 border border-rose-500/30' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'">
              {{ calculatedScore > 40 ? 'Requiere Intervención Preventiva' : 'Nivel Estable' }}
            </div>

            <p class="text-xs text-slate-400 leading-relaxed mb-6 font-sans">
              {{ calculatedScore > 40 
                ? 'Tu negocio presenta vulnerabilidades que ponen en riesgo ventas o pérdida de información crítica. Un diagnóstico técnico resolverá estos cuellos de botella.'
                : 'Tu infraestructura cuenta con una base aceptable, pero la optimización de software y bases de datos puede elevar drásticamente la productividad.' 
              }}
            </p>

            <a 
              :href="whatsappDiagnosisUrl" 
              target="_blank"
              class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-xs font-mono font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-[1.02] transition-all"
            >
              <span>SOLICITAR CORRECCIÓN VÍA WHATSAPP</span>
              <ArrowRightIcon class="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>
