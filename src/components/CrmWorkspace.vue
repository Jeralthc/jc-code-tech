<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import {
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  PlusIcon,
  TrashIcon,
  PrinterIcon,
  ShareIcon,
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon,
  BuildingOffice2Icon,
  PhoneIcon,
  EnvelopeIcon,
  SparklesIcon,
  XMarkIcon,
  ArrowPathIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  EyeIcon,
  TagIcon,
  CheckBadgeIcon
} from '@heroicons/vue/24/outline';

// Active Tab: 'clients' | 'builder' | 'quotes' | 'analytics'
const activeTab = ref('builder');

// --- INITIAL SEED DATA ---
const defaultClients = [
  {
    id: 'cli-001',
    name: 'Lic. Andrés Villamizar',
    company: 'Restaurante & Comida El Caldero',
    phone: '+584147723419',
    email: 'gerencia@elcalderofood.com',
    category: 'Gastronomía & POS',
    status: 'in_progress', // 'lead' | 'quoting' | 'in_progress' | 'active' | 'closed'
    city: 'Mérida / San Cristóbal',
    notes: 'Requirió Calculadora de Costos de recetas, control de mermas y enlace con comandas de cocina.',
    createdAt: '2026-09-15'
  },
  {
    id: 'cli-002',
    name: 'Ing. Carlos Mendoza',
    company: 'LogiSync Distribución & Despachos',
    phone: '+584245558912',
    email: 'carlos.mendoza@logisync.net',
    category: 'Logística & Full-Stack',
    status: 'active',
    city: 'Mérida',
    notes: 'Desarrollo de plataforma central en Laravel + Vue con exportación de presupuestos y remisiones.',
    createdAt: '2026-08-20'
  },
  {
    id: 'cli-003',
    name: 'Marcos Peña',
    company: 'Bodegón & Minimarket San Cristóbal',
    phone: '+584128901234',
    email: 'marcos@bodegonsancristobal.ve',
    category: 'Retail & POS',
    status: 'quoting',
    city: 'San Cristóbal',
    notes: 'Cotización para 3 terminales Stellar POS, cableado de red Cat6 y servidor local MySQL.',
    createdAt: '2026-10-02'
  },
  {
    id: 'cli-004',
    name: 'Dra. Valeria Gómez',
    company: 'Centro Clínico de Especialidades',
    phone: '+584163391204',
    email: 'admin@clinicagomez.com',
    category: 'Salud & Sistemas Web',
    status: 'lead',
    city: 'Remoto / Mérida',
    notes: 'Interesada en sistema web de gestión de turnos médicos y recordatorios automatizados.',
    createdAt: '2026-10-10'
  }
];

const defaultQuotes = [
  {
    id: 'COT-2026-001',
    clientId: 'cli-001',
    clientName: 'Lic. Andrés Villamizar',
    company: 'Restaurante & Comida El Caldero',
    phone: '+584147723419',
    date: '2026-09-18',
    validityDays: 15,
    currency: 'USD',
    serviceType: 'Software a Medida & Costos',
    status: 'in_progress', // 'draft' | 'sent' | 'approved' | 'in_progress' | 'paid' | 'cancelled'
    deliveryTime: '12 días hábiles',
    paymentTerms: '50% anticipo al iniciar, 50% contra entrega final en producción',
    notes: 'Incluye módulo de costos por receta, cálculo de mermas e inducción operativa de 4 horas.',
    discountPercent: 0,
    applyTax: false,
    items: [
      { id: 1, description: 'Desarrollo de Motor de Costos & Recetario en Laravel / MySQL', quantity: 1, unitPrice: 500, total: 500 },
      { id: 2, description: 'Interfaz Interactiva de Simulación de Ganancias y Mermas (Vue 3)', quantity: 1, unitPrice: 350, total: 350 }
    ],
    subtotal: 850,
    discountAmount: 0,
    taxAmount: 0,
    total: 850
  },
  {
    id: 'COT-2026-002',
    clientId: 'cli-002',
    clientName: 'Ing. Carlos Mendoza',
    company: 'LogiSync Distribución & Despachos',
    phone: '+584245558912',
    date: '2026-08-25',
    validityDays: 30,
    currency: 'USD',
    serviceType: 'Desarrollo Web Full-Stack',
    status: 'paid',
    deliveryTime: '20 días hábiles',
    paymentTerms: '40% anticipo, 30% hito intermedio, 30% pase a producción',
    notes: 'Sistema de reportes ejecutivos, cotizaciones proforma, gestión de despachos e integración con WhatsApp.',
    discountPercent: 5,
    applyTax: false,
    items: [
      { id: 1, description: 'Arquitectura Backend en Laravel 11 con autenticación por roles y permisos', quantity: 1, unitPrice: 650, total: 650 },
      { id: 2, description: 'Dashboard Frontend Vue 3 + Tailwind CSS con filtros dinámicos', quantity: 1, unitPrice: 550, total: 550 },
      { id: 3, description: 'Módulo de Facturación Proforma y Generador de PDFs Formales', quantity: 1, unitPrice: 280, total: 280 }
    ],
    subtotal: 1480,
    discountAmount: 74,
    taxAmount: 0,
    total: 1406
  },
  {
    id: 'COT-2026-003',
    clientId: 'cli-003',
    clientName: 'Marcos Peña',
    company: 'Bodegón & Minimarket San Cristóbal',
    phone: '+584128901234',
    date: '2026-10-05',
    validityDays: 15,
    currency: 'USD',
    serviceType: 'Puntos de Venta (POS) & Redes',
    status: 'sent',
    deliveryTime: '4 días hábiles',
    paymentTerms: '60% anticipo materiales, 40% al completar puesta en marcha',
    notes: 'Puesta a punto de 3 cajas con lectores Honeywell, cableado Cat6 certificado y servidor de datos.',
    discountPercent: 0,
    applyTax: false,
    items: [
      { id: 1, description: 'Configuración y puesta a punto de 3 Terminales POS y lectoras de código', quantity: 3, unitPrice: 100, total: 300 },
      { id: 2, description: 'Instalación de Cableado Estructurado LAN Cat6 para cajas y router central', quantity: 1, unitPrice: 180, total: 180 },
      { id: 3, description: 'Servidor Local MySQL con copias de seguridad automáticas diarias', quantity: 1, unitPrice: 200, total: 200 }
    ],
    subtotal: 680,
    discountAmount: 0,
    taxAmount: 0,
    total: 680
  }
];

// --- REACTIVE STATE WITH LOCALSTORAGE PERSISTENCE ---
const clients = ref([]);
const quotes = ref([]);

const loadData = () => {
  try {
    const savedClients = localStorage.getItem('jc_crm_clients');
    const savedQuotes = localStorage.getItem('jc_crm_quotes');
    
    clients.value = savedClients ? JSON.parse(savedClients) : defaultClients;
    quotes.value = savedQuotes ? JSON.parse(savedQuotes) : defaultQuotes;
  } catch (e) {
    console.error('Error cargando datos de CRM:', e);
    clients.value = defaultClients;
    quotes.value = defaultQuotes;
  }
};

