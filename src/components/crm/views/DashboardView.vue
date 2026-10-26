<script setup>
import { computed } from 'vue';
import {
  BanknotesIcon, ClockIcon, FunnelIcon, TrophyIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon,
  CheckIcon, ExclamationTriangleIcon, CalendarDaysIcon, PlusIcon, ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline';
import BarChart from '../ui/BarChart.vue';
import StatusBadge from '../ui/StatusBadge.vue';
import ClientAvatar from '../ui/ClientAvatar.vue';
import { useCrm, useUi } from '../../../crm/ui';
import { STAGES, OPEN_STAGES, ACTIVITY_TYPES, PROJECT_STATUS } from '../../../crm/constants';
import { todayISO, daysFromToday, relativeDay, monthLabel, formatCompact, formatShortDate, whatsappUrl } from '../../../crm/utils';

const crm = useCrm();
const ui = useUi();
const s = crm.state;
const cur = computed(() => s.settings.currency);
const compact = (v) => formatCompact(v, cur.value);

const hour = new Date().getHours();
const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
const firstName = computed(() => s.settings.ownerName?.split(' ')[0] || '');

// --- Cobros por mes (últimos 6) ---
const monthKey = (iso) => iso.slice(0, 7);
const months = computed(() => {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const value = s.payments.filter(p => p.date && monthKey(p.date) === key).reduce((a, p) => a + Number(p.amount), 0);
    return { key, label: monthLabel(d), value, highlight: i === 5 };
  });
});
const thisMonth = computed(() => months.value[5].value);
const lastMonth = computed(() => months.value[4].value);
const monthDelta = computed(() => lastMonth.value ? Math.round((thisMonth.value - lastMonth.value) / lastMonth.value * 100) : null);
const goalPct = computed(() => s.settings.monthlyGoal ? Math.min(100, Math.round(thisMonth.value / s.settings.monthlyGoal * 100)) : 0);

// --- KPIs ---
const receivable = computed(() => s.projects.reduce((a, p) => a + crm.projectBalance(p), 0));
const receivableCount = computed(() => s.projects.filter(p => crm.projectBalance(p) > 0).length);
const openClients = computed(() => s.clients.filter(c => OPEN_STAGES.includes(c.stage)));
const pipelineValue = computed(() => openClients.value.reduce((a, c) => a + Number(c.value || 0), 0));
const weighted = computed(() => openClients.value.reduce((a, c) => a + Number(c.value || 0) * STAGES.find(st => st.key === c.stage).prob / 100, 0));
const won = computed(() => s.clients.filter(c => c.stage === 'won').length);
const lost = computed(() => s.clients.filter(c => c.stage === 'lost').length);
const winRate = computed(() => (won.value + lost.value) ? Math.round(won.value / (won.value + lost.value) * 100) : 0);

// --- Pipeline por etapa ---
const funnel = computed(() => {
  const rows = OPEN_STAGES.map(key => {
    const list = s.clients.filter(c => c.stage === key);
    return { ...STAGES.find(st => st.key === key), count: list.length, value: list.reduce((a, c) => a + Number(c.value || 0), 0) };
  });
  const maxValue = Math.max(...rows.map(r => r.value), 1);
  return rows.map(r => ({ ...r, width: Math.max(r.value / maxValue * 100, r.count ? 4 : 0) }));
});

// --- Agenda: tareas pendientes + seguimientos de clientes cercanos ---
const agenda = computed(() => {
  const tasks = s.tasks.filter(t => !t.done).map(t => ({ kind: 'task', id: t.id, title: t.title, date: t.dueDate, clientId: t.clientId, priority: t.priority }));
  const follow = s.clients
    .filter(c => c.nextFollowUp && OPEN_STAGES.concat('won').includes(c.stage) && daysFromToday(c.nextFollowUp) <= 2)
    .map(c => ({ kind: 'follow', id: 'f-' + c.id, title: `Seguimiento: ${c.company}`, date: c.nextFollowUp, clientId: c.id }));
  return [...tasks, ...follow].sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999')).slice(0, 7);
});
const overdueCount = computed(() => s.tasks.filter(t => !t.done && t.dueDate && t.dueDate < todayISO()).length);

