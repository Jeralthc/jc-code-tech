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
  CheckBadgeIcon,
  FolderIcon,
  ListBulletIcon,
  ArrowUturnLeftIcon,
  CalendarIcon,
  CheckIcon
} from '@heroicons/vue/24/outline';

const emit = defineEmits(['exitCrm']);

// Active Tab: 'projects' | 'clients' | 'builder' | 'quotes' | 'analytics'
const activeTab = ref('projects');

// =========================================================================
// 1. INITIAL SEED DATA (Realistic Projects, Clients, and Quotes)
// =========================================================================

const defaultProjects = [
  {
    id: 'PRJ-001',
    title: 'Calculadora de Costos & Mermas de Recetas',
    clientId: 'cli-001',
    company: 'Restaurante & Comida El Caldero',
    clientName: 'Lic. Andrés Villamizar',
    category: 'Software a Medida (Laravel + Vue)',
    status: 'in_progress', // 'planning' | 'in_progress' | 'review' | 'completed'
    budget: 850,
    startDate: '2026-09-15',
    dueDate: '2026-10-25',
    tasks: [
      { id: 1, text: 'Modelado relacional de insumos y recetas en MySQL', done: true },
      { id: 2, text: 'Algoritmo de cálculo de costos unitarios y mermas en PHP/Laravel', done: true },
      { id: 3, text: 'Interfaz interactiva de simulación de ganancias en Vue 3', done: true },
      { id: 4, text: 'Validación operativa con el chef y gerencia de compras', done: false },
      { id: 5, text: 'Pase a producción y entrega de manual de uso', done: false }
    ]
  },
  {
    id: 'PRJ-002',
    title: 'Plataforma de Facturación Proforma & Remisiones',
    clientId: 'cli-002',
    company: 'LogiSync Distribución & Despachos',
    clientName: 'Ing. Carlos Mendoza',
    category: 'Desarrollo Web Full-Stack',
    status: 'completed',
    budget: 1406,
    startDate: '2026-08-20',
    dueDate: '2026-09-20',
    tasks: [
      { id: 1, text: 'Arquitectura Backend en Laravel 11 y roles de usuario', done: true },
      { id: 2, text: 'Dashboard Frontend en Vue 3 con filtros dinámicos', done: true },
      { id: 3, text: 'Generador de proformas en PDF y enlace a WhatsApp', done: true },
      { id: 4, text: 'Despliegue en servidor en la nube con SSL y respaldos diarios', done: true }
    ]
  },
  {
    id: 'PRJ-003',
    title: 'Instalación de 3 Terminales POS & Red Cableada Cat6',
    clientId: 'cli-003',
    company: 'Bodegón & Minimarket San Cristóbal',
    clientName: 'Marcos Peña',
    category: 'Puntos de Venta (POS) & Redes',
    status: 'planning',
    budget: 680,
    startDate: '2026-10-10',
    dueDate: '2026-10-22',
    tasks: [
      { id: 1, text: 'Inspección de cuartos de red y puntos de energía para cajas', done: true },
      { id: 2, text: 'Tendido de cable estructurado Cat6 certificado para cajas y router', done: false },
      { id: 3, text: 'Instalación de Stellar POS e impresoras térmicas en cajas 1, 2 y 3', done: false },
      { id: 4, text: 'Servidor local MySQL con copia de seguridad en red', done: false }
    ]
  }
];

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
    notes: 'Calculadora de costos de recetas, control de mermas y sincronización operativa.',
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
    notes: 'Plataforma central en Laravel + Vue con exportación de presupuestos y reportes.',
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
    notes: '3 terminales Stellar POS, cableado estructurado Cat6 y servidor MySQL local.',
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

// =========================================================================
// 2. REACTIVE STATE & PERSISTENCE
// =========================================================================

const projects = ref([]);
const clients = ref([]);
const quotes = ref([]);

