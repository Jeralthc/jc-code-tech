<script setup>
import { TONES, TONE_DOT } from '../../../crm/constants';

defineProps({
  label: { type: String, required: true },
  tone: { type: String, default: 'slate' },
  dot: { type: Boolean, default: true }
});
</script>

<template>
  <span :class="['crm-badge', TONES[tone] || TONES.slate]">
    <span v-if="dot" :class="['w-1.5 h-1.5 rounded-full', TONE_DOT[tone] || TONE_DOT.slate]"></span>
    {{ label }}
  </span>
</template>
