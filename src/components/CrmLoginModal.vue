<script setup>
import { ref, watch } from 'vue';
import {
  LockClosedIcon, UserIcon, KeyIcon, XMarkIcon, EyeIcon, EyeSlashIcon, SparklesIcon, ArrowRightIcon,
  ShieldCheckIcon, CheckCircleIcon, TicketIcon
} from '@heroicons/vue/24/outline';
import { signIn, createAdmin, adminExists } from '../crm/auth';

const props = defineProps({ isOpen: { type: Boolean, default: false } });
const emit = defineEmits(['close', 'loginSuccess', 'openDemo']);

const mode = ref('login'); // login | setup
const username = ref('');
const password = ref('');
const password2 = ref('');
const code = ref('');
const showPassword = ref(false);
const error = ref('');
const loading = ref(false);

// Si aún no existe la cuenta, se muestra el primer acceso (requiere el código de instalación).
watch(() => props.isOpen, async (open) => {
  if (!open) return;
  error.value = '';
  password.value = password2.value = '';
  try {
    mode.value = (await adminExists()) ? 'login' : 'setup';
  } catch {
    mode.value = 'login';
  }
}, { immediate: true });

const run = async (fn) => {
  error.value = '';
  loading.value = true;
  try { await fn(); } catch (e) { error.value = e.message; } finally { loading.value = false; }
};

const login = () => run(async () => {
  if (!username.value.trim() || !password.value) throw new Error('Ingresa tu usuario y contraseña.');
  emit('loginSuccess', await signIn(username.value, password.value));
});
const setup = () => run(async () => {
  if (!code.value.trim()) throw new Error('Ingresa el código de instalación.');
  if (password.value.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres.');
  if (password.value !== password2.value) throw new Error('Las contraseñas no coinciden.');
  emit('loginSuccess', await createAdmin(code.value, username.value, password.value));
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
        <h3 class="text-xl font-bold text-white mt-4">{{ mode === 'setup' ? 'Configura tu acceso' : 'Mi espacio privado' }}</h3>
        <p class="text-sm text-slate-400 mt-1">
          {{ mode === 'setup' ? 'Primer ingreso: elige tu usuario y contraseña de administrador.' : 'Acceso exclusivo para administrar tus clientes reales.' }}
        </p>

        <form class="space-y-4 mt-6" @submit.prevent="mode === 'setup' ? setup() : login()">
          <div v-if="mode === 'setup'">
            <label class="crm-label">Código de instalación</label>
            <div class="relative">
              <TicketIcon class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input v-model="code" class="crm-input pl-10 font-mono uppercase" placeholder="JC-XXXX-XXXX" autocomplete="off" />
            </div>
          </div>
          <div>
            <label class="crm-label">Usuario</label>
            <div class="relative">
              <UserIcon class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input v-model="username" autocomplete="username" autocapitalize="none" spellcheck="false" class="crm-input pl-10" placeholder="ej. jeralth" />
            </div>
          </div>
          <div>
            <label class="crm-label">Contraseña</label>
            <div class="relative">
              <KeyIcon class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input v-model="password" :type="showPassword ? 'text' : 'password'" :autocomplete="mode === 'setup' ? 'new-password' : 'current-password'" class="crm-input pl-10 pr-10" placeholder="••••••••" />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300" :aria-label="showPassword ? 'Ocultar' : 'Mostrar'" @click="showPassword = !showPassword">
                <EyeSlashIcon v-if="showPassword" class="w-4 h-4" /><EyeIcon v-else class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div v-if="mode === 'setup'">
            <label class="crm-label">Repite la contraseña</label>
            <input v-model="password2" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" class="crm-input" placeholder="••••••••" />
            <p class="text-xs text-slate-500 mt-1.5">Mínimo 8 caracteres. Guárdala bien: no hay recuperación por correo.</p>
          </div>
          <p v-if="error" class="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-sm">{{ error }}</p>
          <button type="submit" class="crm-btn-primary w-full" :disabled="loading">
            <LockClosedIcon class="w-4 h-4" />{{ loading ? 'Un momento…' : mode === 'setup' ? 'Crear acceso y entrar' : 'Iniciar sesión' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