const loadData = () => {
  try {
    const savedProjects = localStorage.getItem('jc_crm_projects');
    const savedClients = localStorage.getItem('jc_crm_clients');
    const savedQuotes = localStorage.getItem('jc_crm_quotes');

    projects.value = savedProjects ? JSON.parse(savedProjects) : defaultProjects;
    clients.value = savedClients ? JSON.parse(savedClients) : defaultClients;
    quotes.value = savedQuotes ? JSON.parse(savedQuotes) : defaultQuotes;
  } catch (e) {
    console.error('Error cargando datos de CRM:', e);
    projects.value = defaultProjects;
    clients.value = defaultClients;
    quotes.value = defaultQuotes;
  }
};

const saveData = () => {
  try {
    localStorage.setItem('jc_crm_projects', JSON.stringify(projects.value));
    localStorage.setItem('jc_crm_clients', JSON.stringify(clients.value));
    localStorage.setItem('jc_crm_quotes', JSON.stringify(quotes.value));
  } catch (e) {
    console.error('Error guardando en localStorage:', e);
  }
};

const resetToDefaults = () => {
  if (confirm('¿Restablecer datos del CRM a los valores iniciales de demostración?')) {
    projects.value = JSON.parse(JSON.stringify(defaultProjects));
    clients.value = JSON.parse(JSON.stringify(defaultClients));
    quotes.value = JSON.parse(JSON.stringify(defaultQuotes));
    saveData();
    alert('Datos restablecidos exitosamente.');
  }
};

onMounted(() => {
  loadData();
});

watch([projects, clients, quotes], () => {
  saveData();
}, { deep: true });

// =========================================================================
// 3. PROJECTS MANAGEMENT LOGIC
// =========================================================================

const projectFilter = ref('all');
const projectSearch = ref('');

const filteredProjects = computed(() => {
  return projects.value.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(projectSearch.value.toLowerCase()) ||
      p.company.toLowerCase().includes(projectSearch.value.toLowerCase()) ||
      p.id.toLowerCase().includes(projectSearch.value.toLowerCase());
    const matchesStatus = projectFilter.value === 'all' || p.status === projectFilter.value;
    return matchesSearch && matchesStatus;
  });
});

const getProjectProgress = (project) => {
  if (!project.tasks || project.tasks.length === 0) return 0;
  const completed = project.tasks.filter(t => t.done).length;
  return Math.round((completed / project.tasks.length) * 100);
};

const toggleTask = (project, task) => {
  task.done = !task.done;
  if (getProjectProgress(project) === 100) {
    project.status = 'completed';
  } else if (project.status === 'completed' && getProjectProgress(project) < 100) {
    project.status = 'in_progress';
  }
};

const newMilestoneText = ref({});
const addMilestone = (project) => {
  const text = (newMilestoneText.value[project.id] || '').trim();
  if (!text) return;
  const nextId = project.tasks.length ? Math.max(...project.tasks.map(t => t.id)) + 1 : 1;
  project.tasks.push({ id: nextId, text, done: false });
  newMilestoneText.value[project.id] = '';
};

