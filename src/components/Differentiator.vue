<script setup>
import { 
  ShieldCheckIcon, 
  LockClosedIcon, 
  ClockIcon, 
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline';
</script>

<template>
  <section id="garantias" class="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-24 sm:py-32 overflow-hidden border-t border-slate-800/80">
    <!-- Ambient Lighting -->
    <div class="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none"></div>

    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <ShieldCheckIcon class="w-4 h-4" />
          <span>Blindaje &amp; Confianza</span>
        </div>
        <h2 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Tu Operación y tu Información <br />
          <span class="gradient-text-emerald">100% Protegidas</span>
        </h2>
        <p class="mt-4 text-base sm:text-lg text-slate-400">
          No solo instalamos sistemas y programamos código: asumimos el compromiso de mantener tu negocio estable y seguro.
        </p>
      </div>

      <!-- Guarantees Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Guarantee 1 -->
        <div class="glass-card rounded-2xl p-7 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
            <CheckCircleIcon class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-white mb-2">Estabilidad en Cobro</h3>
          <p class="text-sm text-slate-400 leading-relaxed">
            Priorizamos la continuidad de tus Puntos de Venta (POS) y red para que nunca pierdas una venta por problemas de hardware.
          </p>
        </div>

        <!-- Guarantee 2 -->
        <div class="glass-card rounded-2xl p-7 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
            <LockClosedIcon class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-white mb-2">Confidencialidad Total</h3>
          <p class="text-sm text-slate-400 leading-relaxed">
            Tus bases de datos, contraseñas y registros comerciales se tratan bajo estrictos acuerdos de privacidad y confidencialidad.
          </p>
        </div>

        <!-- Guarantee 3 -->
        <div class="glass-card rounded-2xl p-7 border border-slate-800 hover:border-blue-500/40 transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
            <ClockIcon class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-white mb-2">Respuesta Ágil</h3>
          <p class="text-sm text-slate-400 leading-relaxed">
            Canal de comunicación directo con atención prioritaria ante emergencias para minimizar cualquier tiempo de inactividad.
          </p>
        </div>

        <!-- Guarantee 4 -->
        <div class="glass-card rounded-2xl p-7 border border-slate-800 hover:border-purple-500/40 transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
            <SparklesIcon class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-white mb-2">Código Limpio</h3>
          <p class="text-sm text-slate-400 leading-relaxed">
            Software estructurado con tecnologías modernas (Vue, Node, SQL), modular y sin dependencias propietarias abusivas.
          </p>
        </div>

      </div>

    </div>
  </section>
</template>
