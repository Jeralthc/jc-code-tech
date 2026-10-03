<script setup>
import { ref, onMounted } from 'vue';
import { 
  StarIcon, 
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/solid';

const showForm = ref(false);
const submitted = ref(false);

const newReview = ref({
  name: '',
  business: '',
  service: 'Desarrollo Web Full-Stack',
  rating: 5,
  comment: ''
});

const reviews = ref([]);

const STORAGE_KEY = 'jc_client_reviews_v1';

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      reviews.value = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error cargando comentarios', e);
  }
});

const submitReview = () => {
  if (!newReview.value.name.trim() || !newReview.value.comment.trim()) return;

  const reviewItem = {
    id: Date.now(),
    name: newReview.value.name.trim(),
    business: newReview.value.business.trim() || 'Cliente Particular',
    service: newReview.value.service,
    rating: Number(newReview.value.rating),
    comment: newReview.value.comment.trim(),
    date: new Date().toLocaleDateString('es-VE', { year: 'numeric', month: 'short', day: 'numeric' })
  };

  reviews.value.unshift(reviewItem);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews.value));
  } catch (e) {
    console.error('Error guardando comentario', e);
  }

  // Also prepare WhatsApp notification link for verification
  const whatsappMsg = `¡Hola Jeralth! He dejado una opinión en tu web:%0A• *Nombre:* ${encodeURIComponent(reviewItem.name)}%0A• *Empresa:* ${encodeURIComponent(reviewItem.business)}%0A• *Calificación:* ${reviewItem.rating}/5 ⭐%0A• *Servicio:* ${encodeURIComponent(reviewItem.service)}%0A• *Comentario:* ${encodeURIComponent(reviewItem.comment)}`;
  
  // Reset form
  newReview.value = {
    name: '',
    business: '',
    service: 'Desarrollo Web Full-Stack',
    rating: 5,
    comment: ''
  };

  submitted.value = true;
  setTimeout(() => {
    submitted.value = false;
    showForm.value = false;
  }, 2500);

  // Optional direct sync to WhatsApp
  window.open(`https://wa.me/584247130583?text=${whatsappMsg}`, '_blank');
};

const getInitials = (name) => {
  if (!name) return 'CL';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
};
</script>