const getProjectStatusBadge = (status) => {
  switch (status) {
    case 'planning':
      return { label: 'En Planificación', class: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
    case 'in_progress':
      return { label: 'En Desarrollo', class: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    case 'review':
      return { label: 'En Pruebas QA', class: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
    case 'completed':
      return { label: 'Completado', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    default:
      return { label: status, class: 'bg-slate-800 text-slate-300 border-slate-700' };
  }
};

// Project Modal State
const showProjectModal = ref(false);
const newProjectForm = ref({
  title: '',
  clientId: '',
  category: 'Desarrollo Web Full-Stack',
  budget: 600,
  dueDate: '',
  initialMilestone: 'Levantamiento de requerimientos inicial'
});

const openNewProjectModal = () => {
  newProjectForm.value = {
    title: '',
    clientId: clients.value[0]?.id || '',
    category: 'Desarrollo Web Full-Stack',
    budget: 600,
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
    initialMilestone: 'Levantamiento de requerimientos y arquitectura'
  };
  showProjectModal.value = true;
};

const saveNewProject = () => {
  if (!newProjectForm.value.title.trim()) {
    alert('Por favor especifica el título del proyecto.');
    return;
  }
  const client = clients.value.find(c => c.id === newProjectForm.value.clientId);
  const newProj = {
    id: 'PRJ-' + (projects.value.length + 1).toString().padStart(3, '0'),
    title: newProjectForm.value.title,
    clientId: newProjectForm.value.clientId,
    company: client ? client.company : 'Cliente Directo',
    clientName: client ? client.name : '',
    category: newProjectForm.value.category,
    status: 'in_progress',
    budget: Number(newProjectForm.value.budget) || 0,
    startDate: new Date().toISOString().slice(0, 10),
    dueDate: newProjectForm.value.dueDate,
    tasks: [
      { id: 1, text: newProjectForm.value.initialMilestone || 'Planificación inicial', done: true },
      { id: 2, text: 'Desarrollo de entregables técnicos principales', done: false },
      { id: 3, text: 'Pruebas y entrega a satisfacción del cliente', done: false }
    ]
  };

  projects.value.unshift(newProj);
  showProjectModal.value = false;
};

const deleteProject = (id) => {
  if (confirm(`¿Eliminar el proyecto ${id}?`)) {
    projects.value = projects.value.filter(p => p.id !== id);
  }
};

// =========================================================================
// 4. CLIENTS CRM LOGIC
// =========================================================================

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

const startQuoteForClient = (client) => {
  quoteForm.value.clientId = client.id;
  quoteForm.value.clientName = client.name;
  quoteForm.value.company = client.company;
  quoteForm.value.phone = client.phone;
  quoteForm.value.id = 'COT-2026-' + (quotes.value.length + 1).toString().padStart(3, '0');
  activeTab.value = 'builder';
};

// =========================================================================
// 5. QUOTES & BUDGET ENGINE LOGIC
// =========================================================================

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

const onClientSelected = () => {
  const selected = clients.value.find(c => c.id === quoteForm.value.clientId);
  if (selected) {
    quoteForm.value.clientName = selected.name;
    quoteForm.value.company = selected.company;
    quoteForm.value.phone = selected.phone;
  }
};

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

  if (quoteData.clientId) {
    const client = clients.value.find(c => c.id === quoteData.clientId);
    if (client && client.status === 'lead') {
      client.status = 'quoting';
    }
  }

  alert(`Presupuesto ${quoteData.id} guardado correctamente en tu historial.`);
  activeTab.value = 'quotes';
};

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

// =========================================================================
// 6. QUOTES LIST & PROFORMA MODAL
// =========================================================================

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
      return { label: 'Cobrado / Liquidado', class: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };
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

const activeProformaQuote = ref(null);
const showProformaModal = ref(false);

const openProforma = (quote) => {
  activeProformaQuote.value = quote;
  showProformaModal.value = true;
};

const triggerPrint = () => {
  window.print();
};

// =========================================================================
// 7. FINANCIAL METRICS & ANALYTICS
// =========================================================================

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

const activeProjectsCount = computed(() => {
  return projects.value.filter(p => p.status !== 'completed').length;
});
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
    
    <!-- Top Application Bar -->
    <header class="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-8 py-3.5 sticky top-0 z-40 backdrop-blur-md">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <!-- Left: Workspace Identity & Breadcrumbs -->
        <div class="flex items-center gap-3">
          <button 
            @click="emit('exitCrm')"
            class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 shadow-sm"
            title="Volver a la vista pública de la Landing Page"
          >
            <ArrowUturnLeftIcon class="w-3.5 h-3.5" />
            <span>Volver a la Web</span>
          </button>

          <div class="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>

          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
              JC
            </div>
            <div>
              <span class="text-xs font-bold text-white block leading-tight">
                JC Studio OS <span class="text-cyan-400 font-mono">v3.0</span>
              </span>
              <span class="text-2xs font-mono text-slate-400 block leading-tight">
                Enterprise Project &amp; Client Suite
              </span>
            </div>
          </div>
        </div>

        <!-- Center: Quick Metric Badges -->
        <div class="hidden lg:flex items-center gap-2 font-mono text-2xs">
          <div class="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span><strong>{{ activeProjectsCount }}</strong> Proyectos Activos</span>
          </div>
          <div class="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
            <span><strong>{{ clients.length }}</strong> Clientes</span>
          </div>
          <div class="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <span><strong>${{ totalApprovedAmount.toFixed(0) }}</strong> USD en Producción</span>
          </div>
        </div>

        <!-- Right: Primary Actions -->
        <div class="flex items-center gap-2">
          <button 
            @click="resetToDefaults"
            class="text-xs font-mono text-slate-400 hover:text-cyan-400 p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
            title="Restablecer datos de muestra"
          >
            <ArrowPathIcon class="w-4 h-4" />
          </button>

          <button
            @click="openNewProjectModal"
            class="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <FolderIcon class="w-3.5 h-3.5 text-cyan-400" />
            <span>+ Proyecto</span>
          </button>

          <button
            @click="openNewClientModal"
            class="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <UserGroupIcon class="w-3.5 h-3.5 text-cyan-400" />
            <span>+ Cliente</span>
          </button>

          <button
            @click="activeTab = 'builder'; resetQuoteForm()"
            class="text-xs font-bold px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <SparklesIcon class="w-3.5 h-3.5" />
            <span>+ Presupuesto</span>
          </button>
        </div>

      </div>
    </header>

    <!-- Main Workspace Body -->
    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- Module Navigation Bar -->
      <div class="flex flex-wrap items-center gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 shadow-lg">
        <button
          @click="activeTab = 'projects'"
          :class="[
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all',
            activeTab === 'projects' 
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          ]"
        >
          <FolderIcon class="w-4 h-4" />
          <span>Proyectos &amp; Entregables ({{ projects.length }})</span>
        </button>

        <button
          @click="activeTab = 'clients'"
          :class="[
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all',
            activeTab === 'clients' 
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          ]"
        >
          <UserGroupIcon class="w-4 h-4" />
          <span>Directorio de Clientes ({{ clients.length }})</span>
        </button>

        <button
          @click="activeTab = 'builder'"
          :class="[
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all',
            activeTab === 'builder' 
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          ]"
        >
          <DocumentTextIcon class="w-4 h-4" />
          <span>Generador de Presupuestos</span>
        </button>

        <button
          @click="activeTab = 'quotes'"
          :class="[
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all',
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
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all',
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
      <!-- TAB 1: GESTIÓN DE PROYECTOS & ENTREGABLES (PROJECTS SUITE) -->
      <!-- ========================================================================= -->
      <div v-if="activeTab === 'projects'" class="space-y-6">
        
        <!-- Filter and Search Header -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div class="relative w-full sm:w-80">
            <MagnifyingGlassIcon class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              v-model="projectSearch"
              placeholder="Buscar por proyecto, empresa o código..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              v-for="st in [
                { key: 'all', label: 'Todos' },
                { key: 'in_progress', label: 'En Desarrollo' },
                { key: 'planning', label: 'Planificación' },
                { key: 'completed', label: 'Completados' }
              ]"
              :key="st.key"
              @click="projectFilter = st.key"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                projectFilter === st.key ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              ]"
            >
              {{ st.label }}
            </button>
          </div>
        </div>

        <!-- Projects Cards Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div 
            v-for="project in filteredProjects" 
            :key="project.id"
            class="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all space-y-5 shadow-xl flex flex-col justify-between"
          >
            <div>
              <!-- Project Top Bar -->
              <div class="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-mono font-bold text-cyan-400">{{ project.id }}</span>
                    <span class="text-2xs font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">{{ project.category }}</span>
                  </div>
                  <h3 class="text-base font-bold text-white tracking-tight">{{ project.title }}</h3>
                  <span class="text-xs text-slate-400 font-mono">{{ project.company }} • {{ project.clientName }}</span>
                </div>

                <div class="text-right">
                  <span 
                    :class="[
                      'text-2xs font-mono px-2.5 py-1 rounded-full border font-semibold inline-block mb-1',
                      getProjectStatusBadge(project.status).class
                    ]"
                  >
                    {{ getProjectStatusBadge(project.status).label }}
                  </span>
                  <div class="text-sm font-extrabold text-white font-mono">${{ project.budget }} USD</div>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="space-y-1.5 pt-2">
                <div class="flex items-center justify-between text-2xs font-mono">
                  <span class="text-slate-400">Avance de Entregables:</span>
                  <span class="text-cyan-400 font-bold">{{ getProjectProgress(project) }}%</span>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div 
                    class="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300" 
                    :style="{ width: getProjectProgress(project) + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Milestones / Task Checklist -->
              <div class="pt-4 space-y-2">
                <span class="text-2xs font-mono uppercase text-slate-400 font-bold block">Hitos &amp; Checklist de Entrega:</span>
                <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <label 
                    v-for="task in project.tasks" 
                    :key="task.id"
                    class="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 cursor-pointer text-xs"
                  >
                    <input 
                      type="checkbox" 
                      :checked="task.done"
                      @change="toggleTask(project, task)"
                      class="rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span :class="task.done ? 'line-through text-slate-400' : 'text-slate-200'">
                      {{ task.text }}
                    </span>
                  </label>
                </div>

                <!-- Add quick milestone -->
                <div class="flex items-center gap-2 pt-2">
                  <input 
                    type="text" 
                    v-model="newMilestoneText[project.id]"
                    @keyup.enter="addMilestone(project)"
                    placeholder="Agregar nuevo hito..."
                    class="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button 
                    @click="addMilestone(project)"
                    class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold"
                  >
                    + Hito
                  </button>
                </div>
              </div>
            </div>

            <!-- Card Bottom Bar: Dates & Actions -->
            <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between text-2xs font-mono text-slate-400">
              <div class="flex items-center gap-2">
                <CalendarIcon class="w-3.5 h-3.5 text-slate-500" />
                <span>Límite: <strong class="text-slate-300">{{ project.dueDate }}</strong></span>
              </div>

              <div class="flex items-center gap-2">
                <select 
                  v-model="project.status"
                  class="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-2xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="planning">Planificación</option>
                  <option value="in_progress">En Desarrollo</option>
                  <option value="review">En Pruebas QA</option>
                  <option value="completed">Completado</option>
                </select>

                <button 
                  @click="deleteProject(project.id)"
                  class="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                  title="Eliminar proyecto"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- ========================================================================= -->
      <!-- TAB 2: DIRECTORIO DE CLIENTES (CRM) -->
      <!-- ========================================================================= -->
      <div v-else-if="activeTab === 'clients'" class="space-y-6">
        
        <!-- Filters Bar -->
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

        <!-- Clients Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="client in filteredClients" 
            :key="client.id"
            class="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-xl"
          >
            <div>
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

              <div class="flex flex-wrap items-center gap-2 mb-3 text-2xs font-mono text-slate-400">
                <span class="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">{{ client.category }}</span>
                <span>• {{ client.city }}</span>
              </div>

              <p class="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                {{ client.notes || 'Sin observaciones registradas.' }}
              </p>

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

            <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                @click="startQuoteForClient(client)"
                class="flex-grow text-xs font-semibold py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-500/30 hover:border-cyan-500 transition-all flex items-center justify-center gap-1.5"
              >
                <DocumentTextIcon class="w-3.5 h-3.5" />
                <span>Presupuesto</span>
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

      </div>

      <!-- ========================================================================= -->
      <!-- TAB 3: GENERADOR DE PRESUPUESTOS (QUOTES BUILDER) -->
      <!-- ========================================================================= -->
      <div v-else-if="activeTab === 'builder'" class="space-y-8">
        
        <!-- Presets -->
        <div class="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2 text-xs text-slate-400">
            <SparklesIcon class="w-4 h-4 text-cyan-400" />
            <span class="font-mono uppercase font-bold text-slate-300">Plantillas Rápidas:</span>
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
          
          <!-- Form (8 cols) -->
          <div class="lg:col-span-8 space-y-6">
            
            <div class="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
              <div class="flex items-center justify-between pb-4 border-b border-slate-800">
                <div class="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
                  <DocumentTextIcon class="w-4 h-4" />
                  <span>Datos del Presupuesto &amp; Receptor</span>
                </div>
                <div class="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold">
                  Folio: {{ quoteForm.id }}
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Cliente Vinculado:</label>
                  <select 
                    v-model="quoteForm.clientId" 
                    @change="onClientSelected"
                    class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">-- Manual / Sin Vincular --</option>
                    <option v-for="c in clients" :key="c.id" :value="c.id">
                      {{ c.company }} ({{ c.name }})
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Empresa / Negocio *:</label>
                  <input 
                    type="text" 
                    v-model="quoteForm.company" 
                    placeholder="Ej. Distribuidora Los Andes C.A."
                    class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label class="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Persona de Contacto:</label>
                  <input 
                    type="text" 
                    v-model="quoteForm.clientName" 
                    placeholder="Ej. Carlos Mendoza (Gerente)"
                    class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label class="block text-xs font-mono text-slate-400 mb-1.5 uppercase">WhatsApp / Teléfono:</label>
                  <input 
                    type="text" 
                    v-model="quoteForm.phone" 
                    placeholder="+58 412 1234567"
                    class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label class="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Categoría:</label>
                  <select 
                    v-model="quoteForm.serviceType"
                    class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Desarrollo Web Full-Stack">Desarrollo Web Full-Stack (Laravel + Vue)</option>
                    <option value="Puntos de Venta (POS) & Redes">Puntos de Venta (POS) &amp; Red LAN</option>
                    <option value="Base de Datos & Optimización">Bases de Datos &amp; Optimización SQL</option>
                    <option value="Póliza Mensual de Soporte Integral">Póliza Mensual de Mantenimiento</option>
                    <option value="Software a Medida & Costos">Software Especializado de Costos</option>
                  </select>
                </div>

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
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Items -->
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

              <div class="space-y-3">
                <div 
                  v-for="(item, idx) in quoteForm.items" 
                  :key="item.id"
                  class="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
                >
                  <div class="flex items-start justify-between gap-3">
                    <span class="text-xs font-mono font-bold text-slate-400 pt-2 w-6">#{{ idx + 1 }}</span>
                    <div class="flex-grow">
                      <label class="block text-2xs font-mono text-slate-400 uppercase mb-1">Descripción del Entregable:</label>
                      <textarea
                        v-model="item.description"
                        rows="2"
                        placeholder="Descripción técnica del trabajo o componente..."
                        class="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
                      ></textarea>
                    </div>
                    <button 
                      @click="removeItem(idx)"
                      class="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-slate-900 transition-colors"
                      title="Eliminar partida"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>

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

            <!-- Conditions -->
            <div class="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div class="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold pb-2 border-b border-slate-800">
                <CheckBadgeIcon class="w-4 h-4" />
                <span>Condiciones Comerciales</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Tiempo Estimado:</label>
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
                <label class="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Garantía / Respaldo:</label>
                <input 
                  type="text" 
                  v-model="quoteForm.notes"
                  placeholder="Ej. Incluye 60 días de soporte continuo post-entrega y capacitación."
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

          </div>

          <!-- Sticky Financial Summary (4 cols) -->
          <div class="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            <div class="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl space-y-6">
              <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                <span class="text-xs font-mono text-cyan-400 uppercase font-bold tracking-wider">RESUMEN FINANCIERO</span>
                <span class="text-2xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">USD ($)</span>
              </div>

              <div class="space-y-3 font-mono text-xs">
                <div class="flex items-center justify-between text-slate-300">
                  <span>Subtotal Bruto:</span>
                  <span class="font-bold">${{ quoteSubtotal.toFixed(2) }}</span>
                </div>

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

                <div class="pt-3 border-t border-slate-700 flex items-baseline justify-between text-white">
                  <span class="text-sm font-bold uppercase tracking-wider font-sans">TOTAL NETO:</span>
                  <div class="text-right">
                    <span class="text-2xl font-extrabold text-cyan-400">${{ quoteTotal.toFixed(2) }}</span>
                    <span class="text-2xs text-slate-400 block font-mono">USD Netos</span>
                  </div>
                </div>
              </div>

              <div class="pt-2">
                <label class="block text-2xs font-mono text-slate-400 uppercase mb-1.5">Estado Inicial:</label>
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

              <div class="space-y-3 pt-2">
                <button
                  @click="saveQuote"
                  class="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon class="w-4 h-4" />
                  <span>Guardar Cotización</span>
                </button>

                <button
                  @click="exportToWhatsApp({ ...quoteForm, subtotal: quoteSubtotal, discountAmount: quoteDiscountAmount, taxAmount: quoteTaxAmount, total: quoteTotal })"
                  class="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  <ShareIcon class="w-4 h-4" />
                  <span>Enviar por WhatsApp</span>
                </button>

                <button
                  @click="openProforma({ ...quoteForm, subtotal: quoteSubtotal, discountAmount: quoteDiscountAmount, taxAmount: quoteTaxAmount, total: quoteTotal })"
                  class="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-2 border border-slate-700"
                >
                  <PrinterIcon class="w-4 h-4 text-cyan-400" />
                  <span>Vista Previa / Imprimir PDF</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      <!-- ========================================================================= -->
      <!-- TAB 4: HISTORIAL DE COTIZACIONES -->
      <!-- ========================================================================= -->
      <div v-else-if="activeTab === 'quotes'" class="space-y-6">
        
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
                      <button
                        @click="openProforma(quote)"
                        class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Ver Proforma Imprimible / PDF"
                      >
                        <EyeIcon class="w-4 h-4 text-cyan-400" />
                      </button>

                      <button
                        @click="exportToWhatsApp(quote)"
                        class="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-400 transition-colors"
                        title="Enviar a WhatsApp"
                      >
                        <ShareIcon class="w-4 h-4" />
                      </button>

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
      <!-- TAB 5: BALANCE FINANCIERO & KPIS -->
      <!-- ========================================================================= -->
      <div v-else-if="activeTab === 'analytics'" class="space-y-8">
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-mono text-slate-400 uppercase">Volumen Cotizado</span>
              <CurrencyDollarIcon class="w-5 h-5 text-cyan-400" />
            </div>
            <div class="text-2xl font-extrabold text-white font-mono">${{ totalQuotedAmount.toFixed(2) }}</div>
            <span class="text-2xs text-slate-400 mt-1 block font-mono">{{ quotes.length }} cotizaciones generadas</span>
          </div>

          <div class="p-6 rounded-3xl bg-slate-900/60 border border-emerald-500/20 shadow-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-mono text-emerald-400 uppercase font-semibold">Cerrado / Cobrado</span>
              <CheckBadgeIcon class="w-5 h-5 text-emerald-400" />
            </div>
            <div class="text-2xl font-extrabold text-emerald-400 font-mono">${{ totalApprovedAmount.toFixed(2) }}</div>
            <span class="text-2xs text-slate-400 mt-1 block font-mono">Proyectos en marcha y liquidados</span>
          </div>

          <div class="p-6 rounded-3xl bg-slate-900/60 border border-amber-500/20 shadow-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-mono text-amber-400 uppercase font-semibold">En Pipeline / Negociación</span>
              <ClockIcon class="w-5 h-5 text-amber-400" />
            </div>
            <div class="text-2xl font-extrabold text-amber-400 font-mono">${{ totalPendingAmount.toFixed(2) }}</div>
            <span class="text-2xs text-slate-400 mt-1 block font-mono">Propuestas en revisión por clientes</span>
          </div>

          <div class="p-6 rounded-3xl bg-slate-900/60 border border-purple-500/20 shadow-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-mono text-purple-400 uppercase font-semibold">Tasa de Conversión</span>
              <ChartBarIcon class="w-5 h-5 text-purple-400" />
            </div>
            <div class="text-2xl font-extrabold text-purple-400 font-mono">{{ conversionRate }}%</div>
            <span class="text-2xs text-slate-400 mt-1 block font-mono">{{ clients.length }} empresas en cartera</span>
          </div>
        </div>

        <div class="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 shadow-xl">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 class="text-lg font-bold text-white">Especialización &amp; Líneas de Ingreso</h3>
              <p class="text-xs text-slate-400">Distribución de demanda por tecnología y tipo de soporte.</p>
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
                <span>Puntos de Venta (POS) &amp; Cableado de Red LAN Cat6</span>
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

    </main>

    <!-- ========================================================================= -->
    <!-- MODAL: CREAR NUEVO PROYECTO -->
    <!-- ========================================================================= -->
    <div 
      v-if="showProjectModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
    >
      <div class="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div class="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
            <FolderIcon class="w-4 h-4" />
            <span>Crear Nuevo Proyecto Técnico</span>
          </div>
          <button @click="showProjectModal = false" class="text-slate-400 hover:text-white">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <div class="space-y-4 text-xs">
          <div>
            <label class="block font-mono text-slate-400 uppercase mb-1">Título del Proyecto *:</label>
            <input 
              type="text" 
              v-model="newProjectForm.title" 
              placeholder="Ej. Sistema de Inventario &amp; Facturación en Red"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-mono text-slate-400 uppercase mb-1">Cliente Vinculado:</label>
              <select 
                v-model="newProjectForm.clientId"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option v-for="c in clients" :key="c.id" :value="c.id">
                  {{ c.company }}
                </option>
              </select>
            </div>

            <div>
              <label class="block font-mono text-slate-400 uppercase mb-1">Categoría Técnica:</label>
              <select 
                v-model="newProjectForm.category"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="Desarrollo Web Full-Stack">Desarrollo Web Full-Stack</option>
                <option value="Puntos de Venta (POS) & Redes">Puntos de Venta (POS) &amp; Redes</option>
                <option value="Software a Medida & Costos">Software a Medida &amp; Costos</option>
                <option value="Auditoría de Base de Datos">Auditoría de Base de Datos</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-mono text-slate-400 uppercase mb-1">Presupuesto ($ USD):</label>
              <input 
                type="number" 
                v-model.number="newProjectForm.budget" 
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label class="block font-mono text-slate-400 uppercase mb-1">Fecha Estimada de Entrega:</label>
              <input 
                type="date" 
                v-model="newProjectForm.dueDate" 
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label class="block font-mono text-slate-400 uppercase mb-1">Primer Hito Técnico:</label>
            <input 
              type="text" 
              v-model="newProjectForm.initialMilestone" 
              placeholder="Ej. Levantamiento de requerimientos y modelado de datos"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button 
            @click="showProjectModal = false"
            class="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
          >
            Cancelar
          </button>
          <button 
            @click="saveNewProject"
            class="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg"
          >
            Crear Proyecto
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL: REGISTRAR CLIENTE -->
    <!-- ========================================================================= -->
    <div 
      v-if="showClientModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
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

        <div id="printable-proforma" class="bg-white text-slate-900 p-8 sm:p-12 rounded-b-3xl shadow-2xl font-sans">
          
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

          <div class="border-t border-slate-200 pt-4 mb-8 text-2xs text-slate-600 space-y-1.5">
            <p><strong>Condiciones de Pago:</strong> {{ activeProformaQuote.paymentTerms }}</p>
            <p><strong>Garantía &amp; Respaldo:</strong> {{ activeProformaQuote.notes }}</p>
            <p class="text-slate-400">Este documento es una cotización técnica formal y no constituye una factura fiscal definitiva hasta el cobro correspondiente.</p>
          </div>

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

  </div>
</template>

<style scoped>
@media print {
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
