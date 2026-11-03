<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  PlusIcon, ArrowPathRoundedSquareIcon, ChevronLeftIcon, ChevronRightIcon, BanknotesIcon, PencilSquareIcon,
  TrashIcon, ChatBubbleOvalLeftEllipsisIcon, PauseIcon, PlayIcon, CalendarDaysIcon
} from '@heroicons/vue/24/outline';
import StatusBadge from '../ui/StatusBadge.vue';
import EmptyState from '../ui/EmptyState.vue';
import ClientAvatar from '../ui/ClientAvatar.vue';
import { useCrm, useUi } from '../../../crm/ui';
import { bcv, loadBcvRate } from '../../../crm/rates';
import { todayISO, monthKeyOf, longMonthLabel, monthLabel, parseISO, openWhatsApp, formatBs, formatCompact, formatShortDate } from '../../../crm/utils';

const crm = useCrm();
const ui = useUi();
const s = crm.state;

const STATUS = {
  paid: { label: 'Pagado', tone: 'emerald', dot: 'bg-emerald-400' },
  due: { label: 'Por vencer', tone: 'amber', dot: 'bg-amber-400' },
  overdue: { label: 'Vencido', tone: 'rose', dot: 'bg-rose-500' },
  upcoming: { label: 'Próximo', tone: 'blue', dot: 'bg-slate-600' },
  paused: { label: 'Pausado', tone: 'slate', dot: 'bg-slate-700' },
  none: { label: 'No aplica', tone: 'slate', dot: 'bg-slate-800' }
};

