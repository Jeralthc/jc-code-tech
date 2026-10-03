<script setup>
import { ref } from 'vue';
import { 
  StarIcon, 
  ChatBubbleBottomCenterTextIcon,
  CheckBadgeIcon
} from '@heroicons/vue/24/solid';
import { ArrowRightIcon } from '@heroicons/vue/24/outline';

const testimonials = [
  {
    name: 'Carlos Mendoza',
    role: 'Dirección de Operaciones',
    business: 'El Caldero (Industria de Alimentos)',
    avatar: 'CM',
    stars: 5,
    comment: 'La calculadora de costos nos quitó un dolor de cabeza enorme. Ahora costeamos recetas con mermas en segundos y sabemos el precio exacto de venta con nuestro margen de ganancia garantizado.',
    badge: 'Calculadora de Costos',
    badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-500/30'
  },
  {
    name: 'Ing. Ramón Velásquez',
    role: 'Coordinador de Logística',
    business: 'CITSUR / Distribución Comercial',
    avatar: 'RV',
    stars: 5,
    comment: 'El portal de citas y recepción conectado con el ERP corporativo eliminó por completo las colas de camiones en el muelle y las llamadas desorganizadas. Todo automatizado y trazable.',
    badge: 'LogiSync & ERP',
    badgeColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/30'
  },
  {
    name: 'Alejandro Rivas',
    role: 'Gerente Comercial',
    business: 'Empresa de Tecnología & Seguridad',
    avatar: 'AR',
    stars: 5,
    comment: 'El sistema de reportes y catálogo web nos agilizó las cotizaciones en PDF y los pedidos directos por WhatsApp. Rápido, seguro y adaptado exactamente a nuestro flujo de venta.',
    badge: 'Reportes & Catálogo',
    badgeColor: 'text-purple-400 bg-purple-950/80 border-purple-500/30'
  },
  {
    name: 'Mariana Dávila',
    role: 'Administradora de Sucursal',
    business: 'Comercio & Retail (Mérida)',
    avatar: 'MD',
    stars: 5,
    comment: 'Excelente soporte para nuestros puntos de venta con Stellar POS y los cables de red de las balanzas. Nos resolvió una falla crítica en caja en tiempo récord sin frenar las ventas.',
    badge: 'Stellar POS & Redes',
    badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/30'
  }
];
</script>

<template>
  <section id="comentarios" class="py-20 bg-slate-900/50 relative border-t border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-2xl mx-auto mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-3">
          <ChatBubbleBottomCenterTextIcon class="w-3.5 h-3.5" />
          <span>Opiniones &bull; Experiencias Reales</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Lo que Dicen Quienes Ya Han Trabajado Conmigo
        </h2>
        <p class="mt-2 text-sm sm:text-base text-slate-400">
          Resultados comprobados en el sector gastronómico, logístico, comercial y de soporte técnico en Mérida.
        </p>
      </div>

      <!-- Testimonials Grid (2x2 Clean Cards) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div 
          v-for="(item, idx) in testimonials" 
          :key="idx"
          class="service-card rounded-2xl p-6 sm:p-7 border border-slate-800/90 bg-slate-950/70 flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300"
        >
          <div>
            <!-- Top Row: Avatar + Business + Stars -->
            <div class="flex items-start justify-between gap-4 mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs font-mono shrink-0 shadow-sm">
                  {{ item.avatar }}
                </div>
                <div>
                  <h4 class="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                    <span>{{ item.name }}</span>
                    <CheckBadgeIcon class="w-4 h-4 text-cyan-400" />
                  </h4>
                  <p class="text-2xs text-slate-400">
                    {{ item.role }} &bull; <strong class="text-slate-300 font-semibold">{{ item.business }}</strong>
                  </p>
                </div>
              </div>

              <!-- 5 Stars -->
              <div class="flex items-center text-amber-400 shrink-0">
                <StarIcon v-for="s in item.stars" :key="s" class="w-3.5 h-3.5" />
              </div>
            </div>

            <!-- Comment Body -->
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-4 font-sans font-normal">
              &ldquo;{{ item.comment }}&rdquo;
            </p>
          </div>

          <!-- Bottom: Badge of implemented solution -->
          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span :class="['text-3xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border', item.badgeColor]">
              {{ item.badge }}
            </span>
            <span class="text-3xs text-slate-500 font-mono">
              Cliente Verificado
            </span>
          </div>
        </div>
      </div>

      <!-- Bottom Trust Row -->
      <div class="text-center pt-2">
        <a 
          href="#contacto"
          class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>¿Quieres ser el próximo caso de éxito en tu sector? Hablemos por WhatsApp</span>
          <ArrowRightIcon class="w-4 h-4" />
        </a>
      </div>

    </div>
  </section>
</template>
