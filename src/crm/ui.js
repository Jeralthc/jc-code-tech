// Controlador de interfaz compartido: navegación, modales globales, toasts y confirmaciones.
import { reactive, inject } from 'vue';

export const VIEWS = [
  { key: 'dashboard', label: 'Inicio', slug: 'inicio' },
  { key: 'pipeline', label: 'Pipeline', slug: 'pipeline' },
  { key: 'clients', label: 'Clientes', slug: 'clientes' },
  { key: 'quotes', label: 'Cotizaciones', slug: 'cotizaciones' },
  { key: 'projects', label: 'Proyectos', slug: 'proyectos' },
  { key: 'payments', label: 'Cobranzas', slug: 'cobranzas' },
  { key: 'agenda', label: 'Agenda', slug: 'agenda' },
  { key: 'reviews', label: 'Opiniones web', slug: 'opiniones', privateOnly: true },
  { key: 'settings', label: 'Ajustes', slug: 'ajustes' }
];

export const viewFromSlug = (slug) => VIEWS.find(v => v.slug === slug)?.key || 'dashboard';
export const slugFromView = (key) => VIEWS.find(v => v.key === key)?.slug || 'inicio';

export function createUi(onNavigate) {
  const ui = reactive({
    view: 'dashboard',
    toasts: [],
    confirmState: null,
    drawerClientId: null,
    clientForm: null,
    projectForm: null,
    paymentForm: null,
    taskForm: null,
    quoteEditor: null,
    proformaId: null,

    go(view) {
      ui.view = view;
      ui.drawerClientId = null;
      ui.quoteEditor = null;
      onNavigate?.(view);
      window.scrollTo({ top: 0 });
    },
    toast(message, type = 'success') {
      const id = Date.now() + Math.random();
      ui.toasts.push({ id, message, type });
      setTimeout(() => { ui.toasts = ui.toasts.filter(t => t.id !== id); }, 3500);
    },
    confirm({ title, message = '', confirmLabel = 'Confirmar', danger = false, requireText = '' }) {
      return new Promise(resolve => {
        ui.confirmState = { title, message, confirmLabel, danger, requireText, resolve };
      });
    },
    openClient(id) { ui.drawerClientId = id; },
    editClient(client = null, prefill = {}, onSaved = null) { ui.clientForm = { client, prefill, onSaved }; },
    editProject(project = null, prefill = {}) { ui.projectForm = { project, prefill }; },
    addPayment(prefill = {}, payment = null) { ui.paymentForm = { payment, prefill }; },
    editTask(task = null, prefill = {}) { ui.taskForm = { task, prefill }; },
    // Abre el editor de cotizaciones: id existente o nueva (opcionalmente para un cliente).
    editQuote(id = null, clientId = '') {
      ui.go('quotes');
      ui.quoteEditor = { id, clientId, key: Date.now() };
    },
    openProforma(id) { ui.proformaId = id; }
  });
  return ui;
}

export const useCrm = () => inject('crm');
export const useUi = () => inject('ui');