const current = monthKeyOf(todayISO());
const period = ref(current);
const shift = (key, n) => {
  const d = parseISO(`${key}-01`);
  d.setMonth(d.getMonth() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};
// Los meses futuros aún no tienen estado real: se permite navegar hasta el próximo.
const canNext = computed(() => period.value < shift(current, 1));
const history = computed(() => Array.from({ length: 6 }, (_, i) => shift(period.value, i - 5)));
const compact = (v) => formatCompact(v, s.settings.currency);

const plans = computed(() => s.subscriptions
  .map(p => ({ p, client: crm.client(p.clientId), status: crm.planStatus(p, period.value), payment: crm.planPayment(p, period.value) }))
  .sort((a, b) => (b.p.active - a.p.active) || ['overdue', 'due', 'upcoming', 'paid', 'paused', 'none'].indexOf(a.status) - ['overdue', 'due', 'upcoming', 'paid', 'paused', 'none'].indexOf(b.status) || (a.p.billingDay - b.p.billingDay)));

const activePlans = computed(() => s.subscriptions.filter(x => x.active));
const collected = computed(() => s.payments.filter(x => x.subscriptionId && x.period === period.value).reduce((a, x) => a + Number(x.amount || 0), 0));
const pendingRows = computed(() => plans.value.filter(r => ['due', 'overdue', 'upcoming'].includes(r.status)));
const pending = computed(() => pendingRows.value.reduce((a, r) => a + Number(r.p.amount || 0), 0));
const overdueCount = computed(() => plans.value.filter(r => r.status === 'overdue').length);
const mrr = computed(() => crm.monthlyRecurring());

const kpis = computed(() => [
  { label: 'Ingreso mensual recurrente', value: compact(mrr.value), sub: `${compact(mrr.value * 12)} al año`, tone: 'text-cyan-300' },
  { label: `Cobrado en ${longMonthLabel(period.value)}`, value: compact(collected.value), sub: `${plans.value.filter(r => r.status === 'paid').length} plan(es) al día`, tone: 'text-emerald-300' },
  { label: 'Pendiente del mes', value: compact(pending.value), sub: overdueCount.value ? `${overdueCount.value} vencido(s)` : 'Sin atrasos', tone: overdueCount.value ? 'text-rose-300' : 'text-amber-300' },
  { label: 'Planes activos', value: activePlans.value.length, sub: `${new Set(activePlans.value.map(x => x.clientId)).size} cliente(s)`, tone: 'text-violet-300' }
]);

const charge = (r) => ui.addPayment({
  clientId: r.p.clientId, subscriptionId: r.p.id, period: period.value, amount: r.p.amount, note: `Plan: ${r.p.title}`
});
const remind = (r) => {
  if (!r.client?.phone) { ui.toast('El cliente no tiene teléfono registrado', 'error'); return; }
  const name = r.client.name?.split(' ')[0] || '';
  const bs = bcv.rate && s.settings.showBs !== false && s.settings.currency === 'USD' ? ` (${formatBs(r.p.amount * bcv.rate)} a tasa BCV)` : '';
  const due = r.status === 'overdue' ? `venció el día ${r.p.billingDay}` : `vence el día ${r.p.billingDay}`;
  const text = `Hola ${name}, ¿cómo estás? Te recuerdo la mensualidad de *${r.p.title}* correspondiente a ${longMonthLabel(period.value)}: *${crm.money(r.p.amount)}*${bs}, que ${due}. Cuando la realices me envías el comprobante. ¡Gracias! — ${s.settings.ownerName}`;
  openWhatsApp(r.client.phone, text);
  crm.logActivity(r.client.id, 'whatsapp', `Recordatorio de mensualidad enviado (${longMonthLabel(period.value)}).`);
};
const toggleActive = (p) => {
  p.active = !p.active;
  crm.logActivity(p.clientId, 'system', `Plan "${p.title}" ${p.active ? 'reactivado' : 'pausado'}.`);
  ui.toast(p.active ? 'Plan reactivado' : 'Plan pausado');
};
const remove = (p) => ui.deleted('Plan eliminado (sus cobros se conservan)', crm.withUndo(() => crm.deleteSubscription(p.id)));
const dotTitle = (p, key) => `${longMonthLabel(key)}: ${STATUS[crm.planStatus(p, key)].label}`;

onMounted(() => loadBcvRate());
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-white tracking-tight">Planes mensuales</h1>
        <p class="text-sm text-slate-400 mt-1">Ingresos recurrentes: soporte, hosting y mantenimiento</p>
      </div>
      <button class="crm-btn-primary" @click="ui.editSubscription()"><PlusIcon class="w-4 h-4" />Nuevo plan</button>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div v-for="k in kpis" :key="k.label" class="crm-card p-4">
        <p class="text-xs text-slate-400 truncate">{{ k.label }}</p>
        <p :class="['text-xl sm:text-2xl font-extrabold font-mono mt-1', k.tone]">{{ k.value }}</p>
        <p class="text-2xs text-slate-500 mt-1 truncate">{{ k.sub }}</p>
      </div>
    </div>

    <div v-if="!s.subscriptions.length" class="crm-card">
      <EmptyState :icon="ArrowPathRoundedSquareIcon" title="Aún no tienes planes mensuales" text="Convierte el soporte, el hosting o el mantenimiento en un ingreso fijo. Aquí verás quién está al día y a quién recordarle.">
        <button class="crm-btn-primary" @click="ui.editSubscription()"><PlusIcon class="w-4 h-4" />Crear plan</button>
      </EmptyState>
    </div>

    <section v-else class="crm-card">
      <div class="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div class="flex items-center gap-1">
          <button class="crm-icon-btn" title="Mes anterior" @click="period = shift(period, -1)"><ChevronLeftIcon class="w-5 h-5" /></button>
          <span class="min-w-40 text-center text-sm font-semibold text-white capitalize">{{ longMonthLabel(period) }}</span>
          <button class="crm-icon-btn" title="Mes siguiente" :disabled="!canNext" :class="!canNext && 'opacity-30'" @click="canNext && (period = shift(period, 1))"><ChevronRightIcon class="w-5 h-5" /></button>
          <button v-if="period !== current" class="crm-chip ml-1" @click="period = current">Hoy</button>
        </div>
        <div class="flex flex-wrap gap-3 text-2xs text-slate-500">
          <span v-for="key in ['paid', 'overdue', 'upcoming', 'paused']" :key="key" class="flex items-center gap-1.5"><span :class="['w-2 h-2 rounded-full', STATUS[key].dot]"></span>{{ STATUS[key].label }}</span>
        </div>
      </div>

      <ul class="divide-y divide-slate-800/60">
        <li v-for="r in plans" :key="r.p.id" :class="['p-4 flex flex-col lg:flex-row lg:items-center gap-4', !r.p.active && 'opacity-60']">
          <div class="flex items-center gap-3 min-w-0 lg:w-80">
            <ClientAvatar :name="r.client?.company || '?'" />
            <div class="min-w-0">
              <button class="block text-sm font-semibold text-white truncate hover:text-cyan-300 text-left" @click="ui.openClient(r.p.clientId)">{{ r.client?.company || '—' }}</button>
              <p class="text-xs text-slate-500 truncate">{{ r.p.title }}</p>
            </div>
          </div>

          <div class="flex items-center gap-6 flex-1">
            <div>
              <p class="font-mono font-semibold text-white">{{ crm.money(r.p.amount) }}<span class="text-xs text-slate-500 font-sans">/mes</span></p>
              <p class="text-2xs text-slate-500 flex items-center gap-1"><CalendarDaysIcon class="w-3.5 h-3.5" />Cobra el día {{ r.p.billingDay }}</p>
            </div>
            <div class="hidden sm:flex items-end gap-1.5" aria-label="Últimos 6 meses">
              <div v-for="key in history" :key="key" class="flex flex-col items-center gap-1" :title="dotTitle(r.p, key)">
                <span :class="['w-5 h-5 rounded-md', STATUS[crm.planStatus(r.p, key)].dot, key === period && 'ring-2 ring-cyan-400/60 ring-offset-2 ring-offset-slate-900']"></span>
                <span class="text-[9px] uppercase text-slate-600">{{ monthLabel(parseISO(`${key}-01`)) }}</span>
              </div>
            </div>
            <div class="ml-auto lg:ml-0 text-right lg:text-left">
              <StatusBadge :label="STATUS[r.status].label" :tone="STATUS[r.status].tone" />
              <p v-if="r.payment" class="text-2xs text-slate-500 mt-1">{{ r.payment.method }} · {{ formatShortDate(r.payment.date) }}</p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-1 shrink-0">
            <button v-if="r.p.active && r.status !== 'paid' && r.status !== 'none'" class="crm-btn-secondary !px-3 !py-1.5 text-xs" @click="charge(r)"><BanknotesIcon class="w-4 h-4" />Registrar</button>
            <button v-if="r.p.active && ['due', 'overdue'].includes(r.status)" class="crm-icon-btn hover:text-emerald-300" title="Recordar por WhatsApp" @click="remind(r)"><ChatBubbleOvalLeftEllipsisIcon class="w-4 h-4" /></button>
            <button class="crm-icon-btn" :title="r.p.active ? 'Pausar plan' : 'Reactivar plan'" @click="toggleActive(r.p)"><component :is="r.p.active ? PauseIcon : PlayIcon" class="w-4 h-4" /></button>
            <button class="crm-icon-btn" title="Editar" @click="ui.editSubscription(r.p)"><PencilSquareIcon class="w-4 h-4" /></button>
            <button class="crm-icon-btn hover:text-rose-400" title="Eliminar" @click="remove(r.p)"><TrashIcon class="w-4 h-4" /></button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
