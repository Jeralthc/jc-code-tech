<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { PrinterIcon, XMarkIcon, ChatBubbleOvalLeftEllipsisIcon, PencilSquareIcon } from '@heroicons/vue/24/outline';
import { useCrm, useUi } from '../../crm/ui';
import { formatDate, addDays, openWhatsApp, initials } from '../../crm/utils';
import { buildQuoteMessage } from '../../crm/quoteText';

const props = defineProps({ quoteId: { type: String, required: true } });
const emit = defineEmits(['close']);
const crm = useCrm();
const ui = useUi();
const st = computed(() => crm.state.settings);

const q = computed(() => crm.quote(props.quoteId));
const c = computed(() => crm.client(q.value?.clientId));
const t = computed(() => crm.quoteTotals(q.value));
const money = crm.money;

// El documento se imprime solo (sin la interfaz) gracias a la clase printing-doc.
const print = () => {
  const prev = document.title;
  document.title = `${q.value.id} - ${c.value?.company || 'Cotizacion'}`;
  window.print();
  document.title = prev;
};
const send = () => {
  if (!c.value?.phone) { ui.toast('El cliente no tiene teléfono registrado', 'error'); return; }
  openWhatsApp(c.value.phone, buildQuoteMessage(crm, q.value));
  if (q.value.status === 'draft') crm.setQuoteStatus(q.value.id, 'sent');
};
const edit = () => { emit('close'); ui.editQuote(q.value.id); };

const onKey = (e) => { if (e.key === 'Escape') emit('close'); };
onMounted(() => { document.body.classList.add('printing-doc'); document.addEventListener('keydown', onKey); });
onUnmounted(() => { document.body.classList.remove('printing-doc'); document.removeEventListener('keydown', onKey); });
</script>

