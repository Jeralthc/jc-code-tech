<script setup>
import { ref, computed } from 'vue';
import { PlusIcon, TrashIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, ArrowPathIcon, KeyIcon, CloudIcon } from '@heroicons/vue/24/outline';
import { useCrm, useUi } from '../../../crm/ui';
import { SERVICE_TYPES } from '../../../crm/constants';
import { downloadFile, todayISO } from '../../../crm/utils';
import { updatePassword } from '../../../crm/auth';

const props = defineProps({ userEmail: { type: String, default: '' } });
const crm = useCrm();
const ui = useUi();
// computed: al restaurar un respaldo, settings se reemplaza por un objeto nuevo.
const st = computed(() => crm.state.settings);

const newService = ref({ name: '', description: '', price: 0, category: SERVICE_TYPES[0] });
const addService = () => {
  if (!newService.value.name.trim()) return;
  st.value.catalog.push({ ...newService.value, id: 'svc-' + Date.now().toString(36), price: Number(newService.value.price) || 0 });
  newService.value = { name: '', description: '', price: 0, category: SERVICE_TYPES[0] };
  ui.toast('Servicio agregado al catálogo');
};
const removeService = (id) => { st.value.catalog = st.value.catalog.filter(x => x.id !== id); };

const exportBackup = () => {
  downloadFile(`respaldo-crm-${crm.isDemo ? 'demo' : 'privado'}-${todayISO()}.json`, crm.exportData());
  ui.toast('Respaldo descargado');
};
const fileInput = ref(null);
const importBackup = async (e) => {
  const file = e.target.files?.[0];
  e.target.value = '';
  if (!file) return;
  const ok = await ui.confirm({
    title: '¿Restaurar este respaldo?',
    message: `Se reemplazarán TODOS los datos actuales por los del archivo "${file.name}". Te recomendamos descargar un respaldo antes.`,
    confirmLabel: 'Restaurar', danger: true
  });
  if (!ok) return;
  try {
    crm.importData(await file.text());
    ui.toast('Respaldo restaurado correctamente');
  } catch (err) {
    ui.toast(err.message || 'No se pudo leer el archivo', 'error');
  }
};
const resetDemo = async () => {
  if (await ui.confirm({ title: '¿Restablecer la demo?', message: 'Se cargarán de nuevo los datos de ejemplo.', confirmLabel: 'Restablecer' })) {
    crm.resetDemo();
    ui.toast('Demo restablecida');
  }
};
const wipe = async () => {
  const ok = await ui.confirm({
    title: '¿Borrar todos los datos?',
    message: 'Se eliminarán clientes, cotizaciones, proyectos, cobros, tareas e historial. Tu perfil y catálogo se conservan. Esta acción no se puede deshacer.',
    confirmLabel: 'Borrar todo', danger: true, requireText: 'BORRAR'
  });
  if (ok) { crm.wipe(); ui.toast('Datos borrados'); }
};

const pass1 = ref('');
const pass2 = ref('');
const passMsg = ref('');
const savingPass = ref(false);
const changePassword = async () => {
  passMsg.value = '';
  if (pass1.value.length < 8) { passMsg.value = 'Usa al menos 8 caracteres.'; return; }
  if (pass1.value !== pass2.value) { passMsg.value = 'Las contraseñas no coinciden.'; return; }
  savingPass.value = true;
  try {
    await updatePassword(pass1.value);
    pass1.value = pass2.value = '';
    ui.toast('Contraseña actualizada');
  } catch (e) {
    passMsg.value = e.message;
  } finally {
    savingPass.value = false;
  }
};
</script>

