<script setup>
import { ref, onMounted } from 'vue';
import { ChatBubbleLeftRightIcon, PlusCircleIcon, PaperAirplaneIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';
import { StarIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import { supabase } from '../crm/supabase';

const SERVICES = [
  'Sistemas & Software Web a Medida',
  'Calculadora de Costos & Rentabilidad',
  'Sistema de Citas, Turnos o Logística',
  'Sistema de Reportes & Catálogo Web',
  'Soporte Técnico a Cajas / Stellar POS',
  'Instalación / Cableado de Red Comercial'
];

const showForm = ref(false);
const submitted = ref(false);
const sending = ref(false);
const error = ref('');
const reviews = ref([]);
const loading = ref(true);
const emptyReview = () => ({ name: '', business: '', service: SERVICES[0], rating: 5, comment: '' });
const newReview = ref(emptyReview());

// Solo se muestran las opiniones aprobadas desde el CRM (Supabase + RLS).
onMounted(async () => {
  const { data } = await supabase
    .from('testimonials')
    .select('id, name, business, service, rating, comment, created_at')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(12);
  reviews.value = data || [];
  loading.value = false;
});

const submitReview = async () => {
  error.value = '';
  const r = newReview.value;
  if (r.name.trim().length < 2) { error.value = 'Escribe tu nombre.'; return; }
  if (r.comment.trim().length < 10) { error.value = 'Cuéntanos un poco más (mínimo 10 caracteres).'; return; }
  sending.value = true;
  const { error: err } = await supabase.from('testimonials').insert({
    name: r.name.trim(),
    business: r.business.trim(),
    service: r.service,
    rating: Number(r.rating),
    comment: r.comment.trim()
  });
  sending.value = false;
  if (err) { error.value = 'No se pudo enviar tu opinión. Intenta de nuevo en un momento.'; return; }
  newReview.value = emptyReview();
  submitted.value = true;
};

const closeForm = () => {
  showForm.value = !showForm.value;
  submitted.value = false;
  error.value = '';
};

const getInitials = (name) => {
  const parts = String(name || '').trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return (parts[0] || 'CL').slice(0, 2).toUpperCase();
};
const formatDate = (iso) => new Date(iso).toLocaleDateString('es-VE', { year: 'numeric', month: 'short' });
</script>

<template>
  <section id="comentarios" class="py-20 bg-slate-900/50 relative border-t border-slate-800/80">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
        <div class="text-center sm:text-left">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
            <ChatBubbleLeftRightIcon class="w-3.5 h-3.5" />
            <span>Opiniones de clientes</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Lo que dicen quienes han trabajado conmigo
          </h2>
          <p class="text-sm text-slate-400 mt-1">
            Opiniones reales de clientes. Cada comentario se revisa antes de publicarse.
          </p>
        </div>

        <button
          @click="closeForm"
          class="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:scale-105 transition-all cursor-pointer"
        >
          <PlusCircleIcon v-if="!showForm" class="w-4 h-4" />
          <XMarkIcon v-else class="w-4 h-4" />
          <span>{{ showForm ? 'Cerrar' : 'Dejar mi opinión' }}</span>
        </button>
      </div>

      <!-- Formulario -->
      <div v-if="showForm" class="mb-12 p-6 sm:p-8 rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-2xl">
        <div class="max-w-2xl mx-auto">
          <div v-if="submitted" class="text-center py-6 space-y-3">
            <CheckCircleIcon class="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 class="text-lg font-bold text-white">¡Gracias por tu opinión!</h3>
            <p class="text-sm text-slate-400">La revisaré y aparecerá publicada aquí en breve.</p>
          </div>

          <template v-else>
            <h3 class="text-lg font-bold text-white mb-1">Comparte tu experiencia</h3>
            <p class="text-sm text-slate-400 mb-6">Tu comentario se publicará con tu nombre y negocio después de una breve revisión.</p>

            <form @submit.prevent="submitReview" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1.5">Tu nombre *</label>
                  <input v-model="newReview.name" type="text" maxlength="80" required placeholder="Ej. Juan Pérez"
                    class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1.5">Empresa o negocio (opcional)</label>
                  <input v-model="newReview.business" type="text" maxlength="100" placeholder="Ej. Distribuidora El Sol"
                    class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1.5">Servicio recibido</label>
                  <select v-model="newReview.service"
                    class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400">
                    <option v-for="s in SERVICES" :key="s" :value="s">{{ s }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1.5">Calificación</label>
                  <div class="flex items-center gap-1 pt-1">
                    <button v-for="star in 5" :key="star" type="button" :aria-label="`${star} estrellas`"
                      class="p-1 transition-transform hover:scale-110 cursor-pointer" @click="newReview.rating = star">
                      <StarIcon :class="['w-6 h-6', star <= newReview.rating ? 'text-amber-400' : 'text-slate-700']" />
                    </button>
                    <span class="text-sm text-slate-400 ml-2">{{ newReview.rating }} de 5</span>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">Tu comentario *</label>
                <textarea v-model="newReview.comment" rows="4" maxlength="800" required
                  placeholder="¿Qué problema resolvimos? ¿Cómo fue la atención?"
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"></textarea>
              </div>

              <p v-if="error" class="text-sm text-rose-400">{{ error }}</p>

              <div class="flex justify-end pt-2">
                <button type="submit" :disabled="sending"
                  class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:scale-105 transition-all disabled:opacity-60 cursor-pointer">
                  <PaperAirplaneIcon class="w-4 h-4" />
                  <span>{{ sending ? 'Enviando…' : 'Enviar opinión' }}</span>
                </button>
              </div>
            </form>
          </template>
        </div>
      </div>

      <!-- Opiniones aprobadas -->
      <div v-if="reviews.length" class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <article v-for="item in reviews" :key="item.id"
          class="service-card rounded-2xl p-5 sm:p-6 border border-slate-800 bg-slate-950/70 flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-3 mb-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {{ getInitials(item.name) }}
                </div>
                <div>
                  <h4 class="text-sm font-bold text-white leading-tight">{{ item.name }}</h4>
                  <p class="text-xs text-slate-400">{{ item.business || 'Cliente' }} · {{ formatDate(item.created_at) }}</p>
                </div>
              </div>
              <div class="flex text-amber-400 shrink-0" :aria-label="`${item.rating} de 5 estrellas`">
                <StarIcon v-for="s in item.rating" :key="s" class="w-4 h-4" />
              </div>
            </div>
            <p class="text-sm text-slate-300 leading-relaxed italic mb-3">&ldquo;{{ item.comment }}&rdquo;</p>
          </div>
          <div class="pt-3 border-t border-slate-800/80 text-xs text-cyan-400">{{ item.service }}</div>
        </article>
      </div>

      <!-- Sin opiniones aún -->
      <div v-else-if="!loading" class="text-center p-10 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 max-w-xl mx-auto space-y-3">
        <div class="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 mx-auto">
          <ChatBubbleLeftRightIcon class="w-6 h-6" />
        </div>
        <h4 class="text-base font-bold text-white">¿Hemos trabajado juntos?</h4>
        <p class="text-sm text-slate-400 leading-relaxed">Tu opinión ayuda a otros negocios a decidir. Cuéntanos cómo te fue.</p>
        <button @click="showForm = true" class="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-400 hover:text-cyan-300 pt-1 cursor-pointer">
          Escribir mi opinión &rarr;
        </button>
      </div>
    </div>
  </section>
</template>
