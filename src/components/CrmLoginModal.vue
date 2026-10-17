<script setup>
import { ref } from 'vue';
import { 
  LockClosedIcon, 
  KeyIcon, 
  UserIcon, 
  XMarkIcon, 
  CheckCircleIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'loginSuccess']);

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = () => {
  errorMessage.value = '';
  
  if (!username.value.trim() || !password.value.trim()) {
    errorMessage.value = 'Por favor ingresa tu usuario y contraseña.';
    return;
  }

  isLoading.value = true;

  setTimeout(() => {
    // Valid admin users and passwords
    const validUsers = ['admin', 'jeralth', 'jeralthc@gmail.com', 'admin@jccode.tech'];
    const validPass = ['admin123', 'admin', 'jeralth123', '123456'];

    if (validUsers.includes(username.value.toLowerCase().trim()) && validPass.includes(password.value.trim())) {
      localStorage.setItem('jc_crm_auth', 'true');
      isLoading.value = false;
      emit('loginSuccess');
    } else {
      isLoading.value = false;
      errorMessage.value = 'Credenciales no válidas. Verifica tu usuario y contraseña.';
    }
  }, 400);
};
</script>

<template>
  <div 
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
  >
    <div class="relative w-full max-w-md rounded-3xl bg-slate-900 border border-cyan-500/30 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
      
      <!-- Close Button -->
      <button 
        @click="emit('close')"
        class="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
      >
        <XMarkIcon class="w-5 h-5" />
      </button>

      <!-- Header Icon & Titles -->
      <div class="text-center space-y-2">
        <div class="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]">
          <ShieldCheckIcon class="w-7 h-7" />
        </div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-2xs font-mono uppercase tracking-wider">
          <span>ÁREA PRIVADA // JC STUDIO OS</span>
        </div>
        <h3 class="text-xl font-bold text-white tracking-tight">
          Acceso al Panel CRM
        </h3>
        <p class="text-xs text-slate-400 max-w-xs mx-auto">
          Ingresa tus credenciales para administrar tus clientes, proyectos en curso y presupuestos formales.
        </p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        
        <!-- Username / Email -->
        <div>
          <label class="block text-2xs font-mono uppercase text-slate-400 mb-1.5">Usuario o Correo:</label>
          <div class="relative">
            <UserIcon class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              v-model="username" 
              placeholder="ej. jeralthc@gmail.com o admin"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono transition-colors"
              required
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-2xs font-mono uppercase text-slate-400 mb-1.5">Contraseña:</label>
          <div class="relative">
            <KeyIcon class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="password" 
              placeholder="••••••••"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono transition-colors"
              required
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <EyeSlashIcon v-if="showPassword" class="w-4 h-4" />
              <EyeIcon v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Error Alert -->
        <div v-if="errorMessage" class="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400 text-xs">
          {{ errorMessage }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <LockClosedIcon class="w-4 h-4" />
          <span>{{ isLoading ? 'Verificando...' : 'Iniciar Sesión en CRM' }}</span>
        </button>
      </form>

    </div>
  </div>
</template>
