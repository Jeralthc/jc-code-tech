// Controlador de interfaz compartido: navegación, modales globales, toasts y confirmaciones.
import { reactive, inject } from 'vue';

// group: título de la sección del menú lateral.
export const VIEWS = [
  { key: 'dashboard', label: 'Inicio', slug: 'inicio' },
  { key: 'pipeline', label: 'Pipeline', slug: 'pipeline', group: 'Ventas' },
  { key: 'clients', label: 'Clientes', slug: 'clientes', group: 'Ventas' },
  { key: 'quotes', label: 'Cotizaciones', slug: 'cotizaciones', group: 'Ventas' },
  { key: 'projects', label: 'Proyectos', slug: 'proyectos', group: 'Operación' },
  { key: 'tickets', label: 'Soporte', slug: 'soporte', group: 'Operación' },
  { key: 'agenda', label: 'Agenda', slug: 'agenda', group: 'Operación' },
  { key: 'payments', label: 'Cobranzas', slug: 'cobranzas', group: 'Finanzas' },
  { key: 'subscriptions', label: 'Planes mensuales', slug: 'planes', group: 'Finanzas' },
  { key: 'expenses', label: 'Gastos y utilidad', slug: 'gastos', group: 'Finanzas' },
  { key: 'reviews', label: 'Opiniones web', slug: 'opiniones', group: 'Cuenta', privateOnly: true },
  { key: 'settings', label: 'Ajustes', slug: 'ajustes', group: 'Cuenta' }
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
    ticketForm: null,
    subscriptionForm: null,
    expenseForm: null,
    quoteEditor: null,
    proformaId: null,
    portalClientId: null,

    go(view) {
      ui.view = view;
      ui.drawerClientId = null;
      ui.quoteEditor = null;
      onNavigate?.(view);
      window.scrollTo({ top: 0 });
    },
    // action opcional: { label, run } muestra un botón en la notificación (p. ej. Deshacer).
    toast(message, type = 'success', action = null) {
      const id = Date.now() + Math.random();
      ui.toasts.push({ id, message, type, action });
      setTimeout(() => ui.dismissToast(id), action ? 7000 : 3500);
    },
    dismissToast(id) { ui.toasts = ui.toasts.filter(t => t.id !== id); },
    // Notifica un borrado ofreciendo revertirlo (undo viene de crm.withUndo).
    deleted(message, undo) {
      ui.toast(message, 'success', { label: 'Deshacer', run: () => { undo(); ui.toast('Cambio revertido'); } });
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
    editTicket(ticket = null, prefill = {}) { ui.ticketForm = { ticket, prefill }; },
    editSubscription(plan = null, prefill = {}) { ui.subscriptionForm = { plan, prefill }; },
    editExpense(expense = null, prefill = {}) { ui.expenseForm = { expense, prefill }; },
    openPortal(clientId) { ui.portalClientId = clientId; },
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
