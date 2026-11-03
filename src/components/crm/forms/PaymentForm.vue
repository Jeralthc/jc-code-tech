<script setup>
import { ref, computed, watch } from 'vue';
import BaseModal from '../ui/BaseModal.vue';
import CurrencyFields from '../ui/CurrencyFields.vue';
import { useCrm, useUi } from '../../../crm/ui';
import { PAYMENT_METHODS } from '../../../crm/constants';
import { clone, todayISO, monthKeyOf, longMonthLabel } from '../../../crm/utils';

const props = defineProps({ payment: { type: Object, default: null }, prefill: { type: Object, default: () => ({}) } });
const emit = defineEmits(['close']);
const crm = useCrm();
const ui = useUi();

// Métodos que en Venezuela casi siempre se pagan en bolívares.
const BS_METHODS = ['Pago Móvil', 'Transferencia'];

const form = ref(props.payment ? clone(props.payment) : {
  id: '', clientId: '', projectId: null, amount: 0, date: todayISO(), method: PAYMENT_METHODS[0], reference: '', note: '',
  currency: crm.state.settings.currency, amountVes: 0, rate: 0, subscriptionId: null, period: '',
  ...props.prefill
});
form.value.currency ||= crm.state.settings.currency;
if (form.value.projectId && !form.value.clientId) form.value.clientId = crm.project(form.value.projectId)?.clientId || '';

const clientProjects = computed(() => crm.state.projects.filter(p => p.clientId === form.value.clientId));
const clientPlans = computed(() => crm.state.subscriptions.filter(x => x.clientId === form.value.clientId && (x.active || x.id === form.value.subscriptionId)));
const selectedProject = computed(() => crm.project(form.value.projectId));
const selectedPlan = computed(() => crm.state.subscriptions.find(x => x.id === form.value.subscriptionId) || null);
const balance = computed(() => selectedProject.value ? crm.projectBalance(selectedProject.value) + (props.payment?.projectId === selectedProject.value.id ? props.payment.amount : 0) : 0);

watch(() => form.value.clientId, () => {
  if (selectedProject.value && selectedProject.value.clientId !== form.value.clientId) form.value.projectId = null;
  if (selectedPlan.value && selectedPlan.value.clientId !== form.value.clientId) form.value.subscriptionId = null;
});
// Si se elige un proyecto y el monto está vacío, sugiere el saldo pendiente.
watch(() => form.value.projectId, () => {
  if (!props.payment && selectedProject.value && !form.value.amount) form.value.amount = balance.value;
}, { immediate: true });
// Un cobro de plan lleva su mes; por defecto el actual y el monto del plan.
watch(() => form.value.subscriptionId, (id) => {
  if (!id) { form.value.period = ''; return; }
  form.value.projectId = null;
  form.value.period ||= monthKeyOf(form.value.date || todayISO());
  if (!props.payment && !form.value.amount) form.value.amount = selectedPlan.value?.amount || 0;
  if (!form.value.note && selectedPlan.value) form.value.note = `Plan: ${selectedPlan.value.title}`;
});
watch(() => form.value.method, (m, old) => {
  if (old === undefined || crm.state.settings.currency === 'VES') return;
  form.value.currency = BS_METHODS.includes(m) ? 'VES' : crm.state.settings.currency;
});

const alreadyPaid = computed(() => {
  if (!selectedPlan.value || !form.value.period) return null;
  const p = crm.planPayment(selectedPlan.value, form.value.period);
  return p && p.id !== form.value.id ? p : null;
});

const error = ref('');
const save = () => {
  const f = form.value;
  if (!f.clientId) { error.value = 'Selecciona el cliente que realizó el pago.'; return; }
  if (f.currency === 'VES' && crm.state.settings.currency !== 'VES') {
    if (!(Number(f.amountVes) > 0)) { error.value = 'Indica el monto recibido en bolívares.'; return; }
    if (!(Number(f.rate) > 0)) { error.value = 'Indica la tasa de cambio usada.'; return; }
  } else {
    f.amountVes = 0;
    f.rate = 0;
  }
  if (!(Number(f.amount) > 0)) { error.value = 'El monto debe ser mayor a cero.'; return; }
  if (f.subscriptionId && !f.period) { error.value = 'Indica el mes que corresponde al plan.'; return; }
  crm.savePayment(f);
  ui.toast(props.payment ? 'Cobro actualizado' : `Cobro de ${crm.money(f.amount)} registrado`);
  emit('close');
};
</script>

<template>
  <BaseModal :title="payment ? 'Editar cobro' : 'Registrar cobro'" subtitle="Abonos, anticipos, pagos finales y mensualidades" size="md" @close="emit('close')">
    <form id="payment-form" class="grid grid-cols-1 sm:grid-cols-2 gap-4" @submit.prevent="save">
      <div class="sm:col-span-2">
        <label class="crm-label">Cliente *</label>
        <select v-model="form.clientId" class="crm-input">
          <option value="" disabled>Selecciona…</option>
          <option v-for="c in crm.state.clients" :key="c.id" :value="c.id">{{ c.company }}</option>
        </select>
      </div>

      <div v-if="clientPlans.length" class="sm:col-span-2">
        <label class="crm-label">¿Es la mensualidad de un plan?</label>
        <div class="flex flex-wrap gap-2">
          <button type="button" :class="['crm-chip', !form.subscriptionId && 'crm-chip-active']" @click="form.subscriptionId = null">No</button>
          <button v-for="pl in clientPlans" :key="pl.id" type="button" :class="['crm-chip', form.subscriptionId === pl.id && 'crm-chip-active']" @click="form.subscriptionId = pl.id">
            {{ pl.title }} · {{ crm.money(pl.amount) }}
          </button>
        </div>
      </div>

      <div v-if="form.subscriptionId" class="sm:col-span-2">
        <label class="crm-label">Mes que paga</label>
        <input v-model="form.period" type="month" class="crm-input" />
        <p v-if="alreadyPaid" class="text-xs text-amber-300 mt-1.5">Ojo: ya hay un cobro de este plan para {{ longMonthLabel(form.period) }} ({{ crm.money(alreadyPaid.amount) }}).</p>
      </div>
      <div v-else class="sm:col-span-2">
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
        <label class="crm-label">Método</label>
        <select v-model="form.method" class="crm-input">
          <option v-for="m in PAYMENT_METHODS" :key="m">{{ m }}</option>
        </select>
      </div>
      <div>
        <label class="crm-label">Fecha</label>
        <input v-model="form.date" type="date" class="crm-input" />
      </div>

      <CurrencyFields :form="form" label="Monto" />

      <div>
        <label class="crm-label">Referencia</label>
        <input v-model="form.reference" class="crm-input" placeholder="N° de operación" />
      </div>
      <div>
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
