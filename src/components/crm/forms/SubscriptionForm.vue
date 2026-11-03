<script setup>
import { ref, computed } from 'vue';
import BaseModal from '../ui/BaseModal.vue';
import { useCrm, useUi } from '../../../crm/ui';
import { clone, todayISO } from '../../../crm/utils';

const props = defineProps({ plan: { type: Object, default: null }, prefill: { type: Object, default: () => ({}) } });
const emit = defineEmits(['close']);
const crm = useCrm();
const ui = useUi();

const supportService = crm.state.settings.catalog.find(x => /soporte/i.test(x.name));
const form = ref(props.plan ? clone(props.plan) : {
  id: '', clientId: '', title: supportService?.name || 'Soporte mensual', amount: supportService?.price || 0,
  billingDay: Math.min(28, new Date().getDate()), startDate: todayISO(), active: true, notes: '',
  ...props.prefill
});
const yearly = computed(() => (Number(form.value.amount) || 0) * 12);

const error = ref('');
const save = () => {
  if (!form.value.clientId) { error.value = 'Selecciona el cliente del plan.'; return; }
  if (!form.value.title.trim()) { error.value = 'Ponle un nombre al plan.'; return; }
  if (!(Number(form.value.amount) > 0)) { error.value = 'La mensualidad debe ser mayor a cero.'; return; }
  crm.saveSubscription(form.value);
  ui.toast(props.plan ? 'Plan actualizado' : `Plan de ${crm.money(form.value.amount)}/mes creado`);
  emit('close');
};
</script>

<template>
  <BaseModal :title="plan ? 'Editar plan mensual' : 'Nuevo plan mensual'" subtitle="Soporte, hosting o mantenimiento que se cobra cada mes" size="sm" @close="emit('close')">
    <form id="plan-form" class="grid grid-cols-2 gap-4" @submit.prevent="save">
      <div class="col-span-2">
        <label class="crm-label">Cliente *</label>
        <select v-model="form.clientId" class="crm-input">
          <option value="" disabled>Selecciona…</option>
          <option v-for="c in crm.state.clients" :key="c.id" :value="c.id">{{ c.company }}</option>
        </select>
      </div>
      <div class="col-span-2">
        <label class="crm-label">Nombre del plan *</label>
        <input v-model="form.title" class="crm-input" placeholder="Ej. Soporte mensual POS y red" />
      </div>
      <div>
        <label class="crm-label">Mensualidad ({{ crm.state.settings.currency }}) *</label>
        <input v-model.number="form.amount" type="number" min="0" step="1" class="crm-input font-mono" />
      </div>
      <div>
        <label class="crm-label">Día de cobro</label>
        <input v-model.number="form.billingDay" type="number" min="1" max="28" class="crm-input font-mono" />
      </div>
      <div>
        <label class="crm-label">Inicio</label>
        <input v-model="form.startDate" type="date" class="crm-input" />
      </div>
      <div class="flex items-end">
        <label class="flex items-center gap-2.5 cursor-pointer text-sm text-slate-300 pb-2.5">
          <input v-model="form.active" type="checkbox" class="accent-cyan-500 w-4 h-4" />Plan activo
        </label>
      </div>
      <div class="col-span-2">
        <label class="crm-label">Qué incluye</label>
        <textarea v-model="form.notes" rows="2" class="crm-input resize-none" placeholder="Visitas preventivas, atención prioritaria, respaldos…"></textarea>
      </div>
      <p class="col-span-2 text-xs text-slate-400 rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2">
        Ingreso anual del plan: <strong class="font-mono text-emerald-300">{{ crm.money(yearly) }}</strong>
      </p>
      <p v-if="error" class="col-span-2 text-sm text-rose-400">{{ error }}</p>
    </form>
    <template #footer>
      <button class="crm-btn-ghost" @click="emit('close')">Cancelar</button>
      <button class="crm-btn-primary" type="submit" form="plan-form">Guardar plan</button>
    </template>
  </BaseModal>
</template>