const activeProjects = computed(() => s.projects.filter(p => p.status !== 'completed').slice(0, 5));
const recent = computed(() => s.activities.slice(0, 7));
const clientName = (id) => crm.client(id)?.company || '—';
const isEmpty = computed(() => !s.clients.length);
</script>

<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <p class="text-sm text-slate-400">{{ greeting }}{{ firstName ? `, ${firstName}` : '' }} 👋</p>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">Resumen de tu negocio</h1>
      </div>
      <div class="flex flex-wrap gap-2">
        <button class="crm-btn-secondary" @click="ui.editClient()"><PlusIcon class="w-4 h-4" />Cliente</button>
        <button class="crm-btn-secondary" @click="ui.addPayment()"><BanknotesIcon class="w-4 h-4" />Cobro</button>
        <button class="crm-btn-primary" @click="ui.editQuote()"><PlusIcon class="w-4 h-4" />Cotización</button>
      </div>
    </div>

    <!-- Bienvenida cuando no hay datos -->
    <div v-if="isEmpty" class="crm-card p-6 sm:p-8 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-600/5">
      <h2 class="text-lg font-bold text-white">¡Bienvenido a tu CRM! Empecemos en 3 pasos</h2>
      <div class="grid sm:grid-cols-3 gap-4 mt-5">
        <button class="text-left p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 transition-colors" @click="ui.go('settings')">
          <span class="text-cyan-300 font-mono text-xs">PASO 1</span>
          <p class="font-semibold text-white mt-1">Revisa tu perfil</p>
          <p class="text-sm text-slate-400 mt-1">Nombre del negocio, datos de contacto y catálogo de servicios.</p>
        </button>
        <button class="text-left p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 transition-colors" @click="ui.editClient()">
          <span class="text-cyan-300 font-mono text-xs">PASO 2</span>
          <p class="font-semibold text-white mt-1">Registra tu primer cliente</p>
          <p class="text-sm text-slate-400 mt-1">O un prospecto que te escribió por WhatsApp.</p>
        </button>
        <button class="text-left p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 transition-colors" @click="ui.editQuote()">
          <span class="text-cyan-300 font-mono text-xs">PASO 3</span>
          <p class="font-semibold text-white mt-1">Envía una cotización</p>
          <p class="text-sm text-slate-400 mt-1">Con PDF profesional y envío directo por WhatsApp.</p>
        </button>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div class="crm-card p-4 sm:p-5">
        <div class="flex items-center justify-between text-slate-400 text-xs sm:text-sm"><span>Cobrado este mes</span><BanknotesIcon class="w-5 h-5 text-cyan-400" /></div>
        <div class="text-xl sm:text-3xl font-extrabold text-white mt-2 font-mono tracking-tight">{{ compact(thisMonth) }}</div>
        <div class="mt-2 flex items-center gap-1.5 text-xs">
          <template v-if="monthDelta !== null">
            <component :is="monthDelta >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon" :class="['w-4 h-4', monthDelta >= 0 ? 'text-emerald-400' : 'text-rose-400']" />
            <span :class="monthDelta >= 0 ? 'text-emerald-300' : 'text-rose-300'">{{ monthDelta > 0 ? '+' : '' }}{{ monthDelta }}%</span>
            <span class="text-slate-500">vs. mes anterior</span>
          </template>
          <span v-else class="text-slate-500">Primer mes con cobros</span>
        </div>
        <div v-if="s.settings.monthlyGoal" class="mt-3">
          <div class="h-1.5 rounded-full bg-slate-800 overflow-hidden"><div class="h-full bg-cyan-400 rounded-full" :style="{ width: goalPct + '%' }"></div></div>
          <p class="text-2xs text-slate-500 mt-1">{{ goalPct }}% de la meta ({{ compact(s.settings.monthlyGoal) }})</p>
        </div>
      </div>
      <button class="crm-card p-4 sm:p-5 text-left hover:border-amber-500/40 transition-colors" @click="ui.go('payments')">
        <div class="flex items-center justify-between text-slate-400 text-xs sm:text-sm"><span>Por cobrar</span><ClockIcon class="w-5 h-5 text-amber-400" /></div>
        <div class="text-xl sm:text-3xl font-extrabold text-white mt-2 font-mono tracking-tight">{{ compact(receivable) }}</div>
        <p class="mt-2 text-xs text-slate-500">{{ receivableCount }} proyecto(s) con saldo pendiente</p>
      </button>
      <button class="crm-card p-4 sm:p-5 text-left hover:border-violet-500/40 transition-colors" @click="ui.go('pipeline')">
        <div class="flex items-center justify-between text-slate-400 text-xs sm:text-sm"><span>Pipeline abierto</span><FunnelIcon class="w-5 h-5 text-violet-400" /></div>
        <div class="text-xl sm:text-3xl font-extrabold text-white mt-2 font-mono tracking-tight">{{ compact(pipelineValue) }}</div>
        <p class="mt-2 text-xs text-slate-500">{{ openClients.length }} oportunidades · ponderado {{ compact(weighted) }}</p>
      </button>
      <div class="crm-card p-4 sm:p-5">
        <div class="flex items-center justify-between text-slate-400 text-xs sm:text-sm"><span>Tasa de cierre</span><TrophyIcon class="w-5 h-5 text-emerald-400" /></div>
        <div class="text-xl sm:text-3xl font-extrabold text-white mt-2 font-mono tracking-tight">{{ winRate }}%</div>
        <p class="mt-2 text-xs text-slate-500">{{ won }} ganados · {{ lost }} perdidos</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-4 sm:gap-6">
      <!-- Cobros por mes -->
      <div class="crm-card p-5 sm:p-6 lg:col-span-2">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="font-bold text-white">Cobros de los últimos 6 meses</h3>
            <p class="text-xs text-slate-400 mt-0.5">Dinero efectivamente recibido</p>
          </div>
          <span class="text-sm font-mono text-slate-300">{{ compact(months.reduce((a, m) => a + m.value, 0)) }}</span>
        </div>
        <BarChart :data="months" :format="compact" :goal="s.settings.monthlyGoal" />
      </div>

      <!-- Agenda -->
      <div class="crm-card p-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-white flex items-center gap-2"><CalendarDaysIcon class="w-5 h-5 text-cyan-400" />Próximo en tu agenda</h3>
          <button class="text-xs text-cyan-300 hover:underline" @click="ui.go('agenda')">Ver todo</button>
        </div>
        <div v-if="overdueCount" class="mb-3 flex items-center gap-2 text-xs text-rose-300 bg-rose-500/10 ring-1 ring-rose-500/30 rounded-lg px-3 py-2">
          <ExclamationTriangleIcon class="w-4 h-4" />{{ overdueCount }} tarea(s) atrasada(s)
        </div>
        <ul class="space-y-1.5">
          <li v-for="a in agenda" :key="a.id" class="flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-slate-800/40">
            <button
              v-if="a.kind === 'task'"
              class="mt-0.5 w-5 h-5 shrink-0 rounded-md border border-slate-600 hover:border-cyan-400 flex items-center justify-center"
              title="Marcar como hecha" @click="crm.toggleTask(a.id)"
            ><CheckIcon class="w-3.5 h-3.5 text-transparent hover:text-cyan-300" /></button>
            <ChatBubbleLeftRightIcon v-else class="w-5 h-5 shrink-0 text-violet-400 mt-0.5" />
            <button class="flex-1 min-w-0 text-left" @click="a.clientId && ui.openClient(a.clientId)">
              <p class="text-sm text-slate-200 truncate">{{ a.title }}</p>
              <p :class="['text-xs', daysFromToday(a.date) < 0 ? 'text-rose-300' : daysFromToday(a.date) === 0 ? 'text-amber-300' : 'text-slate-500']">
                {{ relativeDay(a.date) }}<span v-if="a.kind === 'task' && a.clientId"> · {{ clientName(a.clientId) }}</span>
              </p>
            </button>
          </li>
          <li v-if="!agenda.length" class="text-sm text-slate-500 py-6 text-center">Nada pendiente. ¡Buen trabajo! 🎉</li>
        </ul>
        <button class="crm-btn-ghost w-full mt-3 text-xs" @click="ui.editTask()"><PlusIcon class="w-4 h-4" />Agregar tarea</button>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-4 sm:gap-6">
      <!-- Pipeline -->
      <div class="crm-card p-5 sm:p-6">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-bold text-white">Oportunidades por etapa</h3>
          <button class="text-xs text-cyan-300 hover:underline" @click="ui.go('pipeline')">Pipeline</button>
        </div>
        <div class="space-y-4">
          <div v-for="f in funnel" :key="f.key">
            <div class="flex items-center justify-between text-sm mb-1.5">
              <span class="text-slate-300">{{ f.label }} <span class="text-slate-500">({{ f.count }})</span></span>
              <span class="font-mono text-slate-200">{{ compact(f.value) }}</span>
            </div>
            <div class="h-2 rounded-full bg-slate-800 overflow-hidden"><div class="h-full rounded-[4px] bg-violet-400/80" :style="{ width: f.width + '%' }"></div></div>
          </div>
        </div>
      </div>

      <!-- Proyectos activos -->
      <div class="crm-card p-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-white">Proyectos en curso</h3>
          <button class="text-xs text-cyan-300 hover:underline" @click="ui.go('projects')">Ver todos</button>
        </div>
        <ul class="space-y-4">
          <li v-for="p in activeProjects" :key="p.id">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <p class="text-sm font-medium text-white truncate">{{ p.title }}</p>
                <p class="text-xs text-slate-500 truncate">{{ clientName(p.clientId) }}</p>
              </div>
              <StatusBadge :label="PROJECT_STATUS[p.status]?.label" :tone="PROJECT_STATUS[p.status]?.tone" />
            </div>
            <div class="flex items-center gap-2 mt-2">
              <div class="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden"><div class="h-full bg-cyan-400 rounded-full" :style="{ width: crm.projectProgress(p) + '%' }"></div></div>
              <span class="text-xs font-mono text-slate-400 w-9 text-right">{{ crm.projectProgress(p) }}%</span>
            </div>
            <p v-if="p.dueDate" :class="['text-2xs mt-1', daysFromToday(p.dueDate) < 0 ? 'text-rose-300' : 'text-slate-500']">Entrega: {{ formatShortDate(p.dueDate) }} ({{ relativeDay(p.dueDate) }})</p>
          </li>
          <li v-if="!activeProjects.length" class="text-sm text-slate-500 py-6 text-center">Sin proyectos activos.</li>
        </ul>
      </div>

      <!-- Actividad reciente -->
      <div class="crm-card p-5 sm:p-6">
        <h3 class="font-bold text-white mb-4">Actividad reciente</h3>
        <ul class="space-y-3">
          <li v-for="a in recent" :key="a.id" class="flex gap-3">
            <ClientAvatar :name="clientName(a.clientId)" size="sm" />
            <button class="min-w-0 text-left" @click="ui.openClient(a.clientId)">
              <p class="text-sm text-slate-300 line-clamp-2"><span class="mr-1">{{ ACTIVITY_TYPES[a.type]?.icon }}</span>{{ a.text }}</p>
              <p class="text-xs text-slate-500 mt-0.5">{{ clientName(a.clientId) }} · {{ relativeDay(a.date) }}</p>
            </button>
          </li>
          <li v-if="!recent.length" class="text-sm text-slate-500 py-6 text-center">Aún no hay actividad.</li>
        </ul>
      </div>
    </div>
  </div>
</template>