<template>
  <div class="space-y-5 max-w-4xl">
    <div>
      <h1 class="text-2xl font-extrabold text-white tracking-tight">Ajustes</h1>
      <p class="text-sm text-slate-400 mt-1">Estos datos aparecen en tus cotizaciones y mensajes</p>
    </div>

    <!-- Perfil -->
    <section class="crm-card p-5 sm:p-6">
      <h3 class="font-semibold text-white mb-4">Perfil del negocio</h3>
      <div class="grid sm:grid-cols-2 gap-4">
        <div><label class="crm-label">Nombre del negocio</label><input v-model="st.businessName" class="crm-input" /></div>
        <div><label class="crm-label">Eslogan / especialidad</label><input v-model="st.tagline" class="crm-input" /></div>
        <div><label class="crm-label">Tu nombre</label><input v-model="st.ownerName" class="crm-input" /></div>
        <div><label class="crm-label">Cargo</label><input v-model="st.ownerRole" class="crm-input" /></div>
        <div><label class="crm-label">Teléfono / WhatsApp</label><input v-model="st.phone" class="crm-input" /></div>
        <div><label class="crm-label">Correo</label><input v-model="st.email" class="crm-input" /></div>
        <div><label class="crm-label">Ciudad</label><input v-model="st.city" class="crm-input" /></div>
        <div><label class="crm-label">RIF (opcional)</label><input v-model="st.taxId" class="crm-input" placeholder="J-12345678-9" /></div>
      </div>
    </section>

    <!-- Cotizaciones -->
    <section class="crm-card p-5 sm:p-6">
      <h3 class="font-semibold text-white mb-4">Cotizaciones y metas</h3>
      <div class="grid sm:grid-cols-3 gap-4">
        <div>
          <label class="crm-label">Moneda</label>
          <select v-model="st.currency" class="crm-input">
            <option value="USD">USD — Dólar</option>
            <option value="EUR">EUR — Euro</option>
            <option value="VES">VES — Bolívar</option>
            <option value="COP">COP — Peso colombiano</option>
          </select>
        </div>
        <div><label class="crm-label">IVA por defecto (%)</label><input v-model.number="st.taxRate" type="number" min="0" max="100" class="crm-input" /></div>
        <div><label class="crm-label">Prefijo de numeración</label><input v-model="st.quotePrefix" class="crm-input font-mono uppercase" maxlength="6" /></div>
        <div><label class="crm-label">Validez por defecto (días)</label><input v-model.number="st.defaultValidity" type="number" min="1" class="crm-input" /></div>
        <div><label class="crm-label">Plazo de entrega por defecto</label><input v-model="st.defaultDelivery" class="crm-input" /></div>
        <div><label class="crm-label">Meta de cobro mensual</label><input v-model.number="st.monthlyGoal" type="number" min="0" step="100" class="crm-input font-mono" /></div>
        <div class="sm:col-span-3"><label class="crm-label">Forma de pago por defecto</label><input v-model="st.defaultPaymentTerms" class="crm-input" /></div>
        <div class="sm:col-span-3"><label class="crm-label">Garantía / notas por defecto</label><textarea v-model="st.defaultNotes" rows="2" class="crm-input resize-none"></textarea></div>
      </div>
    </section>

    <!-- Catálogo -->
    <section class="crm-card p-5 sm:p-6">
      <h3 class="font-semibold text-white">Catálogo de servicios</h3>
      <p class="text-xs text-slate-500 mt-1 mb-4">Agrégalos a una cotización con un toque. Los cambios de precio no afectan cotizaciones ya creadas.</p>
      <div class="space-y-2">
        <div v-for="svc in st.catalog" :key="svc.id" class="grid grid-cols-12 gap-2 items-start p-3 rounded-xl bg-slate-950/50 border border-slate-800">
          <input v-model="svc.name" class="crm-input-sm col-span-12 sm:col-span-4 font-semibold" />
          <input v-model.number="svc.price" type="number" min="0" class="crm-input-sm col-span-5 sm:col-span-2 font-mono text-right" />
          <select v-model="svc.category" class="crm-input-sm col-span-6 sm:col-span-5"><option v-for="t in SERVICE_TYPES" :key="t">{{ t }}</option></select>
          <button class="crm-icon-btn !p-1.5 col-span-1 hover:text-rose-400" title="Quitar" @click="removeService(svc.id)"><TrashIcon class="w-4 h-4" /></button>
          <textarea v-model="svc.description" rows="1" class="crm-input-sm col-span-12 resize-none text-slate-400"></textarea>
        </div>
      </div>
      <form class="grid grid-cols-12 gap-2 mt-4 p-3 rounded-xl border border-dashed border-slate-700" @submit.prevent="addService">
        <input v-model="newService.name" class="crm-input-sm col-span-12 sm:col-span-4" placeholder="Nombre del servicio" />
        <input v-model.number="newService.price" type="number" min="0" class="crm-input-sm col-span-4 sm:col-span-2 font-mono text-right" placeholder="Precio" />
        <select v-model="newService.category" class="crm-input-sm col-span-8 sm:col-span-4"><option v-for="t in SERVICE_TYPES" :key="t">{{ t }}</option></select>
        <button class="crm-btn-secondary !py-1.5 text-xs col-span-12 sm:col-span-2" type="submit"><PlusIcon class="w-4 h-4" />Agregar</button>
        <input v-model="newService.description" class="crm-input-sm col-span-12" placeholder="Descripción que aparecerá en la cotización" />
      </form>
    </section>

    <!-- Cuenta -->
    <section v-if="!crm.isDemo" class="crm-card p-5 sm:p-6">
      <h3 class="font-semibold text-white flex items-center gap-2"><CloudIcon class="w-5 h-5 text-cyan-400" />Cuenta y sincronización</h3>
      <p class="text-sm text-slate-400 mt-1">Sesión iniciada como <strong class="text-white">{{ props.userEmail }}</strong>. Tus datos se guardan en la nube (Supabase) y puedes entrar desde cualquier dispositivo.</p>
      <form class="grid sm:grid-cols-3 gap-3 mt-4 items-end" @submit.prevent="changePassword">
        <div><label class="crm-label">Nueva contraseña</label><input v-model="pass1" type="password" autocomplete="new-password" class="crm-input" /></div>
        <div><label class="crm-label">Repetir contraseña</label><input v-model="pass2" type="password" autocomplete="new-password" class="crm-input" /></div>
        <button class="crm-btn-secondary" type="submit" :disabled="savingPass"><KeyIcon class="w-4 h-4" />{{ savingPass ? 'Guardando…' : 'Cambiar contraseña' }}</button>
      </form>
      <p v-if="passMsg" class="text-sm text-rose-400 mt-2">{{ passMsg }}</p>
    </section>

    <!-- Datos -->
    <section class="crm-card p-5 sm:p-6">
      <h3 class="font-semibold text-white">Respaldo de datos</h3>
      <p class="text-sm text-slate-400 mt-1 mb-4">Descarga una copia completa (JSON) o restaura una anterior.</p>
      <div class="flex flex-wrap gap-2">
        <button class="crm-btn-secondary" @click="exportBackup"><ArrowDownTrayIcon class="w-4 h-4" />Descargar respaldo</button>
        <button class="crm-btn-secondary" @click="fileInput.click()"><ArrowUpTrayIcon class="w-4 h-4" />Restaurar respaldo</button>
        <input ref="fileInput" type="file" accept="application/json,.json" class="hidden" @change="importBackup" />
        <button v-if="crm.isDemo" class="crm-btn-secondary" @click="resetDemo"><ArrowPathIcon class="w-4 h-4" />Restablecer demo</button>
        <button class="crm-btn-ghost text-rose-300 hover:!text-rose-200 ml-auto" @click="wipe"><TrashIcon class="w-4 h-4" />Borrar todos los datos</button>
      </div>
    </section>
  </div>
</template>
