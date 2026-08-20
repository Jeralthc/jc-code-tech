<script setup>
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const comparisonRows = [
  {
    feature: 'Enfoque Integral (Hardware + Software)',
    traditional: 'Solo arreglan el equipo físico o solo tocan el código',
    jc: 'Diagnóstico 360°: conectamos cables y programamos el sistema'
  },
  {
    feature: 'Soporte Especializado en Puntos de Venta (POS)',
    traditional: 'Desconocen el software de cobro o la red local',
    jc: 'Mantenimiento preventivo integral de cajas y conectividad'
  },
  {
    feature: 'Digitalización de Inventarios & Bases de Datos',
    traditional: 'Hojas de cálculo vulnerables y desorganizadas',
    jc: 'Bases de datos relacionales seguras (MySQL / PostgreSQL)'
  },
  {
    feature: 'Tiempo de Respuesta ante Emergencias',
    traditional: 'Días de espera o derivación a terceros',
    jc: 'Atención prioritaria y soporte técnico ágil'
  },
  {
    feature: 'Desarrollo de Software a la Medida',
    traditional: 'Plantillas genéricas difíciles de adaptar',
    jc: 'Aplicaciones creadas exactamente para tu flujo de trabajo'
  },
  {
    feature: 'Políticas de Respaldo & Seguridad',
    traditional: 'Inexistentes o manuales propensas a olvido',
    jc: 'Estrategia de copias de seguridad continuas y protegidas'
  }
];
</script>

<template>
  <section class="py-24 bg-slate-950 relative overflow-hidden border-t border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <span>Ventaja Competitiva</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          ¿Por qué unificar tu tecnología con JC Code &amp; Tech?
        </h2>
        <p class="mt-4 text-base sm:text-lg text-slate-400">
          La mayoría de las empresas pierden tiempo coordinando múltiples técnicos aislados. Nosotros eliminamos la brecha técnica.
        </p>
      </div>

      <!-- Comparison Table / Cards -->
      <div class="glass-card rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-800 bg-slate-900/80">
                <th class="p-5 sm:p-6 text-sm font-bold text-slate-300 uppercase tracking-wider w-1/3">Área de Evaluación</th>
                <th class="p-5 sm:p-6 text-sm font-bold text-rose-400 uppercase tracking-wider w-1/3">Proveedores Tradicionales</th>
                <th class="p-5 sm:p-6 text-sm font-bold text-cyan-400 uppercase tracking-wider w-1/3 bg-cyan-950/30">JC Code &amp; Tech</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 text-sm">
              <tr v-for="(row, idx) in comparisonRows" :key="idx" class="hover:bg-slate-900/40 transition-colors">
                <td class="p-5 sm:p-6 font-semibold text-white">
                  {{ row.feature }}
                </td>
                <td class="p-5 sm:p-6 text-slate-400">
                  <div class="flex items-start gap-2">
                    <XMarkIcon class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{{ row.traditional }}</span>
                  </div>
                </td>
                <td class="p-5 sm:p-6 text-slate-200 bg-cyan-950/20 font-medium">
                  <div class="flex items-start gap-2">
                    <CheckIcon class="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <span class="text-cyan-100">{{ row.jc }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </section>
</template>
