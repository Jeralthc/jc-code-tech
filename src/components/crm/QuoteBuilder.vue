<script setup>
import { ref, computed } from 'vue';
import {
  ArrowLeftIcon, PlusIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon, BookOpenIcon, CheckCircleIcon,
  EyeIcon, ChatBubbleOvalLeftEllipsisIcon, ClipboardDocumentIcon, UserPlusIcon
} from '@heroicons/vue/24/outline';
import { useCrm, useUi } from '../../crm/ui';
import { SERVICE_TYPES } from '../../crm/constants';
import { clone, formatDate, addDays, openWhatsApp } from '../../crm/utils';
import { buildQuoteMessage } from '../../crm/quoteText';

const props = defineProps({ quoteId: { type: String, default: null }, clientId: { type: String, default: '' } });
const emit = defineEmits(['close']);
const crm = useCrm();
const ui = useUi();
const s = crm.state;

const existing = props.quoteId ? crm.quote(props.quoteId) : null;
const form = ref(existing ? clone(existing) : crm.newQuoteDraft(props.clientId));
const totals = computed(() => crm.quoteTotals(form.value));
const money = crm.money;
const showCatalog = ref(false);
const error = ref('');
const client = computed(() => crm.client(form.value.clientId));

const nextItemId = () => (form.value.items.length ? Math.max(...form.value.items.map(i => i.id)) + 1 : 1);
const addItem = (svc = null) => {
  const blank = form.value.items.length === 1 && !form.value.items[0].description && !form.value.items[0].unitPrice;
  const item = { id: nextItemId(), description: svc?.description || '', quantity: 1, unitPrice: svc?.price || 0 };
  if (blank && svc) form.value.items = [item]; else form.value.items.push(item);
  if (svc && blank) form.value.serviceType = svc.category;
};
const removeItem = (idx) => {
  if (form.value.items.length === 1) { form.value.items[0] = { id: 1, description: '', quantity: 1, unitPrice: 0 }; return; }
  form.value.items.splice(idx, 1);
};
const moveItem = (idx, dir) => {
  const items = form.value.items;
  const j = idx + dir;
  if (j < 0 || j >= items.length) return;
  [items[idx], items[j]] = [items[j], items[idx]];
};

// Alta rápida de cliente sin salir del editor.
const createClient = () => ui.editClient(null, { stage: 'proposal' }, (c) => { form.value.clientId = c.id; });

