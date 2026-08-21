<script setup>
const linkedInUrl = 'https://www.linkedin.com/public-profile/settings/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_self_edit_contact_info%3BYvU0JnRKSNi6Tv%2B03l%2FOdg%3D%3D';
const githubUrl = 'https://github.com/Jeralthc';
</script>

<template>
  <footer class="bg-slate-950 border-t border-slate-800/80 pt-14 pb-12 relative overflow-hidden font-sans">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-slate-800/80">
        
        <!-- Brand & Slogan -->
        <div class="space-y-2 text-center md:text-left">
          <div class="flex items-center justify-center md:justify-start gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
              JC
            </div>
            <span class="text-lg font-extrabold tracking-tight text-white">
              JC Code <span class="text-cyan-400 font-mono">&amp;</span> Tech
            </span>
          </div>

          <p class="text-xs sm:text-sm text-slate-400 max-w-md">
            Soporte técnico para puntos de venta (POS), redes comerciales y desarrollo web a medida con Laravel y Vue.js. Sede en Mérida, Venezuela.
          </p>
        </div>

        <!-- Navigation Links -->
        <div class="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <a href="#servicios" class="hover:text-cyan-400 transition-colors">Servicios</a>
          <a href="#nosotros" class="hover:text-cyan-400 transition-colors">Sobre Mí</a>
          <a href="#metodologia" class="hover:text-cyan-400 transition-colors">Cómo Trabajamos</a>
          <a href="#faq" class="hover:text-cyan-400 transition-colors">Preguntas</a>
          <a href="#contacto" class="text-cyan-400 hover:underline">Contacto</a>
        </div>

        <!-- Social Icons -->
        <div class="flex items-center gap-3">
          <a 
            :href="linkedInUrl" 
            target="_blank" 
            rel="noopener noreferrer"
            class="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/10 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all"
            aria-label="Perfil de LinkedIn"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>

          <a 
            :href="githubUrl" 
            target="_blank" 
            rel="noopener noreferrer"
            class="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-purple-500/10 flex items-center justify-center text-slate-400 hover:text-purple-400 transition-all"
            aria-label="GitHub"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
          </a>
        </div>

      </div>

      <!-- Bottom Credits -->
      <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono text-center sm:text-left">
        <p>&copy; {{ new Date().getFullYear() }} JC Code &amp; Tech. Todos los derechos reservados.</p>
        <p class="text-slate-400">Conectamos tu infraestructura. Programamos tus soluciones.</p>
      </div>

    </div>
  </footer>
</template>
