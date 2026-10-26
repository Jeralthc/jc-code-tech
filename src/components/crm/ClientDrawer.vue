<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  XMarkIcon, PencilSquareIcon, TrashIcon, PhoneIcon, EnvelopeIcon, ChatBubbleOvalLeftEllipsisIcon,
  DocumentTextIcon, BanknotesIcon, FolderIcon, CalendarDaysIcon, MapPinIcon, PlusIcon
} from '@heroicons/vue/24/outline';
import ClientAvatar from './ui/ClientAvatar.vue';
import StatusBadge from './ui/StatusBadge.vue';
import { useCrm, useUi } from '../../crm/ui';
import { STAGES, ACTIVITY_TYPES, QUOTE_STATUS, PROJECT_STATUS } from '../../crm/constants';
import { formatDate, relativeDay, daysFromToday, todayISO, addDays, whatsappUrl, formatMoney } from '../../crm/utils';

const props = defineProps({ clientId: { type: String, required: true } });
const emit = defineEmits(['close']);
const crm = useCrm();
const ui = useUi();
const s = crm.state;

const c = computed(() => crm.client(props.clientId));
const money = (v) => formatMoney(v, s.settings.currency);
const tab = ref('activity');

const activities = computed(() => s.activities.filter(a => a.clientId === props.clientId));
const quotes = computed(() => s.quotes.filter(q => q.clientId === props.clientId));
const projects = computed(() => s.projects.filter(p => p.clientId === props.clientId));
const payments = computed(() => s.payments.filter(p => p.clientId === props.clientId).sort((a, b) => b.date.localeCompare(a.date)));
const tasks = computed(() => s.tasks.filter(t => t.clientId === props.clientId && !t.done));
const quoted = computed(() => quotes.value.filter(q => q.status !== 'rejected').reduce((a, q) => a + crm.quoteTotals(q).total, 0));

const tabs = computed(() => [
  { key: 'activity', label: 'Historial', count: activities.value.length },
  { key: 'quotes', label: 'Cotizaciones', count: quotes.value.length },
  { key: 'projects', label: 'Proyectos', count: projects.value.length },
  { key: 'payments', label: 'Cobros', count: payments.value.length }
]);

// Registro rápido de actividad
const noteType = ref('note');
const noteText = ref('');
const addNote = () => {
  const text = noteText.value.trim();
  if (!text) return;
  crm.logActivity(props.clientId, noteType.value, text);
  noteText.value = '';
  ui.toast('Actividad registrada');
};

const setFollowUp = (days) => {
  c.value.nextFollowUp = days === null ? null : addDays(todayISO(), days);
};

const remove = async () => {
  const links = crm.clientLinks(props.clientId);
  const detail = [links.quotes && `${links.quotes} cotización(es)`, links.projects && `${links.projects} proyecto(s)`, links.payments && `${links.payments} cobro(s)`].filter(Boolean).join(', ');
  const ok = await ui.confirm({
    title: `¿Eliminar a ${c.value.company}?`,
    message: detail ? `También se eliminarán ${detail} y todo su historial. Esta acción no se puede deshacer.` : 'Se eliminará el cliente y su historial. Esta acción no se puede deshacer.',
    confirmLabel: 'Eliminar cliente',
    danger: true
  });
  if (!ok) return;
  crm.deleteClient(props.clientId);
  ui.toast('Cliente eliminado');
  emit('close');
};

