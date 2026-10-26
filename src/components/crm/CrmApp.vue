<script setup>
import { ref, computed, provide, watch, onMounted, onUnmounted } from 'vue';
import {
  HomeIcon, FunnelIcon, UserGroupIcon, DocumentTextIcon, FolderIcon, BanknotesIcon, CalendarDaysIcon, Cog6ToothIcon,
  ArrowUturnLeftIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon, MagnifyingGlassIcon, PlusIcon,
  CheckCircleIcon, ExclamationCircleIcon, CloudIcon, ArrowPathIcon, SparklesIcon, ChatBubbleOvalLeftEllipsisIcon
} from '@heroicons/vue/24/outline';
import { createCrmStore } from '../../crm/store';
import { createUi, VIEWS } from '../../crm/ui';
import { matches, initials, whatsappUrl, todayISO } from '../../crm/utils';
import { OWNER_WHATSAPP, QUOTE_STATUS, stageOf } from '../../crm/constants';
import DashboardView from './views/DashboardView.vue';
import PipelineView from './views/PipelineView.vue';
import ClientsView from './views/ClientsView.vue';
import QuotesView from './views/QuotesView.vue';
import ProjectsView from './views/ProjectsView.vue';
import PaymentsView from './views/PaymentsView.vue';
import AgendaView from './views/AgendaView.vue';
import SettingsView from './views/SettingsView.vue';
import ClientDrawer from './ClientDrawer.vue';
import ProformaModal from './ProformaModal.vue';
import ClientForm from './forms/ClientForm.vue';
import ProjectForm from './forms/ProjectForm.vue';
import PaymentForm from './forms/PaymentForm.vue';
import TaskForm from './forms/TaskForm.vue';

const props = defineProps({
  workspace: { type: String, required: true }, // 'demo' | 'private'
  view: { type: String, default: 'dashboard' },
  user: { type: Object, default: null }
});
const emit = defineEmits(['navigate', 'exit', 'logout']);

const crm = createCrmStore(props.workspace, { userId: props.user?.id });
const ui = createUi((view) => emit('navigate', view));
ui.view = props.view;
provide('crm', crm);
provide('ui', ui);
watch(() => props.view, (v) => { if (v !== ui.view) ui.go(v); });

const s = crm.state;
const isDemo = crm.isDemo;
const sidebarOpen = ref(false);
const quickOpen = ref(false);

const icons = { dashboard: HomeIcon, pipeline: FunnelIcon, clients: UserGroupIcon, quotes: DocumentTextIcon, projects: FolderIcon, payments: BanknotesIcon, agenda: CalendarDaysIcon, settings: Cog6ToothIcon };
const views = { dashboard: DashboardView, pipeline: PipelineView, clients: ClientsView, quotes: QuotesView, projects: ProjectsView, payments: PaymentsView, agenda: AgendaView, settings: SettingsView };
const today = todayISO();
const badges = computed(() => ({
  agenda: s.tasks.filter(t => !t.done && t.dueDate && t.dueDate <= today).length,
  quotes: s.quotes.filter(q => q.status === 'sent').length
}));
const navigate = (key) => { ui.go(key); sidebarOpen.value = false; };

// ---------------- Búsqueda global (Ctrl/Cmd + K)
const searchInput = ref(null);
const query = ref('');
const searchFocus = ref(false);
const results = computed(() => {
  if (query.value.trim().length < 2) return [];
  const q = query.value;
  const out = [];
  s.clients.filter(c => matches(q, c.company, c.name, c.phone, c.email)).slice(0, 5)
    .forEach(c => out.push({ key: c.id, type: 'Cliente', title: c.company, sub: `${c.name || ''} · ${stageOf(c.stage).label}`, run: () => ui.openClient(c.id) }));
  s.quotes.filter(x => matches(q, x.id, crm.client(x.clientId)?.company, x.serviceType)).slice(0, 4)
    .forEach(x => out.push({ key: x.id, type: 'Cotización', title: `${x.id} · ${crm.client(x.clientId)?.company || ''}`, sub: `${crm.money(crm.quoteTotals(x).total)} · ${QUOTE_STATUS[crm.quoteStatus(x)].label}`, run: () => ui.openProforma(x.id) }));
  s.projects.filter(p => matches(q, p.id, p.title, crm.client(p.clientId)?.company)).slice(0, 4)
    .forEach(p => out.push({ key: p.id, type: 'Proyecto', title: p.title, sub: crm.client(p.clientId)?.company, run: () => ui.go('projects') }));
  return out;
});
const onSearchBlur = () => setTimeout(() => { searchFocus.value = false; }, 150);
const runResult = (r) => { r.run(); query.value = ''; searchInput.value?.blur(); };
const onGlobalKey = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); searchInput.value?.focus(); }
};

