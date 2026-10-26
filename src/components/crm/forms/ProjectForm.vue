<script setup>
import { ref } from 'vue';
import BaseModal from '../ui/BaseModal.vue';
import { useCrm, useUi } from '../../../crm/ui';
import { PROJECT_STATUS, SERVICE_TYPES } from '../../../crm/constants';
import { clone, todayISO, addDays } from '../../../crm/utils';

const props = defineProps({ project: { type: Object, default: null }, prefill: { type: Object, default: () => ({}) } });
const emit = defineEmits(['close']);
const crm = useCrm();
const ui = useUi();

const form = ref(props.project ? clone(props.project) : {
  id: '', title: '', clientId: crm.state.clients[0]?.id || '', quoteId: null, category: SERVICE_TYPES[0],
  status: 'planning', budget: 0, startDate: todayISO(), dueDate: addDays(todayISO(), 15), description: '',
  milestones: [], ...props.prefill
});
const milestonesText = ref(props.project ? '' : 'Levantamiento de requerimientos\nDesarrollo e implementación\nPruebas y entrega');
const error = ref('');

const save = () => {
  if (!form.value.title.trim()) { error.value = 'Escribe el nombre del proyecto.'; return; }
  if (!form.value.clientId) { error.value = 'Selecciona un cliente (o registra uno primero).'; return; }
  if (!props.project) {
    form.value.milestones = milestonesText.value.split('\n').map(t => t.trim()).filter(Boolean)
      .map((text, i) => ({ id: i + 1, text, done: false }));
  }
  crm.saveProject(form.value);
  ui.toast(props.project ? 'Proyecto actualizado' : 'Proyecto creado');
  emit('close');
};
</script>

<template>
  <BaseModal :title="project ? 'Editar proyecto' : 'Nuevo proyecto'" @close="emit('close')">
    <form id="project-form" class="grid grid-cols-1 sm:grid-cols-2 gap-4" @submit.prevent="save">
      <div class="sm:col-span-2">
        <label class="crm-label">Nombre del proyecto *</label>
        <input v-model="form.title" class="crm-input" placeholder="Ej. Sistema de inventario con 3 cajas" />
      </div>
      <div>
        <label class="crm-label">Cliente *</label>
        <select v-model="form.clientId" class="crm-input">
          <option value="" disabled>Selecciona…</option>
          <option v-for="c in crm.state.clients" :key="c.id" :value="c.id">{{ c.company }}</option>
        </select>
      </div>
      <div>
        <label class="crm-label">Tipo de servicio</label>
        <select v-model="form.category" class="crm-input">
          <option v-for="s in SERVICE_TYPES" :key="s">{{ s }}</option>
        </select>
      </div>
      <div>
        <label class="crm-label">Monto acordado ({{ crm.state.settings.currency }})</label>
        <input v-model.number="form.budget" type="number" min="0" step="10" class="crm-input font-mono" />
      </div>
      <div>
        <label class="crm-label">Estado</label>
        <select v-model="form.status" class="crm-input">
          <option v-for="(s, key) in PROJECT_STATUS" :key="key" :value="key">{{ s.label }}</option>
        </select>
      </div>
      <div>
        <label class="crm-label">Inicio</label>
        <input v-model="form.startDate" type="date" class="crm-input" />
      </div>
      <div>
        <label class="crm-label">Fecha de entrega</label>
        <input v-model="form.dueDate" type="date" class="crm-input" />
      </div>
      <div class="sm:col-span-2">
        <label class="crm-label">Descripción</label>
        <textarea v-model="form.description" rows="2" class="crm-input resize-none" placeholder="Alcance, accesos, observaciones…"></textarea>
      </div>
      <div v-if="!project" class="sm:col-span-2">
        <label class="crm-label">Hitos iniciales (uno por línea)</label>
        <textarea v-model="milestonesText" rows="3" class="crm-input resize-none"></textarea>
      </div>
      <p v-if="error" class="sm:col-span-2 text-sm text-rose-400">{{ error }}</p>
    </form>
    <template #footer>
      <button class="crm-btn-ghost" @click="emit('close')">Cancelar</button>
      <button class="crm-btn-primary" type="submit" form="project-form">{{ project ? 'Guardar cambios' : 'Crear proyecto' }}</button>
    </template>
  </BaseModal>
</template>
