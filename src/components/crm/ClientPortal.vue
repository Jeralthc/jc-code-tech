<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  DocumentTextIcon, FolderIcon, BanknotesIcon, LifebuoyIcon, CheckCircleIcon, ChevronDownIcon, XMarkIcon,
  ChatBubbleOvalLeftEllipsisIcon, ArrowPathIcon, ExclamationCircleIcon, LockClosedIcon, ShieldCheckIcon, EyeIcon
} from '@heroicons/vue/24/outline';
import StatusBadge from './ui/StatusBadge.vue';
import { fetchPortal, approveFromPortal } from '../../crm/remote';
import { QUOTE_STATUS, PROJECT_STATUS, TICKET_STATUS } from '../../crm/constants';
import { formatMoney, formatDate, formatDateTime, addDays, daysFromToday, computeQuoteTotals, initials, whatsappUrl, formatBs, timeAgo } from '../../crm/utils';

// Portal del cliente: con token carga los datos públicos del enlace secreto; con preview
// muestra la misma página con datos locales (vista previa desde el CRM y la demo).
const props = defineProps({
  token: { type: String, default: '' },
  preview: { type: Object, default: null }
});
const emit = defineEmits(['close', 'approve']);

const data = ref(props.preview);
const loading = ref(!props.preview);
const error = ref('');
const tab = ref('quotes');
const open = ref(null);

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    data.value = await fetchPortal(props.token);
    if (!data.value) error.value = 'Este enlace no es válido o fue reemplazado por uno nuevo. Pide a tu proveedor el enlace actualizado.';
  } catch {
    error.value = 'No pudimos cargar la información. Revisa tu conexión e intenta de nuevo.';
  } finally {
    loading.value = false;
  }
};

const st = computed(() => data.value?.settings || {});
const money = (v) => formatMoney(v, st.value.currency || 'USD');
const firstName = computed(() => data.value?.client?.name?.split(' ')[0] || '');

const quoteStatus = (q) => (q.status === 'sent' && daysFromToday(addDays(q.date, q.validityDays || 15)) < 0 ? 'expired' : q.status);
const totals = (q) => computeQuoteTotals(q, st.value.taxRate ?? 16);
const paidFor = (p) => (data.value?.payments || []).filter(x => x.projectId === p.id).reduce((a, x) => a + Number(x.amount || 0), 0);
const progress = (p) => (p.milestones?.length ? Math.round(p.milestones.filter(m => m.done).length / p.milestones.length * 100) : 0);

const quotes = computed(() => data.value?.quotes || []);
const projects = computed(() => data.value?.projects || []);
const payments = computed(() => data.value?.payments || []);
const tickets = computed(() => data.value?.tickets || []);
const toApprove = computed(() => quotes.value.filter(q => quoteStatus(q) === 'sent'));
const totalPaid = computed(() => payments.value.reduce((a, x) => a + Number(x.amount || 0), 0));
const balance = computed(() => projects.value.reduce((a, p) => a + Math.max(0, Number(p.budget || 0) - paidFor(p)), 0));
const openTickets = computed(() => tickets.value.filter(t => t.status !== 'resolved'));

const tabs = computed(() => [
  { key: 'quotes', label: 'Cotizaciones', icon: DocumentTextIcon, count: quotes.value.length },
  { key: 'projects', label: 'Proyectos', icon: FolderIcon, count: projects.value.length },
  { key: 'payments', label: 'Pagos', icon: BanknotesIcon, count: payments.value.length },
  { key: 'tickets', label: 'Soporte', icon: LifebuoyIcon, count: tickets.value.length }
]);

// Aprobación de cotizaciones
const approving = ref(null);
const approverName = ref('');
const accepted = ref(false);
const sending = ref(false);
const approveMsg = ref('');
const startApprove = (q) => {
  approving.value = q.id;
  approverName.value = data.value?.client?.name || '';
  accepted.value = false;
  approveMsg.value = '';
};
const confirmApprove = async (q) => {
  if (!approverName.value.trim() || !accepted.value) { approveMsg.value = 'Escribe tu nombre y acepta las condiciones.'; return; }
  sending.value = true;
  approveMsg.value = '';
  try {
    let ok = true;
    if (props.preview) emit('approve', q.id, approverName.value.trim());
    else ok = await approveFromPortal(props.token, q.id, approverName.value.trim());
    if (!ok) { approveMsg.value = 'No se pudo aprobar: la cotización ya no está vigente. Escríbenos para actualizarla.'; return; }
    Object.assign(q, { status: 'approved', approvedAt: new Date().toISOString(), approvedBy: approverName.value.trim() });
    approving.value = null;
  } catch {
    approveMsg.value = 'Ocurrió un error. Intenta de nuevo en unos segundos.';
  } finally {
    sending.value = false;
  }
};

