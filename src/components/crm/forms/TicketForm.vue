<script setup>
import { ref, computed } from 'vue';
import BaseModal from '../ui/BaseModal.vue';
import { useCrm, useUi } from '../../../crm/ui';
import { TICKET_STATUS, TICKET_PRIORITY, TICKET_CATEGORIES, TONES } from '../../../crm/constants';
import { clone } from '../../../crm/utils';

const props = defineProps({ ticket: { type: Object, default: null }, prefill: { type: Object, default: () => ({}) } });
const emit = defineEmits(['close']);
const crm = useCrm();
const ui = useUi();

// Con un ticket existente, prefill permite abrirlo ya en un estado (p. ej. para resolverlo).
const form = ref(props.ticket ? { ...clone(props.ticket), ...props.prefill } : {
  id: '', clientId: '', title: '', device: '', category: TICKET_CATEGORIES[0], priority: 'normal', status: 'open',
  openedAt: '', resolvedAt: null, description: '', solution: '', charge: 0,
  ...props.prefill
});
const resolving = computed(() => form.value.status === 'resolved');
const slaLabel = (h) => (h < 24 ? `${h} h` : `${h / 24} día${h / 24 === 1 ? '' : 's'}`);
// Equipos o sistemas reportados antes por el mismo cliente, como sugerencias.
const knownDevices = computed(() => [...new Set(crm.state.tickets.filter(t => t.clientId === form.value.clientId && t.device).map(t => t.device))]);

const error = ref('');
const save = () => {
  if (!form.value.clientId) { error.value = 'Selecciona el cliente que reporta la falla.'; return; }
  if (!form.value.title.trim()) { error.value = 'Describe brevemente el problema.'; return; }
  if (resolving.value && !form.value.solution.trim()) { error.value = 'Anota qué se hizo para resolverlo: queda en el historial del cliente.'; return; }
  const wasResolved = props.ticket?.status === 'resolved';
  const saved = crm.saveTicket(form.value);
  if (resolving.value && !wasResolved) {
    crm.logActivity(saved.clientId, 'system', `Ticket ${saved.id} resuelto: ${saved.title}.`);
    if (saved.charge > 0) {
      ui.toast(`Ticket resuelto. Cobro sugerido: ${crm.money(saved.charge)}`, 'success', {
        label: 'Registrar cobro',
        run: () => ui.addPayment({ clientId: saved.clientId, amount: saved.charge, note: `Soporte ${saved.id}: ${saved.title}` })
      });
    } else {
      ui.toast('Ticket resuelto');
    }
  } else {
    ui.toast(props.ticket ? 'Ticket actualizado' : `Ticket ${saved.id} abierto`);
  }
  emit('close');
};
</script>

<template>
  <BaseModal :title="ticket ? `Ticket ${ticket.id}` : 'Nuevo ticket de soporte'" subtitle="Fallas, solicitudes y visitas técnicas" size="md" @close="emit('close')">
    <form id="ticket-form" class="grid grid-cols-1 sm:grid-cols-2 gap-4" @submit.prevent="save">
      <div class="sm:col-span-2">
        <label class="crm-label">Cliente *</label>
        <select v-model="form.clientId" class="crm-input">
          <option value="" disabled>Selecciona…</option>
          <option v-for="c in crm.state.clients" :key="c.id" :value="c.id">{{ c.company }}</option>
        </select>
      </div>
      <div class="sm:col-span-2">
        <label class="crm-label">¿Qué está fallando? *</label>
        <input v-model="form.title" class="crm-input" placeholder="Ej. La caja 2 no imprime tickets" autofocus />
      </div>
      <div>
        <label class="crm-label">Equipo o sistema</label>
        <input v-model="form.device" class="crm-input" list="ticket-devices" placeholder="Ej. Impresora Bixolon SRP-350" />
        <datalist id="ticket-devices"><option v-for="d in knownDevices" :key="d" :value="d" /></datalist>
      </div>
      <div>
        <label class="crm-label">Categoría</label>
        <select v-model="form.category" class="crm-input">
          <option v-for="c in TICKET_CATEGORIES" :key="c">{{ c }}</option>
        </select>
      </div>

      <div class="sm:col-span-2">
        <label class="crm-label">Prioridad y tiempo de respuesta</label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            v-for="(p, key) in TICKET_PRIORITY" :key="key" type="button"
            :class="['rounded-xl border px-3 py-2 text-left transition-all', form.priority === key ? ['ring-1 ring-inset', TONES[p.tone]] : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white']"
            @click="form.priority = key"
          >
            <span class="block text-sm font-semibold">{{ p.label }}</span>
            <span class="block text-2xs opacity-80">Resolver en {{ slaLabel(p.sla) }}</span>
          </button>
        </div>
      </div>

      <div class="sm:col-span-2">
        <label class="crm-label">Detalle</label>
        <textarea v-model="form.description" rows="2" class="crm-input resize-none" placeholder="Síntomas, desde cuándo pasa, qué se probó…"></textarea>
      </div>

      <div class="sm:col-span-2">
        <label class="crm-label">Estado</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="(st, key) in TICKET_STATUS" :key="key" type="button"
            :class="['crm-chip', form.status === key && 'crm-chip-active']"
            @click="form.status = key"
          >{{ st.label }}</button>
        </div>
      </div>

      <template v-if="resolving || form.solution">
        <div class="sm:col-span-2">
          <label class="crm-label">Solución aplicada {{ resolving ? '*' : '' }}</label>
          <textarea v-model="form.solution" rows="2" class="crm-input resize-none" placeholder="Qué se hizo para resolverlo"></textarea>
        </div>
      </template>
      <div>
        <label class="crm-label">Cobro por el servicio</label>
        <input v-model.number="form.charge" type="number" min="0" step="1" class="crm-input font-mono" />
        <p class="text-2xs text-slate-500 mt-1">Déjalo en 0 si lo cubre su plan mensual o la garantía.</p>
      </div>
      <p v-if="error" class="sm:col-span-2 text-sm text-rose-400">{{ error }}</p>
    </form>
    <template #footer>
      <button class="crm-btn-ghost" @click="emit('close')">Cancelar</button>
      <button class="crm-btn-primary" type="submit" form="ticket-form">{{ resolving && ticket?.status !== 'resolved' ? 'Marcar como resuelto' : 'Guardar ticket' }}</button>
    </template>
  </BaseModal>
</template>
