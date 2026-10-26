<script setup>
import { ref } from 'vue';
import BaseModal from '../ui/BaseModal.vue';
import { useCrm, useUi } from '../../../crm/ui';
import { STAGES, SOURCES, INDUSTRIES } from '../../../crm/constants';
import { clone } from '../../../crm/utils';

const props = defineProps({ client: { type: Object, default: null }, prefill: { type: Object, default: () => ({}) } });
const emit = defineEmits(['close', 'saved']);
const crm = useCrm();
const ui = useUi();

const form = ref(props.client ? clone(props.client) : {
  id: '', company: '', name: '', phone: '', email: '', city: crm.state.settings.city?.split(',')[0] || '',
  industry: INDUSTRIES[0], source: SOURCES[0], stage: 'lead', value: 0, tags: [], notes: '', nextFollowUp: null,
  ...props.prefill
});
const tagsText = ref((form.value.tags || []).join(', '));
const error = ref('');

const save = () => {
  if (!form.value.company.trim() && !form.value.name.trim()) {
    error.value = 'Indica al menos el nombre del negocio o de la persona de contacto.';
    return;
  }
  if (!form.value.company.trim()) form.value.company = form.value.name;
  form.value.tags = tagsText.value.split(',').map(t => t.trim()).filter(Boolean);
  const saved = crm.saveClient(form.value);
  ui.toast(props.client ? 'Cliente actualizado' : 'Cliente registrado');
  emit('saved', saved);
  emit('close');
};
</script>

<template>
  <BaseModal :title="client ? 'Editar cliente' : 'Nuevo cliente'" subtitle="Datos de contacto y oportunidad comercial" @close="emit('close')">
    <form id="client-form" class="grid grid-cols-1 sm:grid-cols-2 gap-4" @submit.prevent="save">
      <div class="sm:col-span-2">
        <label class="crm-label">Negocio o empresa *</label>
        <input v-model="form.company" class="crm-input" placeholder="Ej. Ferretería El Tornillo" autofocus />
      </div>
      <div>
        <label class="crm-label">Persona de contacto</label>
        <input v-model="form.name" class="crm-input" placeholder="Ej. José Mora" />
      </div>
      <div>
        <label class="crm-label">WhatsApp / Teléfono</label>
        <input v-model="form.phone" class="crm-input" placeholder="0414 123 4567" inputmode="tel" />
      </div>
      <div>
        <label class="crm-label">Correo</label>
        <input v-model="form.email" type="email" class="crm-input" placeholder="contacto@negocio.com" />
      </div>
      <div>
        <label class="crm-label">Ciudad</label>
        <input v-model="form.city" class="crm-input" placeholder="Mérida" />
      </div>
      <div>
        <label class="crm-label">Rubro</label>
        <select v-model="form.industry" class="crm-input">
          <option v-for="i in INDUSTRIES" :key="i">{{ i }}</option>
        </select>
      </div>
      <div>
        <label class="crm-label">¿Cómo llegó?</label>
        <select v-model="form.source" class="crm-input">
          <option v-for="s in SOURCES" :key="s">{{ s }}</option>
        </select>
      </div>
      <div>
        <label class="crm-label">Etapa</label>
        <select v-model="form.stage" class="crm-input">
          <option v-for="s in STAGES" :key="s.key" :value="s.key">{{ s.label }}</option>
        </select>
      </div>
      <div>
        <label class="crm-label">Valor estimado ({{ crm.state.settings.currency }})</label>
        <input v-model.number="form.value" type="number" min="0" step="10" class="crm-input font-mono" />
      </div>
      <div>
        <label class="crm-label">Próximo seguimiento</label>
        <input v-model="form.nextFollowUp" type="date" class="crm-input" />
      </div>
      <div>
        <label class="crm-label">Etiquetas (separadas por coma)</label>
        <input v-model="tagsText" class="crm-input" placeholder="POS, Recurrente" />
      </div>
      <div class="sm:col-span-2">
        <label class="crm-label">Notas</label>
        <textarea v-model="form.notes" rows="3" class="crm-input resize-none" placeholder="¿Qué necesita? ¿Presupuesto? ¿Fecha límite?"></textarea>
      </div>
      <p v-if="error" class="sm:col-span-2 text-sm text-rose-400">{{ error }}</p>
    </form>
    <template #footer>
      <button class="crm-btn-ghost" @click="emit('close')">Cancelar</button>
      <button class="crm-btn-primary" type="submit" form="client-form">{{ client ? 'Guardar cambios' : 'Registrar cliente' }}</button>
    </template>
  </BaseModal>
</template>