<template>
  <Teleport to="body">
    <div v-if="q" class="print-overlay fixed inset-0 z-[70] bg-slate-950/85 backdrop-blur-sm overflow-y-auto p-3 sm:p-6">
      <div class="print-chrome max-w-[820px] mx-auto mb-3 flex flex-wrap items-center justify-between gap-2">
        <span class="text-sm text-slate-300 font-mono">{{ q.id }}</span>
        <div class="flex flex-wrap gap-2">
          <button class="crm-btn-secondary !py-2 text-xs" @click="edit"><PencilSquareIcon class="w-4 h-4" />Editar</button>
          <button class="crm-btn-whatsapp !py-2 text-xs" @click="send"><ChatBubbleOvalLeftEllipsisIcon class="w-4 h-4" />WhatsApp</button>
          <button class="crm-btn-primary !py-2 text-xs" @click="print"><PrinterIcon class="w-4 h-4" />Imprimir / Guardar PDF</button>
          <button class="crm-icon-btn" aria-label="Cerrar" @click="emit('close')"><XMarkIcon class="w-5 h-5" /></button>
        </div>
      </div>

      <article class="print-sheet max-w-[820px] mx-auto bg-white text-slate-800 rounded-2xl shadow-2xl p-6 sm:p-12 font-sans">
        <!-- Encabezado -->
        <header class="flex flex-col sm:flex-row justify-between gap-6 pb-6 border-b-2 border-slate-900">
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 rounded-xl bg-slate-900 text-cyan-300 flex items-center justify-center font-mono font-bold text-lg">{{ initials(st.businessName) }}</div>
            <div>
              <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">{{ st.businessName }}</h2>
              <p class="text-sm text-slate-600">{{ st.tagline }}</p>
              <p class="text-xs text-slate-500 mt-1">{{ st.city }}<span v-if="st.taxId"> · RIF {{ st.taxId }}</span></p>
              <p class="text-xs text-slate-500">{{ st.phone }} · {{ st.email }}</p>
            </div>
          </div>
          <div class="sm:text-right">
            <p class="text-xs font-bold tracking-[0.2em] text-cyan-700">COTIZACIÓN</p>
            <p class="text-2xl font-black font-mono text-slate-900">{{ q.id }}</p>
            <p class="text-xs text-slate-600 mt-1">Emisión: {{ formatDate(q.date) }}</p>
            <p class="text-xs text-slate-600">Válida hasta: {{ formatDate(addDays(q.date, q.validityDays || 15)) }}</p>
          </div>
        </header>

        <!-- Cliente -->
        <section class="grid sm:grid-cols-2 gap-4 py-6">
          <div class="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <p class="text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1">Preparado para</p>
            <p class="font-bold text-slate-900">{{ c?.company || '—' }}</p>
            <p v-if="c?.name" class="text-sm text-slate-600">At. {{ c.name }}</p>
            <p class="text-xs text-slate-500 mt-1">{{ [c?.phone, c?.email].filter(Boolean).join(' · ') }}</p>
          </div>
          <div class="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <p class="text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1">Servicio</p>
            <p class="font-bold text-slate-900">{{ q.serviceType }}</p>
            <p v-if="q.deliveryTime" class="text-sm text-slate-600">Plazo: {{ q.deliveryTime }}</p>
            <p class="text-xs text-slate-500 mt-1">Moneda: {{ st.currency }}</p>
          </div>
        </section>

        <!-- Conceptos -->
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-slate-900 text-white text-xs uppercase tracking-wide">
              <th class="py-2.5 px-3 text-left rounded-l-lg w-10">#</th>
              <th class="py-2.5 px-3 text-left">Descripción</th>
              <th class="py-2.5 px-3 text-center w-16">Cant.</th>
              <th class="py-2.5 px-3 text-right w-28">Precio</th>
              <th class="py-2.5 px-3 text-right rounded-r-lg w-28">Importe</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(i, idx) in q.items" :key="i.id" class="border-b border-slate-200 break-inside-avoid">
              <td class="py-3 px-3 text-slate-400 font-mono">{{ idx + 1 }}</td>
              <td class="py-3 px-3 text-slate-800">{{ i.description }}</td>
              <td class="py-3 px-3 text-center font-mono">{{ i.quantity }}</td>
              <td class="py-3 px-3 text-right font-mono">{{ money(i.unitPrice) }}</td>
              <td class="py-3 px-3 text-right font-mono font-semibold text-slate-900">{{ money(i.quantity * i.unitPrice) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Totales -->
        <div class="flex justify-end mt-6">
          <div class="w-full sm:w-72 space-y-2 text-sm">
            <div class="flex justify-between text-slate-600"><span>Subtotal</span><span class="font-mono">{{ money(t.subtotal) }}</span></div>
            <div v-if="t.discount > 0" class="flex justify-between text-emerald-700"><span>Descuento ({{ q.discountPercent }}%)</span><span class="font-mono">-{{ money(t.discount) }}</span></div>
            <div v-if="t.tax > 0" class="flex justify-between text-slate-600"><span>IVA ({{ t.taxRate }}%)</span><span class="font-mono">{{ money(t.tax) }}</span></div>
            <div class="flex justify-between items-baseline pt-3 mt-1 border-t-2 border-slate-900">
              <span class="font-bold text-slate-900">TOTAL</span>
              <span class="text-2xl font-black font-mono text-slate-900">{{ money(t.total) }}</span>
            </div>
          </div>
        </div>

        <!-- Condiciones -->
        <section class="mt-8 grid sm:grid-cols-2 gap-4 text-sm break-inside-avoid">
          <div v-if="q.paymentTerms">
            <p class="text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1">Forma de pago</p>
            <p class="text-slate-700">{{ q.paymentTerms }}</p>
          </div>
          <div v-if="q.notes">
            <p class="text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1">Garantía y notas</p>
            <p class="text-slate-700">{{ q.notes }}</p>
          </div>
        </section>

        <!-- Firmas -->
        <footer class="mt-14 grid grid-cols-2 gap-10 text-center text-sm break-inside-avoid">
          <div>
            <div class="border-b border-slate-400 h-12"></div>
            <p class="font-semibold text-slate-900 mt-2">{{ st.ownerName }}</p>
            <p class="text-xs text-slate-500">{{ st.ownerRole }} · {{ st.businessName }}</p>
          </div>
          <div>
            <div class="border-b border-slate-400 h-12"></div>
            <p class="font-semibold text-slate-900 mt-2">{{ c?.name || c?.company || 'Cliente' }}</p>
            <p class="text-xs text-slate-500">Aprobación del cliente</p>
          </div>
        </footer>
        <p class="text-2xs text-slate-400 text-center mt-10">Este documento es una cotización y no constituye factura fiscal.</p>
      </article>
    </div>
  </Teleport>
</template>