const validate = () => {
  if (!form.value.clientId) { error.value = 'Selecciona el cliente de la cotización.'; return false; }
  if (!form.value.items.some(i => i.description.trim())) { error.value = 'Agrega al menos un concepto con descripción.'; return false; }
  error.value = '';
  return true;
};
const save = (silent = false) => {
  if (!validate()) return null;
  form.value.items = form.value.items.filter(i => i.description.trim());
  const saved = crm.saveQuote(form.value);
  form.value = clone(saved);
  if (!silent) ui.toast(`Cotización ${saved.id} guardada`);
  return saved;
};
const saveAndClose = () => { if (save()) emit('close'); };
const preview = () => { const q = save(true); if (q) ui.openProforma(q.id); };
const sendWhatsApp = () => {
  const q = save(true);
  if (!q) return;
  if (!client.value?.phone) { ui.toast('El cliente no tiene teléfono registrado', 'error'); return; }
  openWhatsApp(client.value.phone, buildQuoteMessage(crm, q));
  if (q.status === 'draft') crm.setQuoteStatus(q.id, 'sent');
  form.value.status = crm.quote(q.id).status;
  ui.toast('Cotización marcada como enviada');
};
const copyText = async () => {
  const q = save(true);
  if (!q) return;
  try {
    await navigator.clipboard.writeText(buildQuoteMessage(crm, q));
    ui.toast('Texto copiado: pégalo en WhatsApp, Instagram o correo');
  } catch {
    ui.toast('No se pudo copiar el texto', 'error');
  }
};
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <button class="crm-icon-btn" title="Volver" @click="emit('close')"><ArrowLeftIcon class="w-5 h-5" /></button>
        <div>
          <h1 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{{ form.id ? `Cotización ${form.id}` : 'Nueva cotización' }}</h1>
          <p class="text-sm text-slate-400">{{ client?.company || 'Selecciona un cliente para comenzar' }}</p>
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-12 gap-5 items-start">
      <div class="lg:col-span-8 space-y-5">
        <!-- Datos generales -->
        <section class="crm-card p-5 sm:p-6">
          <h3 class="font-semibold text-white mb-4">Datos generales</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="crm-label">Cliente *</label>
              <div class="flex gap-2">
                <select v-model="form.clientId" class="crm-input">
                  <option value="" disabled>Selecciona un cliente…</option>
                  <option v-for="c in s.clients" :key="c.id" :value="c.id">{{ c.company }}{{ c.name ? ` — ${c.name}` : '' }}</option>
                </select>
                <button class="crm-btn-secondary shrink-0" title="Registrar cliente nuevo" @click="createClient"><UserPlusIcon class="w-4 h-4" /><span class="hidden sm:inline">Nuevo</span></button>
              </div>
            </div>
            <div>
              <label class="crm-label">Tipo de servicio</label>
              <select v-model="form.serviceType" class="crm-input">
                <option v-for="t in SERVICE_TYPES" :key="t">{{ t }}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="crm-label">Fecha</label>
                <input v-model="form.date" type="date" class="crm-input" />
              </div>
              <div>
                <label class="crm-label">Validez (días)</label>
                <input v-model.number="form.validityDays" type="number" min="1" class="crm-input" />
              </div>
            </div>
          </div>
        </section>

        <!-- Conceptos -->
        <section class="crm-card p-5 sm:p-6">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h3 class="font-semibold text-white">Conceptos <span class="text-slate-500 font-normal text-sm">({{ form.items.length }})</span></h3>
            <div class="flex gap-2">
              <button class="crm-btn-secondary !py-2 text-xs" @click="showCatalog = !showCatalog"><BookOpenIcon class="w-4 h-4" />Catálogo</button>
              <button class="crm-btn-secondary !py-2 text-xs" @click="addItem()"><PlusIcon class="w-4 h-4" />Concepto</button>
            </div>
          </div>

          <div v-if="showCatalog" class="mb-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <p class="text-xs text-slate-400 mb-2">Toca un servicio para agregarlo. Edita el catálogo en Ajustes.</p>
            <div class="grid sm:grid-cols-2 gap-2">
              <button v-for="svc in s.settings.catalog" :key="svc.id" class="text-left p-3 rounded-lg border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-colors" @click="addItem(svc)">
                <div class="flex justify-between gap-2"><span class="text-sm font-medium text-white">{{ svc.name }}</span><span class="text-sm font-mono text-cyan-300">{{ money(svc.price) }}</span></div>
                <p class="text-xs text-slate-500 line-clamp-1 mt-0.5">{{ svc.description }}</p>
              </button>
              <p v-if="!s.settings.catalog.length" class="text-sm text-slate-500">Tu catálogo está vacío.</p>
            </div>
          </div>

          <div class="space-y-3">
            <div v-for="(item, idx) in form.items" :key="item.id" class="rounded-xl bg-slate-950/50 border border-slate-800 p-3 sm:p-4">
              <div class="flex gap-3">
                <span class="text-xs font-mono text-slate-500 pt-2.5 w-5">{{ idx + 1 }}</span>
                <textarea v-model="item.description" rows="2" class="crm-input resize-none flex-1" placeholder="Describe el trabajo o producto…"></textarea>
                <div class="flex flex-col">
                  <button class="crm-icon-btn !p-1" :disabled="idx === 0" @click="moveItem(idx, -1)"><ChevronUpIcon class="w-4 h-4" /></button>
                  <button class="crm-icon-btn !p-1" :disabled="idx === form.items.length - 1" @click="moveItem(idx, 1)"><ChevronDownIcon class="w-4 h-4" /></button>
                  <button class="crm-icon-btn !p-1 hover:text-rose-400" title="Quitar" @click="removeItem(idx)"><TrashIcon class="w-4 h-4" /></button>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-3 mt-3 pl-8">
                <div>
                  <label class="text-2xs text-slate-500">Cantidad</label>
                  <input v-model.number="item.quantity" type="number" min="0" step="1" class="crm-input-sm font-mono" />
                </div>
                <div>
                  <label class="text-2xs text-slate-500">Precio unitario</label>
                  <input v-model.number="item.unitPrice" type="number" min="0" step="5" class="crm-input-sm font-mono text-right" />
                </div>
                <div>
                  <label class="text-2xs text-slate-500">Importe</label>
                  <div class="px-2.5 py-1.5 text-xs font-mono font-semibold text-right text-white">{{ money((item.quantity || 0) * (item.unitPrice || 0)) }}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Condiciones -->
        <section class="crm-card p-5 sm:p-6">
          <h3 class="font-semibold text-white mb-4">Condiciones</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="crm-label">Plazo de entrega</label>
              <input v-model="form.deliveryTime" class="crm-input" />
            </div>
            <div>
              <label class="crm-label">Forma de pago</label>
              <input v-model="form.paymentTerms" class="crm-input" />
            </div>
            <div class="sm:col-span-2">
              <label class="crm-label">Garantía / notas</label>
              <textarea v-model="form.notes" rows="2" class="crm-input resize-none"></textarea>
            </div>
          </div>
        </section>
      </div>

      <!-- Resumen -->
      <aside class="lg:col-span-4 lg:sticky lg:top-24">
        <div class="crm-card p-5 sm:p-6 border-cyan-500/25 space-y-4">
          <h3 class="font-semibold text-white">Resumen</h3>
          <div class="space-y-2.5 text-sm">
            <div class="flex justify-between text-slate-300"><span>Subtotal</span><span class="font-mono">{{ money(totals.subtotal) }}</span></div>
            <div class="flex justify-between items-center text-slate-300">
              <span class="flex items-center gap-2">Descuento <input v-model.number="form.discountPercent" type="number" min="0" max="100" class="crm-input-sm !w-16 text-center font-mono" />%</span>
              <span class="font-mono text-emerald-300">-{{ money(totals.discount) }}</span>
            </div>
            <div class="flex justify-between items-center text-slate-300">
              <label class="flex items-center gap-2 cursor-pointer"><input v-model="form.applyTax" type="checkbox" class="accent-cyan-500" />IVA
                <input v-if="form.applyTax" v-model.number="form.taxRate" type="number" min="0" max="100" class="crm-input-sm !w-14 text-center font-mono" />{{ form.applyTax ? '%' : '' }}</label>
              <span class="font-mono">{{ money(totals.tax) }}</span>
            </div>
            <div class="flex justify-between items-baseline pt-3 border-t border-slate-700">
              <span class="font-semibold text-white">Total</span>
              <span class="text-2xl font-extrabold font-mono text-cyan-300">{{ money(totals.total) }}</span>
            </div>
            <p class="text-xs text-slate-500">Válida hasta el {{ formatDate(addDays(form.date, form.validityDays || 15)) }}</p>
          </div>

          <div>
            <label class="crm-label">Estado</label>
            <select v-model="form.status" class="crm-input !py-2">
              <option value="draft">Borrador</option>
              <option value="sent">Enviada</option>
              <option value="approved">Aprobada</option>
              <option value="rejected">Rechazada</option>
            </select>
          </div>

          <p v-if="error" class="text-sm text-rose-400">{{ error }}</p>

          <div class="space-y-2">
            <button class="crm-btn-primary w-full" @click="saveAndClose"><CheckCircleIcon class="w-5 h-5" />Guardar cotización</button>
            <button class="crm-btn-whatsapp w-full" @click="sendWhatsApp"><ChatBubbleOvalLeftEllipsisIcon class="w-5 h-5" />Enviar por WhatsApp</button>
            <div class="grid grid-cols-2 gap-2">
              <button class="crm-btn-secondary text-xs" @click="preview"><EyeIcon class="w-4 h-4" />PDF</button>
              <button class="crm-btn-secondary text-xs" @click="copyText"><ClipboardDocumentIcon class="w-4 h-4" />Copiar texto</button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
