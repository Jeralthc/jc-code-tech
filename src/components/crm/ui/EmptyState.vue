<script setup>
defineProps({
  title: { type: String, required: true },
  text: { type: String, default: '' },
  icon: { type: [Object, Function], default: null }
});
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center py-12 px-6">
    <div v-if="icon" class="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-4">
      <component :is="icon" class="w-6 h-6" />
    </div>
    <h4 class="text-sm font-semibold text-white">{{ title }}</h4>
    <p v-if="text" class="text-sm text-slate-400 mt-1 max-w-sm">{{ text }}</p>
    <div v-if="$slots.default" class="mt-5"><slot /></div>
  </div>
</template>