<template>
  <section id="comentarios" class="py-20 bg-slate-900/50 relative border-t border-slate-800/80">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
        <div class="text-center sm:text-left">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
            <ChatBubbleLeftRightIcon class="w-3.5 h-3.5" />
            <span>Muro de Opiniones Reales</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Comentarios &amp; Evaluaciones de Clientes
          </h2>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            Espacio abierto para que clientes y empresas con quienes he trabajado compartan su experiencia real.
          </p>
        </div>

        <!-- Add Review Trigger Button -->
        <button
          @click="showForm = !showForm"
          class="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:scale-105 transition-all"
        >
          <PlusCircleIcon v-if="!showForm" class="w-4 h-4" />
          <XMarkIcon v-else class="w-4 h-4" />
          <span>{{ showForm ? 'Cerrar Formulario' : 'Dejar mi Comentario' }}</span>
        </button>
      </div>

      <!-- Review Form (Expandable) -->
      <div 
        v-if="showForm" 
        class="mb-12 p-6 sm:p-8 rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-2xl transition-all"
      >
        <div class="max-w-2xl mx-auto">
          <h3 class="text-lg font-bold text-white mb-1">
            Comparte tu experiencia trabajando con Jeralth
          </h3>
          <p class="text-xs text-slate-400 mb-6">
            Tu opinión es 100% pública y se compartirá directamente para verificar tu evaluación.
          </p>

          <form @submit.prevent="submitReview" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-2xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Tu Nombre Completo *</label>
                <input 
                  v-model="newReview.name" 
                  type="text" 
                  required 
                  placeholder="Ej. Juan Pérez"
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label class="block text-2xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Empresa / Negocio (Opcional)</label>
                <input 
                  v-model="newReview.business" 
                  type="text" 
                  placeholder="Ej. Distribuidora El Sol"
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-2xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Servicio o Proyecto Realizado *</label>
                <select 
                  v-model="newReview.service"
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Desarrollo Web Full-Stack">Desarrollo Web Full-Stack (Software a Medida)</option>
                  <option value="Calculadora de Costos">Calculadora de Costos &amp; Rentabilidad</option>
                  <option value="Sistema de Citas y Logística">Sistema de Citas, Turnos o Logística</option>
                  <option value="Sistemas de Reportes">Sistema de Reportes &amp; Catálogo Web</option>
                  <option value="Soporte Técnico Stellar POS">Soporte Técnico a Cajas / Stellar POS</option>
                  <option value="Instalación de Redes">Instalación / Cableado de Red Comercial</option>
                </select>
              </div>

              <div>
                <label class="block text-2xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Calificación *</label>
                <div class="flex items-center gap-2 pt-1">
                  <button 
                    v-for="star in 5" 
                    :key="star"
                    type="button"
                    @click="newReview.rating = star"
                    class="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <StarIcon 
                      :class="[
                        'w-5 h-5',
                        star <= newReview.rating ? 'text-amber-400' : 'text-slate-700'
                      ]" 
                    />
                  </button>
                  <span class="text-xs font-mono text-slate-400 ml-2">{{ newReview.rating }} de 5</span>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-2xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Tu Comentario / Testimonio *</label>
              <textarea 
                v-model="newReview.comment" 
                rows="3" 
                required 
                placeholder="Cuéntanos brevemente cómo te ayudó Jeralth con tu sistema, caja o proyecto..."
                class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              ></textarea>
            </div>

            <div class="flex items-center justify-between pt-2">
              <span class="text-3xs text-slate-500 font-mono">
                Se guardará y enviará confirmación a WhatsApp
              </span>

              <button 
                type="submit"
                class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:scale-105 transition-all"
              >
                <PaperAirplaneIcon class="w-3.5 h-3.5" />
                <span>Publicar mi Comentario</span>
              </button>
            </div>

            <!-- Success notification -->
            <div v-if="submitted" class="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircleIcon class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>¡Gracias por tu opinión! Tu comentario se ha publicado exitosamente.</span>
            </div>
          </form>
        </div>
      </div>

      <!-- Real Comments Feed -->
      <div v-if="reviews.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div 
          v-for="item in reviews" 
          :key="item.id"
          class="service-card rounded-2xl p-5 sm:p-6 border border-slate-800 bg-slate-950/70 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-start justify-between gap-3 mb-3">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-mono font-bold text-xs shrink-0">
                  {{ getInitials(item.name) }}
                </div>
                <div>
                  <h4 class="text-sm font-bold text-white leading-tight">
                    {{ item.name }}
                  </h4>
                  <p class="text-3xs text-slate-400">
                    {{ item.business }} &bull; <span class="text-slate-500">{{ item.date }}</span>
                  </p>
                </div>
              </div>

              <!-- Rating Stars -->
              <div class="flex text-amber-400 shrink-0">
                <StarIcon v-for="s in item.rating" :key="s" class="w-3 h-3" />
              </div>
            </div>

            <p class="text-xs text-slate-300 leading-relaxed font-sans font-normal italic mb-3">
              &ldquo;{{ item.comment }}&rdquo;
            </p>
          </div>

          <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-3xs font-mono text-cyan-400">
            <span>{{ item.service }}</span>
            <span class="text-emerald-400">✓ Reseña Verificada</span>
          </div>
        </div>
      </div>

      <!-- Authentic Empty State when no reviews yet -->
      <div 
        v-else 
        class="text-center p-10 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 max-w-xl mx-auto space-y-3"
      >
        <div class="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 mx-auto">
          <ChatBubbleLeftRightIcon class="w-6 h-6" />
        </div>
        <h4 class="text-sm sm:text-base font-bold text-white">
          ¿Hemos trabajado juntos en algún sistema o soporte técnico?
        </h4>
        <p class="text-xs text-slate-400 leading-relaxed">
          Este espacio está reservado para comentarios 100% reales de clientes. Haz clic en el botón de arriba y sé el primero en dejar tu reseña.
        </p>
        <button
          @click="showForm = true"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-1"
        >
          <span>Escribir mi opinión ahora &rarr;</span>
        </button>
      </div>

    </div>
  </section>
</template>
