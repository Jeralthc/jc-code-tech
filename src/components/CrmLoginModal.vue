<script setup>
import { ref, watch } from 'vue';
import {
  LockClosedIcon, EnvelopeIcon, KeyIcon, XMarkIcon, EyeIcon, EyeSlashIcon, SparklesIcon, ArrowRightIcon,
  ShieldCheckIcon, CheckCircleIcon
} from '@heroicons/vue/24/outline';
import { signIn, sendPasswordReset, updatePassword } from '../crm/auth';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  recovery: { type: Boolean, default: false } // llegó desde el correo de "olvidé mi contraseña"
});
const emit = defineEmits(['close', 'loginSuccess', 'openDemo', 'recovered']);

const mode = ref('login'); // login | forgot | sent | recovery
const email = ref('');
const password = ref('');
const password2 = ref('');
const showPassword = ref(false);
const error = ref('');
const loading = ref(false);

watch(() => [props.isOpen, props.recovery], () => {
  error.value = '';
  password.value = password2.value = '';
  mode.value = props.recovery ? 'recovery' : 'login';
}, { immediate: true });

const run = async (fn) => {
  error.value = '';
  loading.value = true;
  try { await fn(); } catch (e) { error.value = e.message; } finally { loading.value = false; }
};

const login = () => run(async () => {
  if (!email.value.trim() || !password.value) throw new Error('Ingresa tu correo y contraseña.');
  const session = await signIn(email.value, password.value);
  emit('loginSuccess', session);
});
const forgot = () => run(async () => {
  if (!email.value.trim()) throw new Error('Escribe el correo de tu cuenta.');
  await sendPasswordReset(email.value);
  mode.value = 'sent';
});
const setNewPassword = () => run(async () => {
  if (password.value.length < 8) throw new Error('Usa al menos 8 caracteres.');
  if (password.value !== password2.value) throw new Error('Las contraseñas no coinciden.');
  await updatePassword(password.value);
  emit('recovered');
});
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto" @mousedown.self="emit('close')">
    <div class="relative w-full max-w-3xl my-8 grid md:grid-cols-2 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
      <button class="absolute top-4 right-4 z-10 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800" aria-label="Cerrar" @click="emit('close')">
        <XMarkIcon class="w-5 h-5" />
      </button>

      <!-- Demo pública -->
      <div class="relative p-7 sm:p-8 bg-gradient-to-br from-cyan-600/25 via-blue-700/15 to-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col">
        <div class="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 ring-1 ring-cyan-400/30 text-cyan-200 text-xs font-semibold">
          <SparklesIcon class="w-4 h-4" />Sin registro
        </div>
        <h3 class="text-xl font-bold text-white mt-4">Prueba el CRM en vivo</h3>
        <p class="text-sm text-slate-300 mt-2 leading-relaxed">Explora una versión completa con datos de ejemplo: pipeline de ventas, clientes, cotizaciones en PDF, proyectos y cobranzas.</p>
        <ul class="mt-5 space-y-2 text-sm text-slate-300">
          <li v-for="f in ['Pipeline con arrastrar y soltar', 'Cotizaciones por WhatsApp y PDF', 'Control de cobros y saldos', 'Agenda de seguimientos']" :key="f" class="flex items-center gap-2">
            <CheckCircleIcon class="w-4 h-4 text-cyan-300 shrink-0" />{{ f }}
          </li>
        </ul>
        <button class="mt-auto pt-7 group" @click="emit('openDemo')">
          <span class="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-slate-950 font-bold text-sm group-hover:bg-cyan-100 transition-colors">
            Abrir demo interactiva <ArrowRightIcon class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </button>
      </div>

      <!-- Acceso privado -->
      <div class="p-7 sm:p-8">
        <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <ShieldCheckIcon class="w-6 h-6" />
        </div>

        <template v-if="mode === 'login'">
          <h3 class="text-xl font-bold text-white mt-4">Mi espacio privado</h3>
          <p class="text-sm text-slate-400 mt-1">Acceso exclusivo para administrar tus clientes reales.</p>
          <form class="space-y-4 mt-6" @submit.prevent="login">
            <div>
              <label class="crm-label">Correo</label>
              <div class="relative">
                <EnvelopeIcon class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input v-model="email" type="email" autocomplete="username" class="crm-input pl-10" placeholder="tu@correo.com" />
              </div>
            </div>
            <div>
              <label class="crm-label">Contraseña</label>
              <div class="relative">
                <KeyIcon class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" class="crm-input pl-10 pr-10" placeholder="••••••••" />
                <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300" :aria-label="showPassword ? 'Ocultar' : 'Mostrar'" @click="showPassword = !showPassword">
                  <EyeSlashIcon v-if="showPassword" class="w-4 h-4" /><EyeIcon v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
            <p v-if="error" class="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-sm">{{ error }}</p>
            <button type="submit" class="crm-btn-primary w-full" :disabled="loading"><LockClosedIcon class="w-4 h-4" />{{ loading ? 'Verificando…' : 'Iniciar sesión' }}</button>
            <button type="button" class="w-full text-xs text-slate-400 hover:text-cyan-300" @click="mode = 'forgot'; error = ''">¿Olvidaste tu contraseña?</button>
          </form>
        </template>

        <template v-else-if="mode === 'forgot'">
          <h3 class="text-xl font-bold text-white mt-4">Recuperar acceso</h3>
          <p class="text-sm text-slate-400 mt-1">Te enviaremos un enlace para crear una nueva contraseña.</p>
          <form class="space-y-4 mt-6" @submit.prevent="forgot">
            <input v-model="email" type="email" class="crm-input" placeholder="tu@correo.com" />
            <p v-if="error" class="text-sm text-rose-300">{{ error }}</p>
            <button type="submit" class="crm-btn-primary w-full" :disabled="loading">{{ loading ? 'Enviando…' : 'Enviar enlace' }}</button>
            <button type="button" class="w-full text-xs text-slate-400 hover:text-white" @click="mode = 'login'">Volver</button>
          </form>
        </template>

        <template v-else-if="mode === 'sent'">
          <h3 class="text-xl font-bold text-white mt-4">Revisa tu correo</h3>
          <p class="text-sm text-slate-400 mt-2">Si <strong class="text-white">{{ email }}</strong> tiene una cuenta, recibirás un enlace para restablecer tu contraseña.</p>
          <button class="crm-btn-secondary w-full mt-6" @click="mode = 'login'">Volver al inicio de sesión</button>
        </template>

        <template v-else>
          <h3 class="text-xl font-bold text-white mt-4">Crea tu nueva contraseña</h3>
          <form class="space-y-4 mt-6" @submit.prevent="setNewPassword">
            <input v-model="password" type="password" autocomplete="new-password" class="crm-input" placeholder="Nueva contraseña (mín. 8)" />
            <input v-model="password2" type="password" autocomplete="new-password" class="crm-input" placeholder="Repite la contraseña" />
            <p v-if="error" class="text-sm text-rose-300">{{ error }}</p>
            <button type="submit" class="crm-btn-primary w-full" :disabled="loading">{{ loading ? 'Guardando…' : 'Guardar y entrar' }}</button>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>
