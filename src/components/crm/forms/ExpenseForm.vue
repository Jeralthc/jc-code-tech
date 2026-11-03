<script setup>
import { ref, computed, watch } from 'vue';
import BaseModal from '../ui/BaseModal.vue';
import CurrencyFields from '../ui/CurrencyFields.vue';
import { useCrm, useUi } from '../../../crm/ui';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../../../crm/constants';
import { clone, todayISO } from '../../../crm/utils';

const props = defineProps({ expense: { type: Object, default: null }, prefill: { type: Object, default: () => ({}) } });
const emit = defineEmits(['close']);
const crm = useCrm();
const ui = useUi();

const form = ref(props.expense ? clone(props.expense) : {
  id: '', date: todayISO(), amount: 0, category: EXPENSE_CATEGORIES[0], description: '', projectId: null, clientId: '',
  method: PAYMENT_METHODS[0], currency: crm.state.settings.currency, amountVes: 0, rate: 0,
  ...props.prefill
});
form.value.currency ||= crm.state.settings.currency;
if (form.value.projectId && !form.value.clientId) form.value.clientId = crm.project(form.value.projectId)?.clientId || '';

const projects = computed(() => crm.state.projects.filter(p => p.status !== 'completed' || p.id === form.value.projectId));
watch(() => form.value.projectId, (id) => { form.value.clientId = id ? crm.project(id)?.clientId || '' : form.value.clientId; });
watch(() => form.value.method, (m) => {
  if (crm.state.settings.currency === 'VES') return;
  form.value.currency = ['Pago Móvil', 'Transferencia'].includes(m) ? 'VES' : crm.state.settings.currency;
});

const error = ref('');
const save = () => {
  const f = form.value;
  if (!f.description.trim()) { error.value = 'Describe el gasto.'; return; }
  if (f.currency === 'VES' && crm.state.settings.currency !== 'VES') {
    if (!(Number(f.amountVes) > 0) || !(Number(f.rate) > 0)) { error.value = 'Indica el monto en bolívares y la tasa.'; return; }
  } else {
    f.amountVes = 0;
    f.rate = 0;
  }
  if (!(Number(f.amount) > 0)) { error.value = 'El monto debe ser mayor a cero.'; return; }
  crm.saveExpense(f);
  ui.toast(props.expense ? 'Gasto actualizado' : `Gasto de ${crm.money(f.amount)} registrado`);
  emit('close');
};
</script>

<template>
  <BaseModal :title="expense ? 'Editar gasto' : 'Registrar gasto'" subtitle="Materiales, traslados, licencias y lo que cuesta cada trabajo" size="md" @close="emit('close')">
    <form id="expense-form" class="grid grid-cols-1 sm:grid-cols-2 gap-4" @submit.prevent="save">
      <div class="sm:col-span-2">
        <label class="crm-label">Descripción *</label>
        <input v-model="form.description" class="crm-input" placeholder="Ej. Bobina de cable UTP Cat6" autofocus />
      </div>
      <div>
        <label class="crm-label">Categoría</label>
        <select v-model="form.category" class="crm-input">
          <option v-for="c in EXPENSE_CATEGORIES" :key="c">{{ c }}</option>
        </select>
      </div>
      <div>
        <label class="crm-label">Fecha</label>
        <input v-model="form.date" type="date" class="crm-input" />
      </div>
      <div class="sm:col-span-2">
        <label class="crm-label">Proyecto (para calcular su ganancia real)</label>
        <select v-model="form.projectId" class="crm-input">
          <option :value="null">— Gasto general del negocio —</option>
          <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.title }} · {{ crm.client(p.clientId)?.company }}</option>
        </select>
      </div>
      <div>
        <label class="crm-label">Pagado con</label>
        <select v-model="form.method" class="crm-input">
          <option v-for="m in PAYMENT_METHODS" :key="m">{{ m }}</option>
        </select>
      </div>
      <div class="hidden sm:block"></div>
      <CurrencyFields :form="form" label="Monto" />
      <p v-if="error" class="sm:col-span-2 text-sm text-rose-400">{{ error }}</p>
    </form>
    <template #footer>
      <button class="crm-btn-ghost" @click="emit('close')">Cancelar</button>
      <button class="crm-btn-primary" type="submit" form="expense-form">Guardar gasto</button>
    </template>
  </BaseModal>
</template>
