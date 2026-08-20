<script setup>
import { ref } from 'vue';
import { 
  ServerIcon, 
  CpuChipIcon, 
  ComputerDesktopIcon, 
  CodeBracketIcon, 
  CircleStackIcon, 
  BoltIcon, 
  CheckBadgeIcon 
} from '@heroicons/vue/24/outline';

const activeLayer = ref('all');
</script>

<template>
  <section id="hub" class="py-24 bg-slate-950 relative overflow-hidden border-t border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4">
          <span>// 01. ARQUITECTURA TÉCNICA</span>
        </div>
        <h2 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          La Fusión Físico-Lógica en Tiempo Real
        </h2>
        <p class="mt-4 text-base sm:text-lg text-slate-400">
          La mayoría de los problemas en empresas ocurren en la brecha entre el hardware y el software. En JC unificamos ambas capas bajo una misma ingeniería.
        </p>
      </div>

      <!-- Interactive Dual Architecture View -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <!-- Left: Physical Infrastructure Engine (TECH) -->
        <div class="lg:col-span-5 bento-card rounded-3xl p-8 border border-cyan-500/20 shadow-2xl relative">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <CpuChipIcon class="w-6 h-6" />
              </div>
              <div>
                <span class="text-2xs font-mono text-cyan-400 uppercase tracking-widest font-bold block">CAPA FÍSICA &amp; RED</span>
                <h3 class="text-xl font-bold text-white">Hardware Core</h3>
              </div>
            </div>
            <span class="text-2xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
              OPERATIVO
            </span>
          </div>

          <div class="space-y-4 font-mono text-xs">
            <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div class="flex items-center gap-2 text-slate-200">
                <ComputerDesktopIcon class="w-4 h-4 text-cyan-400" />
                <span>Puntos de Venta (POS) &amp; Cajas</span>
              </div>
              <span class="text-cyan-400 font-bold">Mantenimiento L1-L3</span>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div class="flex items-center gap-2 text-slate-200">
                <BoltIcon class="w-4 h-4 text-cyan-400" />
                <span>Cableado LAN &amp; WiFi Estable</span>
              </div>
              <span class="text-emerald-400 font-bold">Sin Caídas</span>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div class="flex items-center gap-2 text-slate-200">
                <ServerIcon class="w-4 h-4 text-cyan-400" />
                <span>Servidores Windows / Linux</span>
              </div>
              <span class="text-cyan-400 font-bold">Backups Activos</span>
            </div>
          </div>
        </div>

        <!-- Center: Dynamic Interactive Bridge -->
        <div class="lg:col-span-2 flex flex-col items-center justify-center py-4">
          <div class="relative flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 border border-cyan-500/40 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <span class="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping"></span>
            <CheckBadgeIcon class="w-8 h-8 relative z-10" />
          </div>
          <span class="text-2xs font-mono text-cyan-400 uppercase tracking-widest mt-3 font-bold text-center">
            SINCRONIZACIÓN 360°
          </span>
        </div>

        <!-- Right: Software & Logic Engine (CODE) -->
        <div class="lg:col-span-5 bento-card rounded-3xl p-8 border border-purple-500/20 shadow-2xl relative">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <CodeBracketIcon class="w-6 h-6" />
              </div>
              <div>
                <span class="text-2xs font-mono text-purple-400 uppercase tracking-widest font-bold block">CAPA LÓGICA &amp; APPS</span>
                <h3 class="text-xl font-bold text-white">Software Core</h3>
              </div>
            </div>
            <span class="text-2xs font-mono text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-full border border-purple-500/30">
              VUE + SQL
            </span>
          </div>

          <div class="space-y-4 font-mono text-xs">
            <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div class="flex items-center gap-2 text-slate-200">
                <CircleStackIcon class="w-4 h-4 text-purple-400" />
                <span>Bases de Datos &amp; Inventarios</span>
              </div>
              <span class="text-purple-400 font-bold">PostgreSQL / MySQL</span>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div class="flex items-center gap-2 text-slate-200">
                <CodeBracketIcon class="w-4 h-4 text-purple-400" />
                <span>Dashboards &amp; Apps Internas</span>
              </div>
              <span class="text-emerald-400 font-bold">Vue 3 + Node.js</span>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div class="flex items-center gap-2 text-slate-200">
                <BoltIcon class="w-4 h-4 text-purple-400" />
                <span>Automatización &amp; Citas</span>
              </div>
              <span class="text-purple-400 font-bold">Python Scripts</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>
