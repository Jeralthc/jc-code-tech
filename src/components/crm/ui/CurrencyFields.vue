<script setup>
import { computed, watch, onMounted } from 'vue';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import { useCrm } from '../../../crm/ui';
import { bcv, loadBcvRate } from '../../../crm/rates';
import { formatBs, formatRate, formatDate } from '../../../crm/utils';

// Monto de un cobro o gasto: en la moneda del negocio o en bolívares con su tasa.
// Trabaja sobre el objeto del formulario (amount, currency, amountVes, rate).
const props = defineProps({ form: { type: Object, required: true }, label: { type: String, default: 'Monto' } });
const crm = useCrm();
const base = computed(() => crm.state.settings.currency);
// Con un negocio que ya factura en bolívares no hace falta la conversión.
const canUseBs = computed(() => base.value !== 'VES');
const isBs = computed(() => canUseBs.value && props.form.currency === 'VES');

const setCurrency = (cur) => {
  props.form.currency = cur;
  if (cur === 'VES' && !props.form.rate && bcv.rate) props.form.rate = bcv.rate;
  if (cur === 'VES' && !props.form.amountVes && props.form.amount && props.form.rate) {
    props.form.amountVes = Math.round(props.form.amount * props.form.rate * 100) / 100;
  }
};
const useBcv = () => { if (bcv.rate) props.form.rate = bcv.rate; };

// En bolívares el monto en la moneda base se calcula con la tasa.
watch(() => [props.form.amountVes, props.form.rate, props.form.currency], () => {
  if (!isBs.value) return;
  const rate = Number(props.form.rate) || 0;
  props.form.amount = rate ? Math.round((Number(props.form.amountVes) || 0) / rate * 100) / 100 : 0;
});

const bsHint = computed(() => (!isBs.value && canUseBs.value && bcv.rate && props.form.amount > 0 && crm.state.settings.showBs !== false)
  ? `≈ ${formatBs(props.form.amount * bcv.rate)} a tasa BCV`
  : '');

onMounted(() => {
  loadBcvRate().then(() => { if (isBs.value && !props.form.rate) useBcv(); });
});
</script>

<template>
  <div class="sm:col-span-2 space-y-3">
    <div class="flex items-center justify-between gap-3">
      <label class="crm-label !mb-0">{{ label }} *</label>
      <div v-if="canUseBs" class="inline-flex p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold">
        <button type="button" :class="['px-3 py-1 rounded-md transition-colors', !isBs ? 'bg-cyan-500/15 text-cyan-200' : 'text-slate-400 hover:text-white']" @click="setCurrency(base)">{{ base }}</button>
        <button type="button" :class="['px-3 py-1 rounded-md transition-colors', isBs ? 'bg-cyan-500/15 text-cyan-200' : 'text-slate-400 hover:text-white']" @click="setCurrency('VES')">Bolívares</button>
      </div>
    </div>

    <div v-if="!isBs">
      <div class="relative">
        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">{{ base }}</span>
        <input v-model.number="form.amount" type="number" min="0" step="0.01" class="crm-input font-mono !pl-14 text-lg" placeholder="0.00" />
      </div>
      <p v-if="bsHint" class="text-xs text-slate-500 mt-1.5">{{ bsHint }}</p>
    </div>

    <div v-else class="rounded-xl bg-slate-950/60 border border-slate-800 p-3 space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-2xs text-slate-500">Monto recibido (Bs.)</label>
          <input v-model.number="form.amountVes" type="number" min="0" step="0.01" class="crm-input font-mono" placeholder="0,00" />
        </div>
        <div>
          <label class="text-2xs text-slate-500">Tasa (Bs. por {{ base }})</label>
          <input v-model.number="form.rate" type="number" min="0" step="0.0001" class="crm-input font-mono" />
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
        <button v-if="bcv.rate" type="button" class="inline-flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200" @click="useBcv">
          Usar BCV: <span class="font-mono">{{ formatRate(bcv.rate) }}</span><span v-if="bcv.date" class="text-slate-500">({{ formatDate(bcv.date) }})</span>
        </button>
        <button v-else type="button" class="inline-flex items-center gap-1.5 text-slate-400 hover:text-white" :disabled="bcv.loading" @click="loadBcvRate(true)">
          <ArrowPathIcon :class="['w-3.5 h-3.5', bcv.loading && 'animate-spin']" />{{ bcv.loading ? 'Consultando BCV…' : 'Consultar tasa BCV' }}
        </button>
        <span class="text-slate-400">Equivale a <strong class="font-mono text-white">{{ crm.money(form.amount) }}</strong></span>
      </div>
      <p v-if="bcv.error && !bcv.rate" class="text-2xs text-amber-300">{{ bcv.error }}</p>
    </div>
  </div>
</template>