// ---------------- Confirmación
const confirmText = ref('');
const closeConfirm = (value) => {
  ui.confirmState?.resolve(value);
  ui.confirmState = null;
  confirmText.value = '';
};

// ---------------- Sincronización (espacio privado)
const status = crm.status;
const syncLabel = computed(() => {
  if (status.error) return 'Error al guardar';
  if (status.saving || status.dirty) return 'Guardando…';
  return 'Guardado en la nube';
});
const beforeUnload = (e) => { if (crm.hasPending()) { e.preventDefault(); e.returnValue = ''; } };

onMounted(() => {
  document.addEventListener('keydown', onGlobalKey);
  window.addEventListener('beforeunload', beforeUnload);
  if (!isDemo) crm.load();
});
onUnmounted(() => {
  document.removeEventListener('keydown', onGlobalKey);
  window.removeEventListener('beforeunload', beforeUnload);
  crm.dispose();
});

const logout = async () => {
  if (crm.hasPending()) await crm.syncNow();
  emit('logout');
};

const demoPitch = whatsappUrl(OWNER_WHATSAPP, 'Hola Jeralth, vi la demo del CRM en tu página y me interesa uno para mi negocio.');
const quickActions = [
  { label: 'Cliente', icon: UserGroupIcon, run: () => ui.editClient() },
  { label: 'Cotización', icon: DocumentTextIcon, run: () => ui.editQuote() },
  { label: 'Proyecto', icon: FolderIcon, run: () => ui.editProject() },
  { label: 'Cobro', icon: BanknotesIcon, run: () => ui.addPayment() },
  { label: 'Tarea', icon: CalendarDaysIcon, run: () => ui.editTask() }
];
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-200 font-sans lg:pl-64">
    <!-- Barra lateral -->
    <div v-if="sidebarOpen" class="fixed inset-0 z-40 bg-slate-950/70 lg:hidden" @click="sidebarOpen = false"></div>
    <aside :class="['fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 lg:bg-slate-900/60 backdrop-blur border-r border-slate-800 flex flex-col transition-transform duration-300', sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']">
      <div class="px-5 py-5 flex items-center justify-between">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm shrink-0">{{ initials(s.settings.businessName) }}</div>
          <div class="min-w-0">
            <p class="text-sm font-bold text-white truncate">{{ s.settings.businessName }}</p>
            <p class="text-2xs text-slate-400 truncate">CRM · {{ isDemo ? 'Demo interactiva' : 'Mi espacio' }}</p>
          </div>
        </div>
        <button class="crm-icon-btn lg:hidden" @click="sidebarOpen = false"><XMarkIcon class="w-5 h-5" /></button>
      </div>

      <nav class="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <button
          v-for="v in VIEWS" :key="v.key"
          :class="['w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
            ui.view === v.key ? 'bg-cyan-500/15 text-cyan-200 ring-1 ring-inset ring-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60',
            v.key === 'settings' && 'mt-4']"
          @click="navigate(v.key)"
        >
          <component :is="icons[v.key]" class="w-5 h-5" />
          <span class="flex-1 text-left">{{ v.label }}</span>
          <span v-if="badges[v.key]" class="text-2xs font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-200">{{ badges[v.key] }}</span>
        </button>
      </nav>

      <div class="p-3 border-t border-slate-800 space-y-1">
        <div v-if="!isDemo" class="px-3 py-2 text-xs flex items-center gap-2" :class="status.error ? 'text-rose-300' : 'text-slate-500'">
          <ExclamationCircleIcon v-if="status.error" class="w-4 h-4" />
          <ArrowPathIcon v-else-if="status.saving || status.dirty" class="w-4 h-4 animate-spin" />
          <CloudIcon v-else class="w-4 h-4 text-emerald-400" />
          <span class="flex-1 truncate">{{ syncLabel }}</span>
          <button v-if="status.error" class="underline" @click="crm.syncNow()">Reintentar</button>
        </div>
        <p v-if="user" class="px-3 text-2xs text-slate-600 truncate">{{ user.email }}</p>
        <button class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800/60" @click="emit('exit')">
          <ArrowUturnLeftIcon class="w-5 h-5" />Volver a la web
        </button>
        <button v-if="!isDemo" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-rose-300 hover:bg-rose-500/10" @click="logout">
          <ArrowRightOnRectangleIcon class="w-5 h-5" />Cerrar sesión
        </button>
      </div>
    </aside>

    <!-- Barra superior -->
    <header class="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div v-if="isDemo" class="bg-gradient-to-r from-cyan-600/90 to-blue-700/90 text-white text-xs sm:text-sm">
        <div class="px-4 sm:px-6 py-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center">
          <span class="flex items-center gap-1.5"><SparklesIcon class="w-4 h-4" /><strong>Demo interactiva:</strong> datos ficticios, prueba todo con libertad.</span>
          <a :href="demoPitch" target="_blank" rel="noopener" class="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:text-cyan-100">
            <ChatBubbleOvalLeftEllipsisIcon class="w-4 h-4" />Quiero un sistema así para mi negocio
          </a>
        </div>
      </div>
      <div class="px-4 sm:px-6 h-16 flex items-center gap-3">
        <button class="crm-icon-btn lg:hidden -ml-2" aria-label="Menú" @click="sidebarOpen = true"><Bars3Icon class="w-6 h-6" /></button>

        <div class="relative flex-1 max-w-xl">
          <MagnifyingGlassIcon class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            ref="searchInput" v-model="query"
            class="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-14 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            placeholder="Buscar clientes, cotizaciones, proyectos…"
            @focus="searchFocus = true" @blur="onSearchBlur"
            @keydown.enter="results[0] && runResult(results[0])" @keydown.esc="query = ''"
          />
          <kbd class="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 text-2xs text-slate-500 border border-slate-700 rounded px-1.5 py-0.5 font-mono">Ctrl K</kbd>
          <div v-if="searchFocus && query.trim().length >= 2" class="absolute left-0 right-0 top-full mt-2 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden z-40">
            <button v-for="r in results" :key="r.type + r.key" class="w-full text-left px-4 py-2.5 hover:bg-slate-800 flex items-center gap-3" @mousedown.prevent="runResult(r)">
              <span class="text-2xs uppercase tracking-wide text-slate-500 w-20 shrink-0">{{ r.type }}</span>
              <span class="min-w-0"><span class="block text-sm text-white truncate">{{ r.title }}</span><span class="block text-xs text-slate-500 truncate">{{ r.sub }}</span></span>
            </button>
            <p v-if="!results.length" class="px-4 py-3 text-sm text-slate-500">Sin coincidencias para “{{ query }}”.</p>
          </div>
        </div>

        <div class="relative">
          <button class="crm-btn-primary !px-3 sm:!px-4" @click="quickOpen = !quickOpen"><PlusIcon class="w-5 h-5" /><span class="hidden sm:inline">Crear</span></button>
          <div v-if="quickOpen" class="fixed inset-0 z-30" @click="quickOpen = false"></div>
          <div v-if="quickOpen" class="absolute right-0 top-full mt-2 w-48 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl py-1 z-40">
            <button v-for="a in quickActions" :key="a.label" class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700" @click="quickOpen = false; a.run()">
              <component :is="a.icon" class="w-4 h-4 text-cyan-300" />{{ a.label }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido -->
    <main class="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1500px] mx-auto">
      <div v-if="status.loading" class="flex flex-col items-center justify-center py-32 text-slate-400">
        <ArrowPathIcon class="w-8 h-8 animate-spin text-cyan-400" />
        <p class="mt-3 text-sm">Cargando tus datos…</p>
      </div>
      <div v-else-if="!status.ready && status.error" class="crm-card p-8 max-w-lg mx-auto text-center mt-16">
        <ExclamationCircleIcon class="w-10 h-10 text-rose-400 mx-auto" />
        <h2 class="text-white font-bold mt-3">No pudimos cargar tus datos</h2>
        <p class="text-sm text-slate-400 mt-1">{{ status.error }}</p>
        <button class="crm-btn-primary mt-5" @click="crm.load()"><ArrowPathIcon class="w-4 h-4" />Reintentar</button>
      </div>
      <template v-else>
        <div v-if="status.migrated" class="mb-5 p-4 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/30 text-sm text-emerald-200 flex items-start gap-3">
          <CheckCircleIcon class="w-5 h-5 shrink-0" />
          <span class="flex-1">Importamos a la nube los clientes, cotizaciones y proyectos que tenías guardados en este navegador.</span>
          <button class="text-emerald-300" @click="status.migrated = false"><XMarkIcon class="w-4 h-4" /></button>
        </div>
        <component :is="views[ui.view]" v-bind="ui.view === 'settings' ? { userEmail: user?.email } : {}" />
      </template>
    </main>

    <!-- Modales globales -->
    <ClientDrawer v-if="ui.drawerClientId && crm.client(ui.drawerClientId)" :key="ui.drawerClientId" :client-id="ui.drawerClientId" @close="ui.drawerClientId = null" />
    <ClientForm v-if="ui.clientForm" :client="ui.clientForm.client" :prefill="ui.clientForm.prefill" @saved="ui.clientForm.onSaved?.($event)" @close="ui.clientForm = null" />
    <ProjectForm v-if="ui.projectForm" :project="ui.projectForm.project" :prefill="ui.projectForm.prefill" @close="ui.projectForm = null" />
    <PaymentForm v-if="ui.paymentForm" :payment="ui.paymentForm.payment" :prefill="ui.paymentForm.prefill" @close="ui.paymentForm = null" />
    <TaskForm v-if="ui.taskForm" :task="ui.taskForm.task" :prefill="ui.taskForm.prefill" @close="ui.taskForm = null" />
    <ProformaModal v-if="ui.proformaId && crm.quote(ui.proformaId)" :quote-id="ui.proformaId" @close="ui.proformaId = null" />

    <!-- Confirmación -->
    <Teleport to="body">
      <div v-if="ui.confirmState" class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" @mousedown.self="closeConfirm(false)">
        <div class="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
          <h3 class="text-base font-bold text-white">{{ ui.confirmState.title }}</h3>
          <p v-if="ui.confirmState.message" class="text-sm text-slate-400 mt-2 leading-relaxed">{{ ui.confirmState.message }}</p>
          <div v-if="ui.confirmState.requireText" class="mt-4">
            <label class="crm-label">Escribe <strong class="text-white font-mono">{{ ui.confirmState.requireText }}</strong> para confirmar</label>
            <input v-model="confirmText" class="crm-input font-mono" autofocus />
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button class="crm-btn-ghost" @click="closeConfirm(false)">Cancelar</button>
            <button
              :class="ui.confirmState.danger ? 'crm-btn-danger' : 'crm-btn-primary'"
              :disabled="ui.confirmState.requireText && confirmText !== ui.confirmState.requireText"
              @click="closeConfirm(true)"
            >{{ ui.confirmState.confirmLabel }}</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Notificaciones -->
    <Teleport to="body">
      <div class="fixed bottom-4 right-4 left-4 sm:left-auto z-[90] flex flex-col items-end gap-2 pointer-events-none">
        <TransitionGroup name="crm-fade">
          <div
            v-for="t in ui.toasts" :key="t.id"
            :class="['pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-sm max-w-sm',
              t.type === 'error' ? 'bg-rose-950 border-rose-500/40 text-rose-100' : 'bg-slate-800 border-slate-700 text-white']"
          >
            <ExclamationCircleIcon v-if="t.type === 'error'" class="w-5 h-5 text-rose-400 shrink-0" />
            <CheckCircleIcon v-else class="w-5 h-5 text-emerald-400 shrink-0" />
            {{ t.message }}
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </div>
</template>