const onKey = (e) => { if (e.key === 'Escape' && !ui.confirmState && !ui.clientForm && !ui.paymentForm && !ui.taskForm && !ui.projectForm) emit('close'); };
onMounted(() => document.addEventListener('keydown', onKey));
onUnmounted(() => document.removeEventListener('keydown', onKey));
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-[2px]" @click="emit('close')"></div>
    <aside v-if="c" class="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
      <!-- Cabecera -->
      <div class="p-5 sm:p-6 border-b border-slate-800 space-y-4">
        <div class="flex items-start gap-4">
          <ClientAvatar :name="c.company" size="lg" />
          <div class="flex-1 min-w-0">
            <h2 class="text-lg font-bold text-white leading-tight">{{ c.company }}</h2>
            <p class="text-sm text-slate-400">{{ c.name || 'Sin persona de contacto' }}</p>
            <div class="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500">
              <span class="font-mono">{{ c.id }}</span>
              <span v-if="c.city" class="flex items-center gap-1"><MapPinIcon class="w-3.5 h-3.5" />{{ c.city }}</span>
              <span v-if="c.industry">· {{ c.industry }}</span>
              <span v-if="c.source">· vía {{ c.source }}</span>
            </div>
          </div>
          <button class="crm-icon-btn -mr-2 -mt-1" aria-label="Cerrar" @click="emit('close')"><XMarkIcon class="w-5 h-5" /></button>
        </div>

        <div class="flex flex-wrap gap-2">
          <a v-if="c.phone" :href="whatsappUrl(c.phone, `Hola ${c.name?.split(' ')[0] || ''}, `)" target="_blank" rel="noopener" class="crm-btn-whatsapp !px-3 !py-2 text-xs"><ChatBubbleOvalLeftEllipsisIcon class="w-4 h-4" />WhatsApp</a>
          <a v-if="c.phone" :href="`tel:${c.phone}`" class="crm-btn-secondary !px-3 !py-2 text-xs"><PhoneIcon class="w-4 h-4" />Llamar</a>
          <a v-if="c.email" :href="`mailto:${c.email}`" class="crm-btn-secondary !px-3 !py-2 text-xs"><EnvelopeIcon class="w-4 h-4" />Correo</a>
          <button class="crm-btn-secondary !px-3 !py-2 text-xs" @click="ui.editClient(c)"><PencilSquareIcon class="w-4 h-4" />Editar</button>
          <button class="crm-icon-btn hover:text-rose-400 ml-auto" title="Eliminar cliente" @click="remove"><TrashIcon class="w-5 h-5" /></button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto">
        <!-- Etapa y seguimiento -->
        <div class="p-5 sm:p-6 grid grid-cols-2 gap-4 border-b border-slate-800">
          <div>
            <label class="crm-label">Etapa</label>
            <select :value="c.stage" class="crm-input !py-2" @change="crm.setClientStage(c.id, $event.target.value)">
              <option v-for="st in STAGES" :key="st.key" :value="st.key">{{ st.label }}</option>
            </select>
          </div>
          <div>
            <label class="crm-label">Valor estimado</label>
            <input v-model.number="c.value" type="number" min="0" step="10" class="crm-input !py-2 font-mono" />
          </div>
          <div class="col-span-2">
            <label class="crm-label flex items-center gap-1.5"><CalendarDaysIcon class="w-4 h-4" />Próximo seguimiento</label>
            <div class="flex flex-wrap items-center gap-2">
              <input v-model="c.nextFollowUp" type="date" class="crm-input !py-2 !w-44" />
              <button class="crm-chip" @click="setFollowUp(1)">Mañana</button>
              <button class="crm-chip" @click="setFollowUp(3)">3 días</button>
              <button class="crm-chip" @click="setFollowUp(7)">1 semana</button>
              <button v-if="c.nextFollowUp" class="text-xs text-slate-500 hover:text-white" @click="setFollowUp(null)">Quitar</button>
            </div>
            <p v-if="c.nextFollowUp" :class="['text-xs mt-1.5', daysFromToday(c.nextFollowUp) < 0 ? 'text-rose-300' : 'text-slate-500']">{{ relativeDay(c.nextFollowUp) }} — {{ formatDate(c.nextFollowUp) }}</p>
          </div>
        </div>

        <!-- Resumen financiero -->
        <div class="grid grid-cols-3 divide-x divide-slate-800 border-b border-slate-800">
          <div class="p-4 text-center"><p class="text-2xs uppercase tracking-wide text-slate-500">Cotizado</p><p class="font-mono font-semibold text-white mt-1">{{ money(quoted) }}</p></div>
          <div class="p-4 text-center"><p class="text-2xs uppercase tracking-wide text-slate-500">Cobrado</p><p class="font-mono font-semibold text-emerald-300 mt-1">{{ money(crm.clientPaid(c.id)) }}</p></div>
          <div class="p-4 text-center"><p class="text-2xs uppercase tracking-wide text-slate-500">Saldo</p><p class="font-mono font-semibold mt-1" :class="crm.clientBalance(c.id) ? 'text-amber-300' : 'text-slate-500'">{{ money(crm.clientBalance(c.id)) }}</p></div>
        </div>

        <!-- Notas y contacto -->
        <div class="p-5 sm:p-6 border-b border-slate-800 space-y-3">
          <div class="text-sm space-y-1">
            <p v-if="c.phone" class="text-slate-300 font-mono">{{ c.phone }}</p>
            <p v-if="c.email" class="text-slate-400">{{ c.email }}</p>
          </div>
          <div v-if="c.tags?.length" class="flex flex-wrap gap-1.5">
            <span v-for="t in c.tags" :key="t" class="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">{{ t }}</span>
          </div>
          <p v-if="c.notes" class="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/50 rounded-xl p-3 border border-slate-800">{{ c.notes }}</p>
          <div v-if="tasks.length" class="space-y-1.5">
            <p class="text-xs font-semibold text-slate-400">Tareas pendientes</p>
            <label v-for="t in tasks" :key="t.id" class="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" class="accent-cyan-500" @change="crm.toggleTask(t.id)" />
              <span class="flex-1">{{ t.title }}</span>
              <span :class="['text-xs', daysFromToday(t.dueDate) < 0 ? 'text-rose-300' : 'text-slate-500']">{{ relativeDay(t.dueDate) }}</span>
            </label>
          </div>
          <div class="flex flex-wrap gap-2 pt-1">
            <button class="crm-btn-secondary !px-3 !py-2 text-xs" @click="ui.editQuote(null, c.id)"><DocumentTextIcon class="w-4 h-4" />Cotizar</button>
            <button class="crm-btn-secondary !px-3 !py-2 text-xs" @click="ui.addPayment({ clientId: c.id })"><BanknotesIcon class="w-4 h-4" />Cobro</button>
            <button class="crm-btn-secondary !px-3 !py-2 text-xs" @click="ui.editProject(null, { clientId: c.id })"><FolderIcon class="w-4 h-4" />Proyecto</button>
            <button class="crm-btn-secondary !px-3 !py-2 text-xs" @click="ui.editTask(null, { clientId: c.id })"><PlusIcon class="w-4 h-4" />Tarea</button>
          </div>
        </div>

        <!-- Pestañas -->
        <div class="px-5 sm:px-6 pt-4 flex gap-1 border-b border-slate-800 overflow-x-auto">
          <button
            v-for="t in tabs" :key="t.key"
            :class="['px-3 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors', tab === t.key ? 'border-cyan-400 text-white' : 'border-transparent text-slate-400 hover:text-white']"
            @click="tab = t.key"
          >{{ t.label }} <span class="text-xs text-slate-500">{{ t.count }}</span></button>
        </div>

        <div class="p-5 sm:p-6">
          <!-- Historial -->
          <div v-if="tab === 'activity'" class="space-y-5">
            <form class="space-y-2" @submit.prevent="addNote">
              <div class="flex gap-1.5 flex-wrap">
                <button
                  v-for="(t, key) in ACTIVITY_TYPES" v-show="key !== 'system'" :key="key" type="button"
                  :class="['crm-chip !px-2.5 !py-1', noteType === key && 'crm-chip-active']" @click="noteType = key"
                >{{ t.icon }} {{ t.label }}</button>
              </div>
              <div class="flex gap-2">
                <input v-model="noteText" class="crm-input" placeholder="¿Qué pasó? Ej. Llamé y pidió la propuesta por correo" />
                <button class="crm-btn-primary !px-4" type="submit">Guardar</button>
              </div>
            </form>
            <ol class="relative border-l border-slate-800 ml-2 space-y-5">
              <li v-for="a in activities" :key="a.id" class="ml-5 group">
                <span class="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 ring-4 ring-slate-900 text-xs">{{ ACTIVITY_TYPES[a.type]?.icon }}</span>
                <div class="flex items-start justify-between gap-2">
                  <p :class="['text-sm leading-relaxed', a.type === 'system' ? 'text-slate-400' : 'text-slate-200']">{{ a.text }}</p>
                  <button class="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400" title="Borrar" @click="crm.deleteActivity(a.id)"><XMarkIcon class="w-4 h-4" /></button>
                </div>
                <p class="text-xs text-slate-500 mt-0.5">{{ ACTIVITY_TYPES[a.type]?.label }} · {{ formatDate(a.date) }}</p>
              </li>
              <li v-if="!activities.length" class="ml-5 text-sm text-slate-500">Sin actividad registrada todavía.</li>
            </ol>
          </div>

          <!-- Cotizaciones -->
          <ul v-else-if="tab === 'quotes'" class="space-y-2">
            <li v-for="q in quotes" :key="q.id">
              <button class="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-600 text-left" @click="ui.openProforma(q.id)">
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-white"><span class="font-mono text-cyan-300">{{ q.id }}</span> · {{ q.serviceType }}</p>
                  <p class="text-xs text-slate-500">{{ formatDate(q.date) }}</p>
                </div>
                <div class="text-right shrink-0">
                  <p class="font-mono text-sm text-white">{{ money(crm.quoteTotals(q).total) }}</p>
                  <StatusBadge :label="QUOTE_STATUS[crm.quoteStatus(q)].label" :tone="QUOTE_STATUS[crm.quoteStatus(q)].tone" :dot="false" />
                </div>
              </button>
            </li>
            <li v-if="!quotes.length" class="text-sm text-slate-500 text-center py-6">Sin cotizaciones. <button class="text-cyan-300 hover:underline" @click="ui.editQuote(null, c.id)">Crear una</button></li>
          </ul>

          <!-- Proyectos -->
          <ul v-else-if="tab === 'projects'" class="space-y-2">
            <li v-for="p in projects" :key="p.id" class="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <div class="flex items-start justify-between gap-2">
                <p class="text-sm font-semibold text-white">{{ p.title }}</p>
                <StatusBadge :label="PROJECT_STATUS[p.status]?.label" :tone="PROJECT_STATUS[p.status]?.tone" />
              </div>
              <div class="flex items-center gap-2 mt-2">
                <div class="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden"><div class="h-full bg-cyan-400" :style="{ width: crm.projectProgress(p) + '%' }"></div></div>
                <span class="text-xs font-mono text-slate-400">{{ crm.projectProgress(p) }}%</span>
              </div>
              <p class="text-xs text-slate-500 mt-1.5">Cobrado {{ money(crm.projectPaid(p)) }} de {{ money(p.budget) }}</p>
            </li>
            <li v-if="!projects.length" class="text-sm text-slate-500 text-center py-6">Sin proyectos.</li>
          </ul>

          <!-- Cobros -->
          <ul v-else class="space-y-2">
            <li v-for="p in payments" :key="p.id" class="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <div class="min-w-0">
                <p class="text-sm text-white">{{ p.note || 'Pago' }}</p>
                <p class="text-xs text-slate-500">{{ formatDate(p.date) }} · {{ p.method }}<span v-if="p.reference"> · Ref. {{ p.reference }}</span></p>
              </div>
              <span class="font-mono text-sm text-emerald-300 shrink-0">{{ money(p.amount) }}</span>
            </li>
            <li v-if="!payments.length" class="text-sm text-slate-500 text-center py-6">Sin cobros registrados.</li>
          </ul>
        </div>
      </div>
    </aside>
  </Teleport>
</template>
