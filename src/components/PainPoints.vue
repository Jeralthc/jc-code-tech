<script setup>
import { 
  BoltIcon, 
  CircleStackIcon, 
  ShieldExclamationIcon 
} from '@heroicons/vue/24/outline';
</script>

<template>
  <section class="py-20 bg-slate-950/80 relative border-t border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-14">
        <span class="text-xs font-semibold text-rose-400 uppercase tracking-widest block mb-2 font-mono">
          Problemas Frecuentes en Comercios
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          ¿Las fallas técnicas están frenando las ventas de tu negocio?
        </h2>
        <p class="mt-4 text-base text-slate-400 leading-relaxed">
          Cada minuto con un punto de venta congelado o un inventario descontrolado se traduce en clientes molestos y dinero perdido.
        </p>
      </div>

      <!-- 3 Pain Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Pain 1 -->
        <div class="service-card rounded-2xl p-7 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-5">
              <BoltIcon class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-white mb-2">Caídas en Cajas &amp; Red Inestable</h3>
            <p class="text-sm text-slate-400 leading-relaxed">
              Equipos de cobro que se traban en plena hora pico, impresoras que no responden y WiFi que se desconecta interrumpiendo las ventas.
            </p>
          </div>
          <div class="mt-6 pt-4 border-t border-slate-800/60 text-xs text-rose-300 font-medium">
            → Solución: Mantenimiento y puntos de red directos garantizados.
          </div>
        </div>

        <!-- Pain 2 -->
        <div class="service-card rounded-2xl p-7 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5">
              <CircleStackIcon class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-white mb-2">Inventarios en Excel Desordenados</h3>
            <p class="text-sm text-slate-400 leading-relaxed">
              Llevar el stock de productos en hojas de cálculo propensas a errores, descuadres de caja y pérdida de tiempo buscando mercancía.
            </p>
          </div>
          <div class="mt-6 pt-4 border-t border-slate-800/60 text-xs text-amber-300 font-medium">
            → Solución: Base de datos relacional y software web a medida en Laravel / Vue.
          </div>
        </div>

        <!-- Pain 3 -->
        <div class="service-card rounded-2xl p-7 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
              <ShieldExclamationIcon class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-white mb-2">Pérdida de Datos y Sin Respaldos</h3>
            <p class="text-sm text-slate-400 leading-relaxed">
              Un corte eléctrico o daño de disco duro puede borrar meses de información comercial si no tienes copias de seguridad automáticas.
            </p>
          </div>
          <div class="mt-6 pt-4 border-t border-slate-800/60 text-xs text-cyan-300 font-medium">
            → Solución: Estrategia de backups automáticos y seguridad.
          </div>
        </div>

      </div>

    </div>
  </section>
</template>