const contactUrl = computed(() => whatsappUrl(st.value.phone, `Hola ${st.value.ownerName?.split(' ')[0] || ''}, te escribo desde el portal de ${data.value?.client?.company || 'mi empresa'}.`));
const supportUrl = computed(() => whatsappUrl(st.value.phone, `Hola, quiero reportar una falla para ${data.value?.client?.company || 'mi empresa'}:\n\nEquipo: \nQué pasa: `));

let prevTitle = '';
onMounted(() => {
  prevTitle = document.title;
  if (!props.preview) load();
  document.title = 'Portal del cliente';
  if (props.preview) document.body.style.overflow = 'hidden';
});
onUnmounted(() => {
  document.title = prevTitle;
  document.body.style.overflow = '';
});
</script>

<template>
  <div :class="['bg-slate-950 text-slate-200 font-sans', preview ? 'fixed inset-0 z-[75] overflow-y-auto' : 'min-h-screen']">
    <!-- Barra de vista previa -->
    <div v-if="preview" class="sticky top-0 z-10 bg-gradient-to-r from-violet-600/95 to-blue-700/95 text-white text-sm">
      <div class="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <EyeIcon class="w-5 h-5 shrink-0" />
        <p class="flex-1 min-w-0"><strong>Vista previa:</strong> así ve {{ data?.client?.company }} su portal.</p>
        <button class="inline-flex items-center gap-1.5 rounded-lg bg-white/15 hover:bg-white/25 px-3 py-1.5 font-semibold" @click="emit('close')"><XMarkIcon class="w-4 h-4" />Cerrar</button>
      </div>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-40 text-slate-400">
      <ArrowPathIcon class="w-8 h-8 animate-spin text-cyan-400" />
      <p class="mt-3 text-sm">Cargando tu información…</p>
    </div>

    <div v-else-if="error" class="max-w-md mx-auto px-4 py-32 text-center">
      <div class="w-14 h-14 rounded-2xl bg-rose-500/10 ring-1 ring-rose-500/30 flex items-center justify-center mx-auto"><ExclamationCircleIcon class="w-7 h-7 text-rose-300" /></div>
      <h1 class="text-lg font-bold text-white mt-4">No pudimos abrir el portal</h1>
      <p class="text-sm text-slate-400 mt-2 leading-relaxed">{{ error }}</p>
      <button class="crm-btn-secondary mt-6" @click="load"><ArrowPathIcon class="w-4 h-4" />Intentar de nuevo</button>
    </div>

    <template v-else-if="data">
      <!-- Encabezado del negocio -->
      <header class="border-b border-slate-800/80 bg-slate-900/60">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3 min-w-0">
            <img v-if="st.logo" :src="st.logo" alt="" class="w-11 h-11 rounded-xl object-contain bg-white p-1" />
            <div v-else class="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black">{{ initials(st.businessName) }}</div>
            <div class="min-w-0">
              <p class="font-bold text-white truncate">{{ st.businessName }}</p>
              <p class="text-xs text-slate-400 truncate">{{ st.tagline }}</p>
            </div>
          </div>
          <span class="inline-flex items-center gap-1.5 text-xs text-slate-400 rounded-full border border-slate-700 px-3 py-1"><LockClosedIcon class="w-3.5 h-3.5" />Portal privado del cliente</span>
        </div>
      </header>

      <main class="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <p class="text-sm text-cyan-300 font-medium">Hola{{ firstName ? `, ${firstName}` : '' }} 👋</p>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">{{ data.client.company }}</h1>
          <p class="text-sm text-slate-400 mt-1">Aquí puedes revisar tus cotizaciones, el avance de tus proyectos, tus pagos y tus casos de soporte.</p>
        </div>

        <div v-if="toApprove.length" class="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-cyan-500/15 to-blue-600/10 ring-1 ring-cyan-500/30 flex flex-wrap items-center gap-3">
          <DocumentTextIcon class="w-6 h-6 text-cyan-300 shrink-0" />
          <p class="flex-1 text-sm text-cyan-50">Tienes <strong>{{ toApprove.length }} cotización(es)</strong> esperando tu aprobación.</p>
          <button class="crm-btn-primary !py-2 text-xs" @click="tab = 'quotes'; open = toApprove[0].id">Revisar</button>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="crm-card p-4"><p class="text-xs text-slate-400">Total pagado</p><p class="text-xl font-extrabold font-mono text-emerald-300 mt-1">{{ money(totalPaid) }}</p></div>
          <div class="crm-card p-4"><p class="text-xs text-slate-400">Saldo pendiente</p><p :class="['text-xl font-extrabold font-mono mt-1', balance ? 'text-amber-300' : 'text-slate-400']">{{ money(balance) }}</p></div>
          <div class="crm-card p-4"><p class="text-xs text-slate-400">Proyectos activos</p><p class="text-xl font-extrabold font-mono text-cyan-300 mt-1">{{ projects.filter(p => p.status !== 'completed').length }}</p></div>
          <div class="crm-card p-4"><p class="text-xs text-slate-400">Casos de soporte abiertos</p><p class="text-xl font-extrabold font-mono text-violet-300 mt-1">{{ openTickets.length }}</p></div>
        </div>

        <!-- Pestañas -->
        <div class="flex gap-1 overflow-x-auto border-b border-slate-800">
          <button
            v-for="t in tabs" :key="t.key"
            :class="['flex items-center gap-2 px-3 sm:px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors', tab === t.key ? 'border-cyan-400 text-white' : 'border-transparent text-slate-400 hover:text-white']"
            @click="tab = t.key"
          ><component :is="t.icon" class="w-4 h-4" />{{ t.label }} <span class="text-xs text-slate-500">{{ t.count }}</span></button>
        </div>

        <!-- Cotizaciones -->
        <section v-if="tab === 'quotes'" class="space-y-3">
          <article v-for="q in quotes" :key="q.id" class="crm-card overflow-hidden">
            <button class="w-full p-4 sm:p-5 flex items-center gap-4 text-left hover:bg-slate-800/30 transition-colors" @click="open = open === q.id ? null : q.id">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-white"><span class="font-mono text-cyan-300">{{ q.id }}</span> · {{ q.serviceType }}</p>
                <p class="text-xs text-slate-500 mt-0.5">Emitida {{ formatDate(q.date) }} · válida hasta {{ formatDate(addDays(q.date, q.validityDays || 15)) }}</p>
              </div>
              <div class="text-right shrink-0">
                <p class="font-mono font-semibold text-white">{{ money(totals(q).total) }}</p>
                <StatusBadge :label="QUOTE_STATUS[quoteStatus(q)].label" :tone="QUOTE_STATUS[quoteStatus(q)].tone" :dot="false" />
              </div>
              <ChevronDownIcon :class="['w-5 h-5 text-slate-500 transition-transform shrink-0', open === q.id && 'rotate-180']" />
            </button>

            <div v-if="open === q.id" class="px-4 sm:px-5 pb-5 border-t border-slate-800 space-y-4">
              <table class="w-full text-sm mt-4">
                <thead><tr class="text-2xs uppercase tracking-wide text-slate-500 border-b border-slate-800"><th class="py-2 text-left">Descripción</th><th class="py-2 text-center w-14">Cant.</th><th class="py-2 text-right w-28">Importe</th></tr></thead>
                <tbody>
                  <tr v-for="i in q.items" :key="i.id" class="border-b border-slate-800/60">
                    <td class="py-2.5 pr-3 text-slate-200">{{ i.description }}<span class="block text-2xs text-slate-500 font-mono">{{ money(i.unitPrice) }} c/u</span></td>
                    <td class="py-2.5 text-center font-mono text-slate-300">{{ i.quantity }}</td>
                    <td class="py-2.5 text-right font-mono text-white">{{ money(i.quantity * i.unitPrice) }}</td>
                  </tr>
                </tbody>
              </table>
              <div class="flex justify-end">
                <div class="w-full sm:w-64 space-y-1.5 text-sm">
                  <div class="flex justify-between text-slate-400"><span>Subtotal</span><span class="font-mono">{{ money(totals(q).subtotal) }}</span></div>
                  <div v-if="totals(q).discount" class="flex justify-between text-emerald-300"><span>Descuento ({{ q.discountPercent }}%)</span><span class="font-mono">-{{ money(totals(q).discount) }}</span></div>
                  <div v-if="totals(q).tax" class="flex justify-between text-slate-400"><span>IVA ({{ totals(q).taxRate }}%)</span><span class="font-mono">{{ money(totals(q).tax) }}</span></div>
                  <div class="flex justify-between items-baseline pt-2 border-t border-slate-700"><span class="font-semibold text-white">Total</span><span class="text-xl font-extrabold font-mono text-cyan-300">{{ money(totals(q).total) }}</span></div>
                </div>
              </div>
              <div class="grid sm:grid-cols-3 gap-3 text-sm">
                <div v-if="q.deliveryTime" class="rounded-xl bg-slate-950/60 border border-slate-800 p-3"><p class="text-2xs uppercase tracking-wide text-slate-500">Entrega</p><p class="text-slate-200 mt-0.5">{{ q.deliveryTime }}</p></div>
                <div v-if="q.paymentTerms" class="rounded-xl bg-slate-950/60 border border-slate-800 p-3"><p class="text-2xs uppercase tracking-wide text-slate-500">Forma de pago</p><p class="text-slate-200 mt-0.5">{{ q.paymentTerms }}</p></div>
                <div v-if="q.notes" class="rounded-xl bg-slate-950/60 border border-slate-800 p-3"><p class="text-2xs uppercase tracking-wide text-slate-500">Garantía</p><p class="text-slate-200 mt-0.5">{{ q.notes }}</p></div>
              </div>

              <div v-if="q.status === 'approved'" class="flex items-center gap-2 text-sm text-emerald-200 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/30 px-3 py-2.5">
                <ShieldCheckIcon class="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Aprobada<template v-if="q.approvedBy"> por <strong>{{ q.approvedBy }}</strong></template><template v-if="q.approvedAt"> el {{ formatDateTime(q.approvedAt) }}</template>.</span>
              </div>
              <template v-else-if="quoteStatus(q) === 'sent'">
                <div v-if="approving !== q.id" class="flex flex-wrap gap-2 justify-end">
                  <a :href="contactUrl" target="_blank" rel="noopener" class="crm-btn-secondary !py-2 text-xs"><ChatBubbleOvalLeftEllipsisIcon class="w-4 h-4" />Tengo una pregunta</a>
                  <button class="crm-btn-primary !py-2 text-xs" @click="startApprove(q)"><CheckCircleIcon class="w-4 h-4" />Aprobar cotización</button>
                </div>
                <form v-else class="rounded-xl bg-slate-950/60 border border-cyan-500/30 p-4 space-y-3" @submit.prevent="confirmApprove(q)">
                  <p class="text-sm font-semibold text-white">Confirmar aprobación de {{ q.id }} por {{ money(totals(q).total) }}</p>
                  <div>
                    <label class="crm-label">Nombre de quien aprueba</label>
                    <input v-model="approverName" class="crm-input" maxlength="80" />
                  </div>
                  <label class="flex items-start gap-2.5 text-sm text-slate-300 cursor-pointer">
                    <input v-model="accepted" type="checkbox" class="accent-cyan-500 w-4 h-4 mt-0.5" />
                    <span>Acepto el alcance, el precio y las condiciones de esta cotización.</span>
                  </label>
                  <p v-if="approveMsg" class="text-sm text-rose-300">{{ approveMsg }}</p>
                  <div class="flex justify-end gap-2">
                    <button type="button" class="crm-btn-ghost !py-2 text-xs" @click="approving = null">Cancelar</button>
                    <button type="submit" class="crm-btn-primary !py-2 text-xs" :disabled="sending"><CheckCircleIcon class="w-4 h-4" />{{ sending ? 'Enviando…' : 'Confirmar aprobación' }}</button>
                  </div>
                </form>
              </template>
              <p v-else-if="quoteStatus(q) === 'expired'" class="text-sm text-amber-200 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/30 px-3 py-2.5">Esta cotización venció. <a :href="contactUrl" target="_blank" rel="noopener" class="underline">Escríbenos</a> para actualizarla.</p>
            </div>
          </article>
          <p v-if="!quotes.length" class="text-sm text-slate-500 text-center py-12">Aún no tienes cotizaciones.</p>
        </section>

        <!-- Proyectos -->
        <section v-else-if="tab === 'projects'" class="grid md:grid-cols-2 gap-3">
          <article v-for="p in projects" :key="p.id" class="crm-card p-5 space-y-4">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-xs font-mono text-cyan-300">{{ p.id }}</p>
                <h3 class="font-bold text-white leading-snug mt-0.5">{{ p.title }}</h3>
              </div>
              <StatusBadge :label="PROJECT_STATUS[p.status]?.label || p.status" :tone="PROJECT_STATUS[p.status]?.tone" />
            </div>
            <div>
              <div class="flex justify-between text-xs mb-1.5"><span class="text-slate-400">Avance</span><span class="font-mono text-white">{{ progress(p) }}%</span></div>
              <div class="h-2 rounded-full bg-slate-800 overflow-hidden"><div class="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" :style="{ width: progress(p) + '%' }"></div></div>
            </div>
            <ul v-if="p.milestones?.length" class="space-y-1.5">
              <li v-for="m in p.milestones" :key="m.id" class="flex items-center gap-2 text-sm">
                <CheckCircleIcon :class="['w-4 h-4 shrink-0', m.done ? 'text-emerald-400' : 'text-slate-700']" />
                <span :class="m.done ? 'text-slate-400' : 'text-slate-200'">{{ m.text }}</span>
              </li>
            </ul>
            <div class="pt-3 border-t border-slate-800 flex flex-wrap justify-between gap-2 text-xs">
              <span class="text-slate-400">Pagado {{ money(paidFor(p)) }} de {{ money(p.budget) }}</span>
              <span v-if="p.budget - paidFor(p) > 0" class="text-amber-300">Pendiente {{ money(p.budget - paidFor(p)) }}</span>
              <span v-else-if="p.budget" class="text-emerald-300">Pagado ✓</span>
              <span v-if="p.dueDate" class="w-full text-slate-500">Entrega estimada: {{ formatDate(p.dueDate) }}</span>
            </div>
          </article>
          <p v-if="!projects.length" class="md:col-span-2 text-sm text-slate-500 text-center py-12">Aún no hay proyectos.</p>
        </section>

        <!-- Pagos -->
        <section v-else-if="tab === 'payments'" class="crm-card">
          <ul class="divide-y divide-slate-800/60">
            <li v-for="x in payments" :key="x.id" class="px-4 sm:px-5 py-3.5 flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0"><BanknotesIcon class="w-5 h-5" /></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-white truncate">{{ x.note || 'Pago recibido' }}</p>
                <p class="text-xs text-slate-500">{{ formatDate(x.date) }} · {{ x.method }}<span v-if="x.reference"> · Ref. {{ x.reference }}</span></p>
              </div>
              <div class="text-right shrink-0">
                <p class="font-mono font-semibold text-emerald-300">{{ money(x.amount) }}</p>
                <p v-if="x.currency === 'VES' && x.amountVes" class="text-2xs font-mono text-slate-500">{{ formatBs(x.amountVes) }}</p>
              </div>
            </li>
            <li v-if="!payments.length" class="text-sm text-slate-500 text-center py-12">Aún no hay pagos registrados.</li>
          </ul>
        </section>

        <!-- Soporte -->
        <section v-else class="space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="text-sm text-slate-400">Historial de fallas reportadas y su solución.</p>
            <a :href="supportUrl" target="_blank" rel="noopener" class="crm-btn-whatsapp !py-2 text-xs"><ChatBubbleOvalLeftEllipsisIcon class="w-4 h-4" />Reportar una falla</a>
          </div>
          <article v-for="t in tickets" :key="t.id" class="crm-card p-4 sm:p-5">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-xs font-mono text-cyan-300">{{ t.id }}</p>
                <h3 class="font-semibold text-white mt-0.5">{{ t.title }}</h3>
                <p class="text-xs text-slate-500 mt-0.5"><span v-if="t.device">{{ t.device }} · </span>Reportado {{ timeAgo(t.openedAt) }}</p>
              </div>
              <StatusBadge :label="TICKET_STATUS[t.status]?.label || t.status" :tone="TICKET_STATUS[t.status]?.tone" />
            </div>
            <p v-if="t.status === 'resolved' && t.solution" class="mt-3 text-sm text-slate-300 rounded-xl bg-emerald-500/5 border border-emerald-500/20 px-3 py-2">
              <strong class="text-emerald-300">Solución:</strong> {{ t.solution }}<span v-if="t.resolvedAt" class="block text-2xs text-slate-500 mt-1">Resuelto el {{ formatDateTime(t.resolvedAt) }}</span>
            </p>
          </article>
          <p v-if="!tickets.length" class="text-sm text-slate-500 text-center py-12">No tienes casos de soporte registrados.</p>
        </section>
      </main>

      <footer class="border-t border-slate-800/80 mt-6">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap items-center justify-between gap-4 text-sm">
          <div class="text-slate-400">
            <p class="text-white font-semibold">{{ st.ownerName }}</p>
            <p class="text-xs">{{ st.ownerRole }} · {{ st.phone }} · {{ st.email }}</p>
          </div>
          <a :href="contactUrl" target="_blank" rel="noopener" class="crm-btn-whatsapp !py-2 text-xs"><ChatBubbleOvalLeftEllipsisIcon class="w-4 h-4" />Escribir por WhatsApp</a>
          <p class="w-full text-2xs text-slate-600">Este enlace es personal: no lo compartas. Los montos son referenciales y no constituyen factura fiscal.</p>
        </div>
      </footer>
    </template>
  </div>
</template>
