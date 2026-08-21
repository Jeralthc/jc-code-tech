<script setup>
import { ref } from 'vue';
import { 
  PaperAirplaneIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline';

const form = ref({
  name: '',
  business: '',
  phone: '',
  service: 'pos',
  message: ''
});

const isSubmitted = ref(false);

const sendWhatsApp = () => {
  const serviceLabels = {
    pos: 'Mantenimiento de Puntos de Venta (Stellar POS / Otros)',
    redes: 'Instalación / Reemplazo de Cables de Red (Punto a Punto)',
    software: 'Desarrollo Web (PHP / Laravel / Vue.js)',
    databases: 'Digitalización de Inventarios (MySQL / PostgreSQL)',
    soporte: 'Plan de Soporte Mensual B2B',
    otro: 'Diagnóstico Técnico General'
  };

  const text = `¡Hola Jeralth! 👋%0A%0ASolicito un diagnóstico técnico:%0A• *Nombre:* ${encodeURIComponent(form.value.name || 'Cliente')}%0A• *Empresa/Comercio:* ${encodeURIComponent(form.value.business || 'Particular')}%0A• *Teléfono:* ${encodeURIComponent(form.value.phone || 'No especificado')}%0A• *Servicio:* ${encodeURIComponent(serviceLabels[form.value.service] || form.value.service)}%0A• *Detalle:* ${encodeURIComponent(form.value.message || 'Deseo coordinar una evaluación.')}`;

  window.open(`https://wa.me/584247130583?text=${text}`, '_blank');
  isSubmitted.value = true;
};
</script>

<template>
  <section id="contacto" class="py-24 bg-slate-900/50 relative border-t border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <!-- Left: Direct Info -->
        <div class="lg:col-span-5 space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider font-bold">
            <ChatBubbleLeftRightIcon class="w-4 h-4" />
            <span>Contacto Directo</span>
          </div>

          <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Agenda tu Diagnóstico <br />
            <span class="gradient-text-cyan">Sin Ningún Costo</span>
          </h2>

          <p class="text-base text-slate-300 leading-relaxed font-sans font-normal">
            Conversemos sobre tu negocio, tus computadoras de caja, tus cables de red o tu idea de software en PHP, Laravel o Vue. Te responderé rápidamente con una propuesta adaptada a tus necesidades.
          </p>

          <!-- Contact Cards List -->
          <div class="space-y-4 pt-2">
            
            <!-- WhatsApp / Phone -->
            <a 
              href="https://wa.me/584247130583" 
              target="_blank"
              class="service-card rounded-2xl p-5 border border-slate-800 hover:border-emerald-500/40 flex items-center gap-4 group transition-all"
            >
              <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                <PhoneIcon class="w-6 h-6" />
              </div>
              <div>
                <span class="text-2xs text-slate-400 uppercase tracking-wider font-semibold block">WhatsApp &amp; Llamadas</span>
                <strong class="text-base sm:text-lg text-white font-mono group-hover:text-emerald-400 transition-colors">+58 424-7130583 / 0422-7130583</strong>
                <span class="text-xs text-emerald-400 block">Atención rápida y personalizada</span>
              </div>
            </a>

            <!-- Email -->
            <a 
              href="mailto:jeralthc@gmail.com" 
              class="service-card rounded-2xl p-5 border border-slate-800 hover:border-cyan-500/40 flex items-center gap-4 group transition-all"
            >
              <div class="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                <EnvelopeIcon class="w-6 h-6" />
              </div>
              <div>
                <span class="text-2xs text-slate-400 uppercase tracking-wider font-semibold block">Correo Electrónico</span>
                <strong class="text-base text-white font-mono group-hover:text-cyan-400 transition-colors">jeralthc@gmail.com</strong>
                <span class="text-xs text-slate-400 block">Para solicitudes y presupuestos formales</span>
              </div>
            </a>

            <!-- Location -->
            <div class="service-card rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <MapPinIcon class="w-6 h-6" />
              </div>
              <div>
                <span class="text-2xs text-slate-400 uppercase tracking-wider font-semibold block">Ubicación Central</span>
                <strong class="text-base text-white">Mérida, Venezuela</strong>
                <span class="text-xs text-slate-400 block">Servicio presencial en comercios y remoto</span>
              </div>
            </div>

          </div>
        </div>

        <!-- Right: Fast Form -->
        <div class="lg:col-span-7">
          <div class="service-card rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl">
            <h3 class="text-2xl font-bold text-white mb-2">Envía tu Solicitud</h3>
            <p class="text-sm text-slate-400 mb-8 font-normal">Completa los datos y te responderé lo antes posible para coordinar tu atención.</p>

            <form @submit.prevent="sendWhatsApp" class="space-y-5">
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Tu Nombre *</label>
                  <input 
                    v-model="form.name" 
                    type="text" 
                    required 
                    placeholder="Ej. Carlos Mendoza" 
                    class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Nombre de tu Negocio</label>
                  <input 
                    v-model="form.business" 
                    type="text" 
                    placeholder="Ej. Minimarket La Sierra" 
                    class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Teléfono de Contacto *</label>
                  <input 
                    v-model="form.phone" 
                    type="tel" 
                    required 
                    placeholder="Ej. 0424-1234567" 
                    class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Servicio Requerido *</label>
                  <select 
                    v-model="form.service" 
                    class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
                  >
                    <option value="pos">Mantenimiento de Puntos de Venta (Stellar POS / Otros)</option>
                    <option value="redes">Instalación / Reemplazo de Cables de Red</option>
                    <option value="software">Desarrollo Web (PHP / Laravel / Vue.js)</option>
                    <option value="databases">Digitalización de Inventarios (SQL)</option>
                    <option value="soporte">Plan de Soporte Mensual</option>
                    <option value="otro">Diagnóstico Técnico General</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">¿Qué necesitas resolver o construir? *</label>
                <textarea 
                  v-model="form.message" 
                  rows="4" 
                  required 
                  placeholder="Detalla brevemente la falla que presentan tus equipos o la solución que deseas desarrollar..."
                  class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none font-sans"
                ></textarea>
              </div>

              <button 
                type="submit"
                class="w-full rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 py-4 text-base font-bold text-white shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] transition-all duration-300 flex items-center justify-center gap-2.5 hover:scale-[1.01]"
              >
                <PaperAirplaneIcon class="w-5 h-5" />
                <span>Enviar Solicitud a WhatsApp</span>
              </button>

              <div v-if="isSubmitted" class="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-sans">
                <CheckCircleIcon class="w-5 h-5 shrink-0 text-emerald-400" />
                <span>¡Mensaje preparado! Te redirigimos a WhatsApp para coordinar tu atención.</span>
              </div>

            </form>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>
