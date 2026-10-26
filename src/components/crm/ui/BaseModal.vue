<script setup>
import { onMounted, onUnmounted } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  size: { type: String, default: 'md' } // sm | md | lg | xl
});
const emit = defineEmits(['close']);

const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' };

const onKey = (e) => { if (e.key === 'Escape') emit('close'); };
onMounted(() => {
  document.addEventListener('keydown', onKey);
  document.body.style.overflow = 'hidden';
});
onUnmounted(() => {
  document.removeEventListener('keydown', onKey);
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm sm:p-4" @mousedown.self="emit('close')">
      <div :class="['w-full max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl', widths[props.size]]">
        <div class="flex items-start justify-between gap-4 px-5 sm:px-6 py-4 border-b border-slate-800">
          <div>
            <h3 class="text-base font-bold text-white">{{ title }}</h3>
            <p v-if="subtitle" class="text-xs text-slate-400 mt-0.5">{{ subtitle }}</p>
          </div>
          <button class="crm-icon-btn -mr-2" aria-label="Cerrar" @click="emit('close')">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="px-5 sm:px-6 py-5 overflow-y-auto">
          <slot />
        </div>
        <div v-if="$slots.footer" class="flex flex-wrap items-center justify-end gap-2 px-5 sm:px-6 py-4 border-t border-slate-800 bg-slate-900/80 rounded-b-2xl">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
