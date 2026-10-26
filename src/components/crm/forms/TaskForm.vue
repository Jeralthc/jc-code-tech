<script setup>
import { ref } from 'vue';
import BaseModal from '../ui/BaseModal.vue';
import { useCrm, useUi } from '../../../crm/ui';
import { TASK_PRIORITY } from '../../../crm/constants';
import { clone, todayISO, addDays } from '../../../crm/utils';

const props = defineProps({ task: { type: Object, default: null }, prefill: { type: Object, default: () => ({}) } });
const emit = defineEmits(['close']);
const crm = useCrm();
const ui = useUi();

const form = ref(props.task ? clone(props.task) : {
  id: '', title: '', clientId: '', dueDate: addDays(todayISO(), 1), priority: 'normal', done: false, ...props.prefill
});
const error = ref('');

const quickDates = [
  { label: 'Hoy', days: 0 },
  { label: 'Mañana', days: 1 },
  { label: 'En 3 días', days: 3 },
  { label: 'En 1 semana', days: 7 }
];

const save = () => {
  if (!form.value.title.trim()) { error.value = 'Describe la tarea.'; return; }
  crm.saveTask(form.value);
  ui.toast(props.task ? 'Tarea actualizada' : 'Tarea agendada');
  emit('close');
};
</script>

<template>
  <BaseModal :title="task ? 'Editar tarea' : 'Nueva tarea'" subtitle="Llamadas, visitas, entregas y seguimientos" size="sm" @close="emit('close')">
    <form id="task-form" class="space-y-4" @submit.prevent="save">
      <div>
        <label class="crm-label">¿Qué hay que hacer? *</label>
        <input v-model="form.title" class="crm-input" placeholder="Ej. Llamar para confirmar la visita" autofocus />
      </div>
      <div>
        <label class="crm-label">Cliente (opcional)</label>
        <select v-model="form.clientId" class="crm-input">
          <option value="">— Sin cliente —</option>
          <option v-for="c in crm.state.clients" :key="c.id" :value="c.id">{{ c.company }}</option>
        </select>
      </div>
      <div>
        <label class="crm-label">Fecha</label>
        <input v-model="form.dueDate" type="date" class="crm-input" />
        <div class="flex flex-wrap gap-1.5 mt-2">
          <button v-for="q in quickDates" :key="q.label" type="button" class="crm-chip" @click="form.dueDate = addDays(todayISO(), q.days)">{{ q.label }}</button>
        </div>
      </div>
      <div>
        <label class="crm-label">Prioridad</label>
        <div class="flex gap-2">
          <button
            v-for="(p, key) in TASK_PRIORITY" :key="key" type="button"
            :class="['crm-chip flex-1', form.priority === key && 'crm-chip-active']"
            @click="form.priority = key"
          >{{ p.label }}</button>
        </div>
      </div>
      <p v-if="error" class="text-sm text-rose-400">{{ error }}</p>
    </form>
    <template #footer>
      <button class="crm-btn-ghost" @click="emit('close')">Cancelar</button>
      <button class="crm-btn-primary" type="submit" form="task-form">Guardar tarea</button>
    </template>
  </BaseModal>
</template>