const saveData = () => {
  try {
    localStorage.setItem('jc_crm_clients', JSON.stringify(clients.value));
    localStorage.setItem('jc_crm_quotes', JSON.stringify(quotes.value));
  } catch (e) {
    console.error('Error guardando en localStorage:', e);
  }
};

const resetToDefaults = () => {
  if (confirm('¿Restablecer datos del CRM a los valores iniciales de demostración?')) {
    clients.value = JSON.parse(JSON.stringify(defaultClients));
    quotes.value = JSON.parse(JSON.stringify(defaultQuotes));
    saveData();
    alert('Datos restablecidos exitosamente.');
  }
};

onMounted(() => {
  loadData();
});

watch([clients, quotes], () => {
  saveData();
}, { deep: true });

// --- CLIENT FILTERS & SEARCH ---
const clientSearch = ref('');
const clientStatusFilter = ref('all');

const filteredClients = computed(() => {
  return clients.value.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(clientSearch.value.toLowerCase()) ||
      c.company.toLowerCase().includes(clientSearch.value.toLowerCase()) ||
      c.phone.toLowerCase().includes(clientSearch.value.toLowerCase());
    
    const matchesStatus = clientStatusFilter.value === 'all' || c.status === clientStatusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

// Client Status Helpers
const getClientStatusBadge = (status) => {
  switch (status) {
    case 'lead':
      return { label: 'Prospecto', class: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
    case 'quoting':
      return { label: 'En Cotización', class: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    case 'in_progress':
      return { label: 'En Desarrollo', class: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
    case 'active':
      return { label: 'Soporte Activo', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    case 'closed':
      return { label: 'Cerrado', class: 'bg-slate-700/30 text-slate-400 border-slate-700' };
    default:
      return { label: status, class: 'bg-slate-800 text-slate-300 border-slate-700' };
  }
};

// --- CLIENT MODAL STATE ---
const showClientModal = ref(false);
const newClientForm = ref({
  id: '',
  name: '',
  company: '',
  phone: '',
  email: '',
  category: 'Desarrollo Web Full-Stack',
  status: 'lead',
  city: 'Mérida',
  notes: ''
});

const openNewClientModal = () => {
  newClientForm.value = {
    id: 'cli-' + Date.now().toString().slice(-4),
    name: '',
    company: '',
    phone: '',
    email: '',
    category: 'Desarrollo Web Full-Stack',
    status: 'lead',
    city: 'Mérida / Remoto',
    notes: ''
  };
  showClientModal.value = true;
};

const saveClient = () => {
  if (!newClientForm.value.name.trim() || !newClientForm.value.company.trim()) {
    alert('Por favor indica al menos el Nombre del contacto y el Nombre de la Empresa o Negocio.');
    return;
  }
  
  clients.value.unshift({
    ...newClientForm.value,
    createdAt: new Date().toISOString().slice(0, 10)
  });
  
  showClientModal.value = false;
};

const deleteClient = (id) => {
  if (confirm('¿Eliminar este cliente de tu directorio?')) {
    clients.value = clients.value.filter(c => c.id !== id);
  }
};

// Quick action: start quote for a specific client
const startQuoteForClient = (client) => {
  quoteForm.value.clientId = client.id;
  quoteForm.value.clientName = client.name;
  quoteForm.value.company = client.company;
  quoteForm.value.phone = client.phone;
  quoteForm.value.id = 'COT-2026-' + (quotes.value.length + 1).toString().padStart(3, '0');
  activeTab.value = 'builder';
};

// --- QUOTE BUILDER STATE ---
const quoteForm = ref({
  id: 'COT-2026-004',
  clientId: '',
  clientName: '',
  company: '',
  phone: '',
  date: new Date().toISOString().slice(0, 10),
  validityDays: 15,
  currency: 'USD',
  serviceType: 'Desarrollo Web Full-Stack',
  status: 'draft',
  deliveryTime: '10 a 15 días hábiles',
  paymentTerms: '50% anticipo al iniciar, 50% contra entrega final en producción',
  notes: 'Incluye garantía técnica de 60 días, capacitación de personal y entrega de documentación técnica.',
  discountPercent: 0,
  applyTax: false,
  items: [
    { id: 1, description: 'Desarrollo de Plataforma Web a Medida (Laravel + Vue 3)', quantity: 1, unitPrice: 650, total: 650 },
    { id: 2, description: 'Integración de Base de Datos Relacional Normalizada y Respaldos', quantity: 1, unitPrice: 250, total: 250 }
  ]
});

// Watch client selector in quote builder
const onClientSelected = () => {
  const selected = clients.value.find(c => c.id === quoteForm.value.clientId);
  if (selected) {
    quoteForm.value.clientName = selected.name;
    quoteForm.value.company = selected.company;
    quoteForm.value.phone = selected.phone;
  }
};

// Item line manipulations
const addItem = () => {
  const nextId = quoteForm.value.items.length ? Math.max(...quoteForm.value.items.map(i => i.id)) + 1 : 1;
  quoteForm.value.items.push({
    id: nextId,
    description: '',
    quantity: 1,
    unitPrice: 0,
    total: 0
  });
};

const removeItem = (index) => {
  if (quoteForm.value.items.length <= 1) {
    alert('El presupuesto debe contener al menos 1 partida técnica.');
    return;
  }
  quoteForm.value.items.splice(index, 1);
};

const updateItemTotal = (item) => {
  item.quantity = Math.max(1, Number(item.quantity) || 1);
  item.unitPrice = Math.max(0, Number(item.unitPrice) || 0);
  item.total = item.quantity * item.unitPrice;
};

// Financial totals computed
const quoteSubtotal = computed(() => {
  return quoteForm.value.items.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);
});

const quoteDiscountAmount = computed(() => {
  const pct = Math.min(100, Math.max(0, Number(quoteForm.value.discountPercent) || 0));
  return (quoteSubtotal.value * pct) / 100;
});

const quoteSubtotalAfterDiscount = computed(() => {
  return quoteSubtotal.value - quoteDiscountAmount.value;
});

const quoteTaxAmount = computed(() => {
  return quoteForm.value.applyTax ? quoteSubtotalAfterDiscount.value * 0.16 : 0;
});

const quoteTotal = computed(() => {
  return quoteSubtotalAfterDiscount.value + quoteTaxAmount.value;
});

// Presets for 1-click line item load
const applyPreset = (presetKey) => {
  if (presetKey === 'fullstack') {
    quoteForm.value.serviceType = 'Desarrollo Web Full-Stack';
    quoteForm.value.deliveryTime = '15 a 20 días hábiles';
    quoteForm.value.items = [
      { id: 1, description: 'Arquitectura Backend en Laravel 11: Base de datos relacional, API REST y Reglas de Negocio', quantity: 1, unitPrice: 600, total: 600 },
      { id: 2, description: 'Frontend Reactivo en Vue 3 + Tailwind CSS: Dashboards, Formularios y Experiencia Fluida', quantity: 1, unitPrice: 500, total: 500 },
      { id: 3, description: 'Despliegue en Servidor en la Nube, Certificados SSL y Pruebas de Carga', quantity: 1, unitPrice: 200, total: 200 }
    ];
  } else if (presetKey === 'pos_network') {
    quoteForm.value.serviceType = 'Puntos de Venta (POS) & Conectividad';
    quoteForm.value.deliveryTime = '3 a 5 días hábiles';
    quoteForm.value.items = [
      { id: 1, description: 'Configuración de Terminales POS (Stellar POS) con impresoras térmicas y lectores', quantity: 2, unitPrice: 120, total: 240 },
      { id: 2, description: 'Cableado Estructurado LAN Cat6 certificado y balanceo de red WiFi para cobros', quantity: 1, unitPrice: 190, total: 190 },
      { id: 3, description: 'Servidor Local de Inventarios con Base de Datos SQL y Backup Diario', quantity: 1, unitPrice: 250, total: 250 }
    ];
  } else if (presetKey === 'monthly_retainer') {
    quoteForm.value.serviceType = 'Póliza Mensual de Soporte Integral';
    quoteForm.value.deliveryTime = 'Servicio Continuo 24/7';
    quoteForm.value.items = [
      { id: 1, description: 'Soporte Preventivo & Correctivo de Terminales POS y Red de Cajas (Mensual)', quantity: 1, unitPrice: 160, total: 160 },
      { id: 2, description: 'Monitoreo de Servidor de Base de Datos, Depuración de Índices y Respaldos Cloud', quantity: 1, unitPrice: 140, total: 140 }
    ];
  } else if (presetKey === 'cost_calculator') {
    quoteForm.value.serviceType = 'Software Especializado de Costos';
    quoteForm.value.deliveryTime = '8 a 10 días hábiles';
    quoteForm.value.items = [
      { id: 1, description: 'Módulo de Gestión de Insumos, Recetas Base y Cálculo de Mermas en Tiempo Real', quantity: 1, unitPrice: 420, total: 420 },
      { id: 2, description: 'Simulador de Márgenes de Ganancia Neta y Reporte de Costos para Gerencia', quantity: 1, unitPrice: 380, total: 380 }
    ];
  }
};

// Save quote to list
const saveQuote = () => {
  if (!quoteForm.value.company.trim()) {
    alert('Por favor especifica el nombre del cliente o empresa.');
    return;
  }
  
  const quoteData = {
    ...quoteForm.value,
    subtotal: quoteSubtotal.value,
    discountAmount: quoteDiscountAmount.value,
    taxAmount: quoteTaxAmount.value,
    total: quoteTotal.value
  };

  const existingIndex = quotes.value.findIndex(q => q.id === quoteData.id);
  if (existingIndex >= 0) {
    quotes.value[existingIndex] = quoteData;
  } else {
    quotes.value.unshift(quoteData);
  }

  // Update client total or status if linked
  if (quoteData.clientId) {
    const client = clients.value.find(c => c.id === quoteData.clientId);
    if (client && client.status === 'lead') {
      client.status = 'quoting';
    }
  }

  alert(`Presupuesto ${quoteData.id} guardado correctamente.`);
  activeTab.value = 'quotes';
};

// New blank quote
const resetQuoteForm = () => {
  quoteForm.value = {
    id: 'COT-2026-' + (quotes.value.length + 1).toString().padStart(3, '0'),
    clientId: '',
    clientName: '',
    company: '',
    phone: '',
    date: new Date().toISOString().slice(0, 10),
    validityDays: 15,
    currency: 'USD',
    serviceType: 'Desarrollo Web Full-Stack',
    status: 'draft',
    deliveryTime: '10 a 15 días hábiles',
    paymentTerms: '50% anticipo al iniciar, 50% contra entrega final en producción',
    notes: 'Incluye garantía técnica de 60 días, capacitación de personal y entrega de documentación técnica.',
    discountPercent: 0,
    applyTax: false,
    items: [
      { id: 1, description: 'Servicio Técnico / Desarrollo de Software Especializado', quantity: 1, unitPrice: 350, total: 350 }
    ]
  };
};

// --- QUOTES LIST & SEARCH ---
const quoteSearch = ref('');
const quoteStatusFilter = ref('all');

const filteredQuotes = computed(() => {
  return quotes.value.filter(q => {
    const matchesSearch = 
      q.id.toLowerCase().includes(quoteSearch.value.toLowerCase()) ||
      q.company.toLowerCase().includes(quoteSearch.value.toLowerCase()) ||
      q.clientName.toLowerCase().includes(quoteSearch.value.toLowerCase());
    
    const matchesStatus = quoteStatusFilter.value === 'all' || q.status === quoteStatusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

const getQuoteStatusBadge = (status) => {
  switch (status) {
    case 'draft':
      return { label: 'Borrador', class: 'bg-slate-700/50 text-slate-300 border-slate-600' };
    case 'sent':
      return { label: 'Enviado', class: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
    case 'approved':
      return { label: 'Aprobado', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    case 'in_progress':
      return { label: 'En Marcha', class: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
    case 'paid':
      return { label: 'Cobrado / Facturado', class: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };
    case 'cancelled':
      return { label: 'Descartado', class: 'bg-red-500/10 text-red-400 border-red-500/30' };
    default:
      return { label: status, class: 'bg-slate-800 text-slate-300 border-slate-700' };
  }
};

const deleteQuote = (id) => {
  if (confirm(`¿Eliminar la cotización ${id}?`)) {
    quotes.value = quotes.value.filter(q => q.id !== id);
  }
};

// --- EXPORT TO WHATSAPP FUNCTION ---
const exportToWhatsApp = (quote) => {
  const targetPhone = quote.phone ? quote.phone.replace(/[^0-9]/g, '') : '584227130583';
  
  let itemsText = '';
  quote.items.forEach((item, index) => {
    itemsText += `${index + 1}. *${item.quantity}x* ${item.description} - _$${item.total.toFixed(2)} USD_%0A`;
  });

  const msg = 
`📋 *PRESUPUESTO TÉCNICO FORMAL*
🏢 *JC Code & Tech* | Consultoría & Soluciones Digitales
📄 *Folio:* ${quote.id}
👤 *Cliente:* ${encodeURIComponent(quote.company)} (${encodeURIComponent(quote.clientName || 'Gerencia')})
📅 *Fecha de Emisión:* ${quote.date} (Vigencia: ${quote.validityDays} días)
🛠️ *Tipo de Servicio:* ${encodeURIComponent(quote.serviceType)}

---------------------------------------------
*DESGLOSE DE PARTIDAS:*
${itemsText}---------------------------------------------
💵 *Subtotal:* $${quote.subtotal.toFixed(2)} USD
${quote.discountAmount > 0 ? `🏷️ *Descuento (${quote.discountPercent}%):* -$${quote.discountAmount.toFixed(2)} USD%0A` : ''}${quote.taxAmount > 0 ? `🏛️ *IVA (16%):* +$${quote.taxAmount.toFixed(2)} USD%0A` : ''}💰 *TOTAL NETO A PAGAR:* *$${quote.total.toFixed(2)} USD*

⏱️ *Plazo de Entrega:* ${encodeURIComponent(quote.deliveryTime)}
💳 *Condiciones de Pago:* ${encodeURIComponent(quote.paymentTerms)}
🔒 *Garantía:* ${encodeURIComponent(quote.notes)}

_Para aprobar esta cotización o coordinar una sesión de trabajo, favor responder a este mensaje._`;

  const url = `https://wa.me/${targetPhone}?text=${msg}`;
  window.open(url, '_blank');
};

// --- PROFORMA MODAL & PRINT ENGINE ---
const activeProformaQuote = ref(null);
const showProformaModal = ref(false);

const openProforma = (quote) => {
  activeProformaQuote.value = quote;
  showProformaModal.value = true;
};

const triggerPrint = () => {
  window.print();
};

// --- ANALYTICS COMPUTED ---
const totalQuotedAmount = computed(() => {
  return quotes.value.reduce((acc, q) => acc + (Number(q.total) || 0), 0);
});

const totalApprovedAmount = computed(() => {
  return quotes.value
    .filter(q => q.status === 'approved' || q.status === 'in_progress' || q.status === 'paid')
    .reduce((acc, q) => acc + (Number(q.total) || 0), 0);
});

const totalPendingAmount = computed(() => {
  return quotes.value
    .filter(q => q.status === 'sent' || q.status === 'draft')
    .reduce((acc, q) => acc + (Number(q.total) || 0), 0);
});

const conversionRate = computed(() => {
  if (!quotes.value.length) return 0;
  const closed = quotes.value.filter(q => q.status === 'approved' || q.status === 'in_progress' || q.status === 'paid').length;
  return Math.round((closed / quotes.value.length) * 100);
});
</script>

<template>
  <section id="crm" class="py-20 bg-slate-950 relative border-t border-slate-800/80">
    <!-- Ambient glow effect -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/5 blur-[140px] pointer-events-none rounded-full"></div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-slate-800/80 gap-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>PORTAL CRM &amp; GESTIÓN DE PRESUPUESTOS // JC STUDIO OS</span>
          </div>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Workstation Comercial &amp; Clientes
          </h2>
          <p class="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
            Herramienta ejecutiva para generar presupuestos proforma, calcular costos en tiempo real, emitir cotizaciones por WhatsApp y administrar tu cartera de clientes.
          </p>
        </div>

        <!-- Top Global Actions -->
        <div class="flex items-center gap-3">
          <button 
            @click="resetToDefaults"
            class="text-xs font-mono text-slate-400 hover:text-cyan-400 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-1.5"
            title="Restablecer datos iniciales de prueba"
          >
            <ArrowPathIcon class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Demo Data</span>
          </button>

          <button
            @click="openNewClientModal"
            class="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center gap-2"
          >
            <PlusIcon class="w-4 h-4 text-cyan-400" />
            <span>Nuevo Cliente</span>
          </button>

          <button
            @click="activeTab = 'builder'; resetQuoteForm()"
            class="text-xs font-bold px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <SparklesIcon class="w-4 h-4" />
            <span>Nuevo Presupuesto</span>
          </button>
        </div>
      </div>

      <!-- Module Navigation Tabs -->
      <div class="flex flex-wrap items-center gap-2 mb-8 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
        <button
          @click="activeTab = 'builder'"
          :class="[
            'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all',
            activeTab === 'builder' 
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          ]"
        >
          <DocumentTextIcon class="w-4 h-4" />
          <span>Generador de Presupuestos</span>
        </button>

        <button
          @click="activeTab = 'clients'"
          :class="[
            'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all',
            activeTab === 'clients' 
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          ]"
        >
          <UserGroupIcon class="w-4 h-4" />
          <span>Directorio de Clientes ({{ clients.length }})</span>
        </button>

        <button
          @click="activeTab = 'quotes'"
          :class="[
            'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all',
            activeTab === 'quotes' 
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          ]"
        >
          <BriefcaseIcon class="w-4 h-4" />
          <span>Historial de Cotizaciones ({{ quotes.length }})</span>
        </button>

        <button
          @click="activeTab = 'analytics'"
          :class="[
            'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all',
            activeTab === 'analytics' 
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          ]"
        >
          <ChartBarIcon class="w-4 h-4" />
          <span>Balance &amp; KPIs</span>
        </button>
      </div>

      <!-- ========================================================================= -->
      <!-- TAB 1: GENERADOR DE PRESUPUESTOS (BUILDER) -->
      <!-- ========================================================================= -->
      <div v-if="activeTab === 'builder'" class="space-y-8">
        
        <!-- Quick Preset Templates Bar -->
        <div class="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2 text-xs text-slate-400">
            <SparklesIcon class="w-4 h-4 text-cyan-400" />
            <span class="font-mono uppercase font-bold text-slate-300">Plantillas Rápidas de Servicio:</span>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button 
              @click="applyPreset('fullstack')"
              class="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30 border border-slate-700 text-slate-300 transition-all"
            >
              💻 Web Full-Stack (Laravel/Vue)
            </button>
            <button 
              @click="applyPreset('pos_network')"
              class="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30 border border-slate-700 text-slate-300 transition-all"
            >
              🏪 Terminales POS + Red LAN
            </button>
            <button 
              @click="applyPreset('monthly_retainer')"
              class="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30 border border-slate-700 text-slate-300 transition-all"
            >
              🛡️ Póliza Soporte Mensual
            </button>
            <button 
              @click="applyPreset('cost_calculator')"
              class="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30 border border-slate-700 text-slate-300 transition-all"
            >
              📊 Calculadora de Costos
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Left: Main Form (8 Cols) -->
          <div class="lg:col-span-8 space-y-6">
            
            <!-- Document Header Box -->
            <div class="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
              <div class="flex items-center justify-between pb-4 border-b border-slate-800">
                <div class="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
                  <DocumentTextIcon class="w-4 h-4" />
                  <span>Datos del Presupuesto &amp; Destinatario</span>
                </div>
                <div class="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold">
                  Folio: {{ quoteForm.id }}
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Select Existing Client -->
                <div>
                  <label class="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Vincular Cliente Registrado:</label>
                  <select 
                    v-model="quoteForm.clientId" 
                    @change="onClientSelected"
                    class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="">-- Cliente Manual / Nuevo --</option>
                    <option v-for="c in clients" :key="c.id" :value="c.id">
                      {{ c.company }} ({{ c.name }})
                    </option>
                  </select>
                </div>

                <!-- Company Name -->
                <div>
                  <label class="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Empresa / Negocio Receptor *:</label>
                  <input 
                    type="text" 
                    v-model="quoteForm.company" 
                    placeholder="Ej. Distribuidora Los Andes C.A."
                    class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <!-- Contact Person -->
                <div>
                  <label class="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Persona de Contacto / Cargo:</label>
                  <input 
                    type="text" 
                    v-model="quoteForm.clientName" 
                    placeholder="Ej. Lic. Carlos Gómez (Gerente)"
                    class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <!-- WhatsApp / Phone -->
                <div>
                  <label class="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Teléfono / WhatsApp de Envío:</label>
                  <input 
                    type="text" 
                    v-model="quoteForm.phone" 
                    placeholder="+58 412 1234567"
                    class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <!-- Service Category -->
                <div>
                  <label class="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Categoría Principal:</label>
                  <select 
                    v-model="quoteForm.serviceType"
                    class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="Desarrollo Web Full-Stack">Desarrollo Web Full-Stack (Laravel + Vue)</option>
                    <option value="Puntos de Venta (POS) & Redes">Puntos de Venta (POS) &amp; Cableado de Red</option>
                    <option value="Base de Datos & Optimización">Bases de Datos Relacionales &amp; Auditoría</option>
                    <option value="Póliza Mensual de Soporte Integral">Póliza Mensual de Mantenimiento</option>
                    <option value="Software a Medida & Costos">Software Especializado de Costos</option>
                  </select>
                </div>

                <!-- Validity & Date -->
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Fecha:</label>
                    <input 
                      type="date" 
                      v-model="quoteForm.date"
                      class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Validez:</label>
                    <select 
                      v-model="quoteForm.validityDays"
                      class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option :value="15">15 Días</option>
                      <option :value="30">30 Días</option>
                      <option :value="60">60 Días</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Dynamic Line Items (Partidas) -->
            <div class="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                <div class="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
                  <TagIcon class="w-4 h-4" />
                  <span>Partidas Técnicas &amp; Entregables ({{ quoteForm.items.length }})</span>
                </div>
                <button
                  @click="addItem"
                  class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all flex items-center gap-1.5"
                >
                  <PlusIcon class="w-3.5 h-3.5" />
                  <span>Agregar Partida</span>
                </button>
              </div>

              <!-- Items Table -->
              <div class="space-y-3">
                <div 
                  v-for="(item, idx) in quoteForm.items" 
                  :key="item.id"
                  class="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
                >
                  <div class="flex items-start justify-between gap-3">
                    <span class="text-xs font-mono font-bold text-slate-400 pt-2 w-6">#{{ idx + 1 }}</span>
                    
                    <!-- Description -->
                    <div class="flex-grow">
                      <label class="block text-2xs font-mono text-slate-400 uppercase mb-1">Descripción del Entregable:</label>
                      <textarea
                        v-model="item.description"
                        rows="2"
                        placeholder="Ej. Configuración de Base de Datos MySQL con índices optimizados y replicación de respaldo."
                        class="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none transition-colors"
                      ></textarea>
                    </div>

                    <!-- Remove Item -->
                    <button 
                      @click="removeItem(idx)"
                      class="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-slate-900 transition-colors"
                      title="Eliminar partida"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>

                  <!-- Quantity & Unit Price & Subtotal -->
                  <div class="grid grid-cols-3 gap-3 pt-1 border-t border-slate-900">
                    <div>
                      <label class="block text-2xs font-mono text-slate-400 uppercase mb-1">Cantidad / Horas:</label>
                      <input 
                        type="number" 
                        min="1"
                        v-model.number="item.quantity"
                        @input="updateItemTotal(item)"
                        class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                    <div>
                      <label class="block text-2xs font-mono text-slate-400 uppercase mb-1">Precio Unit. ($ USD):</label>
                      <input 
                        type="number" 
                        min="0"
                        step="10"
                        v-model.number="item.unitPrice"
                        @input="updateItemTotal(item)"
                        class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono text-right"
                      />
                    </div>
                    <div>
                      <label class="block text-2xs font-mono text-slate-400 uppercase mb-1">Subtotal Item:</label>
                      <div class="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-cyan-400 font-mono font-bold text-right">
                        ${{ (item.quantity * item.unitPrice).toFixed(2) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Delivery & Payment Conditions -->
            <div class="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div class="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold pb-2 border-b border-slate-800">
                <CheckBadgeIcon class="w-4 h-4" />
                <span>Condiciones Comerciales &amp; Garantía</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Tiempo Estimado de Entrega:</label>
                  <input 
                    type="text" 
                    v-model="quoteForm.deliveryTime"
                    placeholder="Ej. 10 a 15 días hábiles"
                    class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label class="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Condiciones de Pago:</label>
                  <input 
                    type="text" 
                    v-model="quoteForm.paymentTerms"
                    placeholder="Ej. 50% anticipo, 50% al entregar"
                    class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Garantía Técnica / Observaciones:</label>
                <input 
                  type="text" 
                  v-model="quoteForm.notes"
                  placeholder="Ej. Incluye 60 días de soporte continuo post-entrega y capacitación."
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

          </div>

          <!-- Right: Summary Card & Action Center (4 Cols Sticky) -->
          <div class="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            <div class="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.6)] space-y-6">
              <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                <span class="text-xs font-mono text-cyan-400 uppercase font-bold tracking-wider">RESUMEN FINANCIERO</span>
                <span class="text-2xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">USD ($)</span>
              </div>

              <!-- Financial Breakdown -->
              <div class="space-y-3 font-mono text-xs">
                <div class="flex items-center justify-between text-slate-300">
                  <span>Subtotal Bruto:</span>
                  <span class="font-bold">${{ quoteSubtotal.toFixed(2) }}</span>
                </div>

                <!-- Discount -->
                <div class="flex items-center justify-between text-slate-300">
                  <div class="flex items-center gap-1.5">
                    <span>Descuento:</span>
                    <input 
                      type="number" 
                      min="0" 
                      max="100" 
                      v-model.number="quoteForm.discountPercent" 
                      class="w-12 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-center text-2xs text-cyan-400"
                    />
                    <span>%</span>
                  </div>
                  <span class="text-emerald-400 font-bold">-${{ quoteDiscountAmount.toFixed(2) }}</span>
                </div>

                <!-- Tax / IVA Toggle -->
                <div class="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-800/80">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      v-model="quoteForm.applyTax" 
                      class="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700 w-3.5 h-3.5"
                    />
                    <span>Aplicar IVA (16%)</span>
                  </label>
                  <span>${{ quoteTaxAmount.toFixed(2) }}</span>
                </div>

                <!-- Total -->
                <div class="pt-3 border-t border-slate-700 flex items-baseline justify-between text-white">
                  <span class="text-sm font-bold uppercase tracking-wider font-sans">TOTAL NETO:</span>
                  <div class="text-right">
                    <span class="text-2xl font-extrabold text-cyan-400">${{ quoteTotal.toFixed(2) }}</span>
                    <span class="text-2xs text-slate-400 block font-mono">USD Netos</span>
                  </div>
                </div>
              </div>

              <!-- Status Selector for Quote -->
              <div class="pt-2">
                <label class="block text-2xs font-mono text-slate-400 uppercase mb-1.5">Estado de la Propuesta:</label>
                <select 
                  v-model="quoteForm.status"
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="draft">Borrador</option>
                  <option value="sent">Enviado al Cliente</option>
                  <option value="approved">Aprobado / Por Iniciar</option>
                  <option value="in_progress">En Marcha / Desarrollo</option>
                  <option value="paid">Cobrado / Liquidado</option>
                </select>
              </div>

              <!-- Main Action Buttons -->
              <div class="space-y-3 pt-2">
                <!-- Save in System -->
                <button
                  @click="saveQuote"
                  class="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon class="w-4 h-4" />
                  <span>Guardar Cotización</span>
                </button>

                <!-- Export to WhatsApp -->
                <button
                  @click="exportToWhatsApp({ ...quoteForm, subtotal: quoteSubtotal, discountAmount: quoteDiscountAmount, taxAmount: quoteTaxAmount, total: quoteTotal })"
                  class="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  <ShareIcon class="w-4 h-4" />
                  <span>Enviar por WhatsApp</span>
                </button>

                <!-- Print Preview / PDF -->
                <button
                  @click="openProforma({ ...quoteForm, subtotal: quoteSubtotal, discountAmount: quoteDiscountAmount, taxAmount: quoteTaxAmount, total: quoteTotal })"
                  class="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-2 border border-slate-700"
                >
                  <PrinterIcon class="w-4 h-4 text-cyan-400" />
                  <span>Vista Previa / Imprimir PDF</span>
                </button>
              </div>

              <div class="text-2xs text-slate-400 text-center leading-relaxed">
                El presupuesto queda sincronizado y disponible para descarga en PDF formal con membrete.
              </div>
            </div>

          </div>
        </div>

      </div>

      <!-- ========================================================================= -->
      <!-- TAB 2: DIRECTORIO DE CLIENTES (CLIENTS CRM) -->
      <!-- ========================================================================= -->
      <div v-else-if="activeTab === 'clients'" class="space-y-6">
        
        <!-- Search and Filters Bar -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div class="relative w-full sm:w-80">
            <MagnifyingGlassIcon class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              v-model="clientSearch"
              placeholder="Buscar por cliente, empresa o teléfono..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              v-for="st in [
                { key: 'all', label: 'Todos' },
                { key: 'lead', label: 'Prospectos' },
                { key: 'quoting', label: 'Cotizando' },
                { key: 'in_progress', label: 'En Marcha' },
                { key: 'active', label: 'Soporte Activo' }
              ]"
              :key="st.key"
              @click="clientStatusFilter = st.key"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                clientStatusFilter === st.key ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              ]"
            >
              {{ st.label }}
            </button>
          </div>
        </div>

        <!-- Client Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="client in filteredClients" 
            :key="client.id"
            class="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              <!-- Header: Avatar & Status -->
              <div class="flex items-start justify-between gap-3 mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
                    {{ client.company.charAt(0) }}
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {{ client.company }}
                    </h3>
                    <span class="text-xs text-slate-400">{{ client.name }}</span>
                  </div>
                </div>

                <span 
                  :class="[
                    'text-2xs font-mono px-2.5 py-1 rounded-full border font-semibold',
                    getClientStatusBadge(client.status).class
                  ]"
                >
                  {{ getClientStatusBadge(client.status).label }}
                </span>
              </div>

              <!-- Category and City -->
              <div class="flex flex-wrap items-center gap-2 mb-3 text-2xs font-mono text-slate-400">
                <span class="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">{{ client.category }}</span>
                <span>• {{ client.city }}</span>
              </div>

              <!-- Notes / Description -->
              <p class="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                {{ client.notes || 'Sin observaciones registradas.' }}
              </p>

              <!-- Contact Info -->
              <div class="space-y-1.5 text-xs text-slate-300 font-mono pt-3 border-t border-slate-800/80 mb-4">
                <div class="flex items-center gap-2">
                  <PhoneIcon class="w-3.5 h-3.5 text-cyan-400" />
                  <a :href="'https://wa.me/' + client.phone.replace(/[^0-9]/g, '')" target="_blank" class="hover:underline text-cyan-400">
                    {{ client.phone }}
                  </a>
                </div>
                <div class="flex items-center gap-2 text-slate-400">
                  <EnvelopeIcon class="w-3.5 h-3.5 text-slate-500" />
                  <span class="truncate">{{ client.email }}</span>
                </div>
              </div>
            </div>

            <!-- Card Footer: Actions -->
            <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                @click="startQuoteForClient(client)"
                class="flex-grow text-xs font-semibold py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-500/30 hover:border-cyan-500 transition-all flex items-center justify-center gap-1.5"
              >
                <DocumentTextIcon class="w-3.5 h-3.5" />
                <span>Generar Presupuesto</span>
              </button>

              <button
                @click="deleteClient(client.id)"
                class="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-950 rounded-xl transition-colors"
                title="Eliminar cliente"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div v-if="filteredClients.length === 0" class="text-center py-16 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
          <UserGroupIcon class="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 class="text-base font-bold text-white mb-1">No se encontraron clientes</h4>
          <p class="text-xs text-slate-400 mb-4">No hay resultados para el término de búsqueda o filtro seleccionado.</p>
          <button @click="openNewClientModal" class="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold">
            Registrar Primer Cliente
          </button>
        </div>

      </div>

      <!-- ========================================================================= -->
      <!-- TAB 3: HISTORIAL DE COTIZACIONES (QUOTES LIST) -->
      <!-- ========================================================================= -->
      <div v-else-if="activeTab === 'quotes'" class="space-y-6">
        
        <!-- Search and Filters Bar -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div class="relative w-full sm:w-80">
            <MagnifyingGlassIcon class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              v-model="quoteSearch"
              placeholder="Buscar por folio COT-..., empresa o cliente..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              v-for="st in [
                { key: 'all', label: 'Todas' },
                { key: 'sent', label: 'Enviadas' },
                { key: 'approved', label: 'Aprobadas' },
                { key: 'in_progress', label: 'En Marcha' },
                { key: 'paid', label: 'Cobradas' }
              ]"
              :key="st.key"
              @click="quoteStatusFilter = st.key"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                quoteStatusFilter === st.key ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              ]"
            >
              {{ st.label }}
            </button>
          </div>
        </div>

        <!-- Quotes Table -->
        <div class="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-950/80 text-2xs uppercase font-mono text-slate-400 border-b border-slate-800">
                <tr>
                  <th class="py-3.5 px-4 font-bold">Folio</th>
                  <th class="py-3.5 px-4 font-bold">Empresa / Cliente</th>
                  <th class="py-3.5 px-4 font-bold">Servicio</th>
                  <th class="py-3.5 px-4 font-bold text-right">Total ($ USD)</th>
                  <th class="py-3.5 px-4 font-bold text-center">Estado</th>
                  <th class="py-3.5 px-4 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60 font-sans">
                <tr 
                  v-for="quote in filteredQuotes" 
                  :key="quote.id"
                  class="hover:bg-slate-800/30 transition-colors"
                >
                  <td class="py-4 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                    {{ quote.id }}
                    <span class="block text-2xs font-normal text-slate-400">{{ quote.date }}</span>
                  </td>
                  <td class="py-4 px-4 whitespace-nowrap">
                    <strong class="text-white block">{{ quote.company }}</strong>
                    <span class="text-slate-400 text-2xs">{{ quote.clientName || 'Sin contacto directo' }}</span>
                  </td>
                  <td class="py-4 px-4 text-xs text-slate-300">
                    {{ quote.serviceType }}
                    <span class="block text-2xs text-slate-400 font-mono">{{ quote.items.length }} partidas</span>
                  </td>
                  <td class="py-4 px-4 text-right font-mono font-extrabold text-white text-sm whitespace-nowrap">
                    ${{ quote.total.toFixed(2) }}
                  </td>
                  <td class="py-4 px-4 text-center whitespace-nowrap">
                    <select
                      v-model="quote.status"
                      :class="[
                        'text-2xs font-mono font-semibold px-2.5 py-1 rounded-full border bg-slate-950 cursor-pointer focus:outline-none',
                        getQuoteStatusBadge(quote.status).class
                      ]"
                    >
                      <option value="draft">Borrador</option>
                      <option value="sent">Enviado</option>
                      <option value="approved">Aprobado</option>
                      <option value="in_progress">En Marcha</option>
                      <option value="paid">Cobrado</option>
                      <option value="cancelled">Descartado</option>
                    </select>
                  </td>
                  <td class="py-4 px-4 text-right whitespace-nowrap">
                    <div class="flex items-center justify-end gap-1.5">
                      <!-- Proforma Preview -->
                      <button
                        @click="openProforma(quote)"
                        class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Ver Proforma Imprimible / PDF"
                      >
                        <EyeIcon class="w-4 h-4 text-cyan-400" />
                      </button>

                      <!-- WhatsApp Share -->
                      <button
                        @click="exportToWhatsApp(quote)"
                        class="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-400 transition-colors"
                        title="Enviar resumen a WhatsApp"
                      >
                        <ShareIcon class="w-4 h-4" />
                      </button>

                      <!-- Delete -->
                      <button
                        @click="deleteQuote(quote.id)"
                        class="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                        title="Eliminar presupuesto"
                      >
                        <TrashIcon class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- ========================================================================= -->
      <!-- TAB 4: BALANCE & KPIS (ANALYTICS) -->
      <!-- ========================================================================= -->
      <div v-else-if="activeTab === 'analytics'" class="space-y-8">
        
        <!-- KPI Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-mono text-slate-400 uppercase">Volumen Cotizado</span>
              <CurrencyDollarIcon class="w-5 h-5 text-cyan-400" />
            </div>
            <div class="text-2xl font-extrabold text-white font-mono">${{ totalQuotedAmount.toFixed(2) }}</div>
            <span class="text-2xs text-slate-400 mt-1 block font-mono">{{ quotes.length }} propuestas emitidas</span>
          </div>

          <div class="p-6 rounded-3xl bg-slate-900/60 border border-emerald-500/20">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-mono text-emerald-400 uppercase font-semibold">Cerrado / Cobrado</span>
              <CheckBadgeIcon class="w-5 h-5 text-emerald-400" />
            </div>
            <div class="text-2xl font-extrabold text-emerald-400 font-mono">${{ totalApprovedAmount.toFixed(2) }}</div>
            <span class="text-2xs text-slate-400 mt-1 block font-mono">En producción y finalizado</span>
          </div>

          <div class="p-6 rounded-3xl bg-slate-900/60 border border-amber-500/20">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-mono text-amber-400 uppercase font-semibold">En Pipeline / Enviadas</span>
              <ClockIcon class="w-5 h-5 text-amber-400" />
            </div>
            <div class="text-2xl font-extrabold text-amber-400 font-mono">${{ totalPendingAmount.toFixed(2) }}</div>
            <span class="text-2xs text-slate-400 mt-1 block font-mono">Pendientes de confirmación</span>
          </div>

          <div class="p-6 rounded-3xl bg-slate-900/60 border border-purple-500/20">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-mono text-purple-400 uppercase font-semibold">Tasa de Conversión</span>
              <ChartBarIcon class="w-5 h-5 text-purple-400" />
            </div>
            <div class="text-2xl font-extrabold text-purple-400 font-mono">{{ conversionRate }}%</div>
            <span class="text-2xs text-slate-400 mt-1 block font-mono">{{ clients.length }} clientes registrados</span>
          </div>
        </div>

        <!-- Breakdown by Service Line -->
        <div class="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 class="text-lg font-bold text-white">Especialización &amp; Demanda de Servicios</h3>
              <p class="text-xs text-slate-400">Distribución de presupuesto y soluciones solicitadas por comercios.</p>
            </div>
            <span class="text-xs font-mono text-cyan-400 uppercase font-bold">100% OPERATIVO</span>
          </div>

          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between text-xs font-mono text-slate-300 mb-1.5">
                <span>Desarrollo Web Full-Stack (Laravel / Vue 3 / MySQL)</span>
                <span class="text-cyan-400 font-bold">55% de Facturación</span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div class="h-full bg-cyan-500 rounded-full" style="width: 55%"></div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between text-xs font-mono text-slate-300 mb-1.5">
                <span>Puntos de Venta (POS) &amp; Cableado de Red LAN</span>
                <span class="text-purple-400 font-bold">25% de Facturación</span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div class="h-full bg-purple-500 rounded-full" style="width: 25%"></div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between text-xs font-mono text-slate-300 mb-1.5">
                <span>Calculadoras de Costos &amp; Módulos a Medida</span>
                <span class="text-emerald-400 font-bold">20% de Facturación</span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div class="h-full bg-emerald-500 rounded-full" style="width: 20%"></div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- ========================================================================= -->
    <!-- MODAL: REGISTRAR NUEVO CLIENTE -->
    <!-- ========================================================================= -->
    <div 
      v-if="showClientModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <div class="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div class="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
            <UserGroupIcon class="w-4 h-4" />
            <span>Registrar Nuevo Cliente / Prospecto</span>
          </div>
          <button @click="showClientModal = false" class="text-slate-400 hover:text-white">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <div class="space-y-4 text-xs">
          <div>
            <label class="block font-mono text-slate-400 uppercase mb-1">Nombre de la Empresa o Negocio *:</label>
            <input 
              type="text" 
              v-model="newClientForm.company" 
              placeholder="Ej. Distribuidora del Centro C.A."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block font-mono text-slate-400 uppercase mb-1">Nombre del Contacto / Responsable *:</label>
            <input 
              type="text" 
              v-model="newClientForm.name" 
              placeholder="Ej. Ing. Fernando Soto"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-mono text-slate-400 uppercase mb-1">Teléfono / WhatsApp:</label>
              <input 
                type="text" 
                v-model="newClientForm.phone" 
                placeholder="+58 414 1234567"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label class="block font-mono text-slate-400 uppercase mb-1">Correo Electrónico:</label>
              <input 
                type="email" 
                v-model="newClientForm.email" 
                placeholder="contacto@empresa.com"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-mono text-slate-400 uppercase mb-1">Categoría / Ramo:</label>
              <select 
                v-model="newClientForm.category"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="Desarrollo Web Full-Stack">Desarrollo Web Full-Stack</option>
                <option value="Retail & POS">Retail &amp; Puntos de Venta (POS)</option>
                <option value="Gastronomía & POS">Gastronomía &amp; Restaurantes</option>
                <option value="Logística & Despachos">Logística &amp; Despachos</option>
                <option value="Infraestructura & Redes">Infraestructura &amp; Redes</option>
              </select>
            </div>
            <div>
              <label class="block font-mono text-slate-400 uppercase mb-1">Estado Inicial:</label>
              <select 
                v-model="newClientForm.status"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="lead">Prospecto</option>
                <option value="quoting">En Cotización</option>
                <option value="in_progress">En Desarrollo</option>
                <option value="active">Soporte Activo</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-mono text-slate-400 uppercase mb-1">Notas Comerciales / Requerimiento:</label>
            <textarea
              v-model="newClientForm.notes"
              rows="2"
              placeholder="Detalles sobre lo que necesita, presupuesto estimado, fecha límite..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500 resize-none"
            ></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button 
            @click="showClientModal = false"
            class="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
          >
            Cancelar
          </button>
          <button 
            @click="saveClient"
            class="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg"
          >
            Guardar en Directorio
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL: VISTA PREVIA FORMAL DE PROFORMA (PRINT & PDF VIEW) -->
    <!-- ========================================================================= -->
    <div 
      v-if="showProformaModal && activeProformaQuote"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
    >
      <div class="w-full max-w-3xl my-8">
        
        <!-- Controls Bar (Hidden during print) -->
        <div class="print-hide flex items-center justify-between bg-slate-900 border border-slate-800 px-6 py-3.5 rounded-t-3xl text-xs">
          <div class="flex items-center gap-2 text-cyan-400 font-mono font-bold">
            <DocumentTextIcon class="w-4 h-4" />
            <span>DOCUMENTO FORMAL DE COTIZACIÓN // {{ activeProformaQuote.id }}</span>
          </div>
          <div class="flex items-center gap-3">
            <button 
              @click="triggerPrint"
              class="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all flex items-center gap-2 shadow-md"
            >
              <PrinterIcon class="w-4 h-4" />
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button 
              @click="showProformaModal = false"
              class="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Formal Printable Sheet (Light corporate background for printing) -->
        <div id="printable-proforma" class="bg-white text-slate-900 p-8 sm:p-12 rounded-b-3xl shadow-2xl font-sans">
          
          <!-- Corporate Header -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-slate-900 pb-6 mb-6 gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="w-6 h-6 rounded bg-slate-950 text-white flex items-center justify-center font-mono font-bold text-xs">JC</span>
                <span class="text-xl font-extrabold tracking-tight text-slate-950">JC CODE &amp; TECH</span>
              </div>
              <p class="text-xs text-slate-600 font-medium">Consultoría de Software Full-Stack &amp; Infraestructura de Redes</p>
              <p class="text-2xs text-slate-500 font-mono mt-1">Mérida / Táchira / Remoto Internacional • Tel: +58 422 7130583</p>
            </div>

            <div class="sm:text-right">
              <span class="text-2xs font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-3 py-1 rounded border border-slate-300 inline-block mb-1">
                PRESUPUESTO PROFORMA
              </span>
              <div class="text-lg font-black font-mono text-slate-950">{{ activeProformaQuote.id }}</div>
              <div class="text-xs text-slate-600 font-mono">Emisión: {{ activeProformaQuote.date }}</div>
              <div class="text-2xs text-slate-500 font-mono">Vigencia: {{ activeProformaQuote.validityDays }} días</div>
            </div>
          </div>

          <!-- Client Info Box -->
          <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span class="text-2xs font-mono text-slate-500 uppercase font-bold block mb-1">CLIENTE / EMPRESA:</span>
              <strong class="text-sm text-slate-950 block">{{ activeProformaQuote.company }}</strong>
              <span class="text-slate-600 block">{{ activeProformaQuote.clientName || 'A la atención de la Gerencia' }}</span>
              <span class="text-slate-500 text-2xs block font-mono">{{ activeProformaQuote.phone }}</span>
            </div>
            <div>
              <span class="text-2xs font-mono text-slate-500 uppercase font-bold block mb-1">DETALLES DEL SERVICIO:</span>
              <strong class="text-slate-950 block">{{ activeProformaQuote.serviceType }}</strong>
              <span class="text-slate-600 text-2xs block">Plazo de entrega: {{ activeProformaQuote.deliveryTime }}</span>
              <span class="text-slate-600 text-2xs block">Moneda: USD (Dólares Americanos)</span>
            </div>
          </div>

          <!-- Items Table -->
          <table class="w-full text-left text-xs mb-6 border-collapse">
            <thead>
              <tr class="border-b-2 border-slate-900 text-2xs font-mono uppercase text-slate-700">
                <th class="py-2.5 px-2">#</th>
                <th class="py-2.5 px-3">Descripción de la Partida Técnica</th>
                <th class="py-2.5 px-2 text-center">Cant.</th>
                <th class="py-2.5 px-3 text-right">P. Unitario</th>
                <th class="py-2.5 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="(item, idx) in activeProformaQuote.items" :key="item.id">
                <td class="py-3 px-2 font-mono text-slate-500">{{ idx + 1 }}</td>
                <td class="py-3 px-3">
                  <strong class="text-slate-900 block">{{ item.description }}</strong>
                </td>
                <td class="py-3 px-2 text-center font-mono font-medium">{{ item.quantity }}</td>
                <td class="py-3 px-3 text-right font-mono">${{ item.unitPrice.toFixed(2) }}</td>
                <td class="py-3 px-3 text-right font-mono font-bold text-slate-950">${{ item.total.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Financial Summary -->
          <div class="flex justify-end mb-8">
            <div class="w-64 space-y-2 text-xs font-mono">
              <div class="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span class="font-bold">${{ activeProformaQuote.subtotal.toFixed(2) }}</span>
              </div>
              <div v-if="activeProformaQuote.discountAmount > 0" class="flex justify-between text-emerald-700">
                <span>Descuento ({{ activeProformaQuote.discountPercent }}%):</span>
                <span>-${{ activeProformaQuote.discountAmount.toFixed(2) }}</span>
              </div>
              <div v-if="activeProformaQuote.taxAmount > 0" class="flex justify-between text-slate-600">
                <span>IVA (16%):</span>
                <span>+${{ activeProformaQuote.taxAmount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm font-bold border-t-2 border-slate-900 pt-2 text-slate-950">
                <span class="uppercase">TOTAL NETO:</span>
                <span class="text-base">${{ activeProformaQuote.total.toFixed(2) }} USD</span>
              </div>
            </div>
          </div>

          <!-- Notes & Terms -->
          <div class="border-t border-slate-200 pt-4 mb-8 text-2xs text-slate-600 space-y-1.5">
            <p><strong>Condiciones de Pago:</strong> {{ activeProformaQuote.paymentTerms }}</p>
            <p><strong>Garantía &amp; Respaldo:</strong> {{ activeProformaQuote.notes }}</p>
            <p class="text-slate-400">Este documento es una cotización técnica formal y no constituye una factura fiscal definitiva hasta el cobro correspondiente.</p>
          </div>

          <!-- Signatures -->
          <div class="grid grid-cols-2 gap-12 pt-8 border-t border-slate-300 text-center text-xs">
            <div>
              <div class="h-12 border-b border-slate-400 mb-2"></div>
              <strong class="block text-slate-900">Jeralth Contreras</strong>
              <span class="text-2xs text-slate-500">JC Code &amp; Tech // Lead Engineer</span>
            </div>
            <div>
              <div class="h-12 border-b border-slate-400 mb-2"></div>
              <strong class="block text-slate-900">{{ activeProformaQuote.clientName || activeProformaQuote.company }}</strong>
              <span class="text-2xs text-slate-500">Aprobación / Firma del Cliente</span>
            </div>
          </div>

        </div>

      </div>
    </div>

  </section>
</template>

<style scoped>
@media print {
  /* Hide all elements on page except the printable proforma */
  body * {
    visibility: hidden;
  }
  #printable-proforma, #printable-proforma * {
    visibility: visible;
  }
  #printable-proforma {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 20mm;
    box-shadow: none;
    border: none;
    background: white !important;
    color: black !important;
  }
  .print-hide {
    display: none !important;
  }
}
</style>
