<script setup>
import { ref, computed, watch } from 'vue';
import BaseModal from '../ui/BaseModal.vue';
import { useCrm, useUi } from '../../../crm/ui';
import { PAYMENT_METHODS } from '../../../crm/constants';
import { clone, todayISO } from '../../../crm/utils';

const props = defineProps({ payment: { type: Object, default: null }, prefill: { type: Object, default: () => ({}) } });
const emit = defineEmits(['close']);
const crm = useCrm();
const ui = useUi();

const form = ref(props.payment ? clone(props.payment) : {
  id: '', clientId: '', projectId: null, amount: 0, date: todayISO(), method: PAYMENT_METHODS[0], reference: '', note: '',
  ...props.prefill
});
if (form.value.projectId && !form.value.clientId) form.value.clientId = crm.project(form.value.projectId)?.clientId || '';

const clientProjects = computed(() => crm.state.projects.filter(p => p.clientId === form.value.clientId));
const selectedProject = computed(() => crm.project(form.value.projectId));
const balance = computed(() => selectedProject.value ? crm.projectBalance(selectedProject.value) + (props.payment?.projectId === selectedProject.value.id ? props.payment.amount : 0) : 0);

watch(() => form.value.clientId, () => {
  if (selectedProject.value && selectedProject.value.clientId !== form.value.clientId) form.value.projectId = null;
});
// Si se elige un proyecto y el monto está vacío, sugiere el saldo pendiente.
watch(() => form.value.projectId, () => {
  if (!props.payment && selectedProject.value && !form.value.amount) form.value.amount = balance.value;
}, { immediate: true });

const error = ref('');
const save = () => {
  if (!form.value.clientId) { error.value = 'Selecciona el cliente que realizó el pago.'; return; }
  if (!(Number(form.value.amount) > 0)) { error.value = 'El monto debe ser mayor a cero.'; return; }
  crm.savePayment(form.value);
  ui.toast(props.payment ? 'Cobro actualizado' : `Cobro de ${crm.money(form.value.amount)} registrado`);
  emit('close');
};
</script>

<template>
  <BaseModal :title="payment ? 'Editar cobro' : 'Registrar cobro'" subtitle="Abonos, anticipos y pagos finales" size="sm" @close="emit('close')">
    <form id="payment-form" class="grid grid-cols-1 sm:grid-cols-2 gap-4" @submit.prevent="save">
      <div class="sm:col-span-2">
        <label class="crm-label">Cliente *</label>
        <select v-model="form.clientId" class="crm-input">
          <option value="" disabled>Selecciona…</option>
          <option v-for="c in crm.state.clients" :key="c.id" :value="c.id">{{ c.company }}</option>
        </select>
      </div>
      <div class="sm:col-span-2">
        <label class="crm-label">Proyecto (opcional)</label>
        <select v-model="form.projectId" class="crm-input" :disabled="!form.clientId">
          <option :value="null">— Pago sin proyecto —</option>
          <option v-for="p in clientProjects" :key="p.id" :value="p.id">{{ p.id }} · {{ p.title }}</option>
        </select>
        <p v-if="selectedProject" class="text-xs text-slate-400 mt-1.5">
          Saldo pendiente del proyecto: <strong class="text-amber-300">{{ crm.money(balance) }}</strong>
        </p>
      </div>
      <div>
        <label class="crm-label">Monto ({{ crm.state.settings.currency }}) *</label>
        <input v-model.number="form.amount" type="number" min="0" step="0.01" class="crm-input font-mono" />
      </div>
      <div>
        <label class="crm-label">Fecha</label>
        <input v-model="form.date" type="date" class="crm-input" />
      </div>
      <div>
        <label class="crm-label">Método</label>
        <select v-model="form.method" class="crm-input">
          <option v-for="m in PAYMENT_METHODS" :key="m">{{ m }}</option>
        </select>
      </div>
      <div>
        <label class="crm-label">Referencia</label>
        <input v-model="form.reference" class="crm-input" placeholder="N° de operación" />
      </div>
      <div class="sm:col-span-2">
        <label class="crm-label">Concepto</label>
        <input v-model="form.note" class="crm-input" placeholder="Ej. Anticipo 50%" />
      </div>
      <p v-if="error" class="sm:col-span-2 text-sm text-rose-400">{{ error }}</p>
    </form>
    <template #footer>
      <button class="crm-btn-ghost" @click="emit('close')">Cancelar</button>
      <button class="crm-btn-primary" type="submit" form="payment-form">Guardar cobro</button>
    </template>
  </BaseModal>
</template>
