<script setup>
const technologies = [
  { name: 'Vue.js 3', category: 'Frontend Moderno', color: 'text-emerald-400' },
  { name: 'Node.js', category: 'Backend & APIs', color: 'text-green-500' },
  { name: 'PostgreSQL', category: 'Bases de Datos', color: 'text-blue-400' },
  { name: 'MySQL', category: 'Bases de Datos Relacionales', color: 'text-amber-400' },
  { name: 'Python', category: 'Automatización & Scripts', color: 'text-yellow-400' },
  { name: 'Windows Server', category: 'Servidores & Dominio', color: 'text-sky-400' },
  { name: 'Linux OS', category: 'Sistemas & Estabilidad', color: 'text-orange-400' },
  { name: 'Redes LAN / WiFi', category: 'Cableado & Conectividad', color: 'text-cyan-400' },
  { name: 'Sistemas POS', category: 'Puntos de Venta & Hardware', color: 'text-indigo-400' },
  { name: 'Git & GitHub', category: 'Control de Versiones', color: 'text-rose-400' },
  { name: 'Tailwind CSS', category: 'Diseño UI / UX', color: 'text-teal-400' },
  { name: 'Vite', category: 'Build Tools', color: 'text-purple-400' },
];
</script>

<template>
  <section id="stack" class="relative py-14 bg-slate-950/80 border-y border-slate-800/60 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
      <p class="text-xs font-bold tracking-widest text-slate-400 uppercase">
        Dominio de Tecnologías, Entornos y Estándares de Industria:
      </p>
    </div>

    <!-- Tech Badges Grid / Continuous Marquee -->
    <div class="relative w-full overflow-hidden">
      <!-- Gradient Fades on edges -->
      <div class="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none"></div>
      <div class="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none"></div>

      <div class="flex space-x-6 animate-marquee whitespace-nowrap py-2">
        <!-- First set -->
        <div 
          v-for="(tech, index) in technologies" 
          :key="'tech-1-' + index"
          class="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/80 transition-all duration-300 shadow-sm shrink-0"
        >
          <div class="w-2 h-2 rounded-full bg-cyan-400"></div>
          <span :class="['font-bold text-sm font-mono tracking-tight', tech.color]">{{ tech.name }}</span>
          <span class="text-2xs text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/50">{{ tech.category }}</span>
        </div>

        <!-- Duplicated set for seamless loop -->
        <div 
          v-for="(tech, index) in technologies" 
          :key="'tech-2-' + index"
          class="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/80 transition-all duration-300 shadow-sm shrink-0"
        >
          <div class="w-2 h-2 rounded-full bg-cyan-400"></div>
          <span :class="['font-bold text-sm font-mono tracking-tight', tech.color]">{{ tech.name }}</span>
          <span class="text-2xs text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/50">{{ tech.category }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
