// Datos iniciales: perfil del negocio, catálogo de servicios y la demo comercial.
// Las fechas de la demo son relativas a hoy para que siempre luzca actual.
import { todayISO, addDays, toISO } from './utils';

export const defaultSettings = () => ({
  businessName: 'JC Code & Tech',
  tagline: 'Desarrollo de Software & Soporte Tecnológico',
  ownerName: 'Jeralth Contreras',
  ownerRole: 'Ingeniero de Software',
  phone: '+58 424 7130583',
  email: 'jeralthc@gmail.com',
  city: 'Mérida, Venezuela',
  taxId: '',
  currency: 'USD',
  taxRate: 16,
  quotePrefix: 'COT',
  defaultValidity: 15,
  defaultDelivery: '10 a 15 días hábiles',
  defaultPaymentTerms: '50% de anticipo para iniciar y 50% contra entrega final.',
  defaultNotes: 'Incluye 60 días de garantía técnica, capacitación al personal y documentación de uso.',
  monthlyGoal: 2000,
  catalog: [
    { id: 'svc-1', name: 'Sistema web a medida', description: 'Desarrollo de plataforma web a medida (Laravel + Vue): base de datos, panel administrativo y roles de usuario.', price: 650, category: 'Desarrollo Web a Medida' },
    { id: 'svc-2', name: 'Landing page profesional', description: 'Página web comercial optimizada para móviles, con formulario de contacto, botón de WhatsApp y SEO básico.', price: 280, category: 'Desarrollo Web a Medida' },
    { id: 'svc-3', name: 'Despliegue y dominio', description: 'Publicación en servidor en la nube, dominio, certificado SSL y respaldos automáticos.', price: 150, category: 'Desarrollo Web a Medida' },
    { id: 'svc-4', name: 'Configuración de caja POS', description: 'Instalación y puesta a punto de terminal POS con impresora térmica y lector de código de barras.', price: 110, category: 'Puntos de Venta (POS) & Redes' },
    { id: 'svc-5', name: 'Cableado de red Cat6', description: 'Cableado estructurado Cat6 certificado para cajas, router y equipos de oficina.', price: 180, category: 'Puntos de Venta (POS) & Redes' },
    { id: 'svc-6', name: 'Servidor local de inventario', description: 'Servidor local con base de datos SQL y copia de seguridad diaria automática.', price: 250, category: 'Base de Datos & Optimización' },
    { id: 'svc-7', name: 'Módulo de costos y recetas', description: 'Costeo de insumos y recetas, cálculo de mermas y simulador de márgenes de ganancia.', price: 420, category: 'Software de Costos & Finanzas' },
    { id: 'svc-8', name: 'Soporte mensual', description: 'Soporte preventivo y correctivo mensual: equipos, red, respaldos y atención prioritaria.', price: 160, category: 'Soporte Mensual' }
  ]
});

export const emptyData = () => ({
  version: 1,
  settings: defaultSettings(),
  seq: { client: 0, quote: 0, project: 0, payment: 0, task: 0, activity: 0 },
  clients: [],
  activities: [],
  quotes: [],
  projects: [],
  payments: [],
  tasks: []
});

export const buildDemoData = () => {
  const t = todayISO();
  const d = (n) => addDays(t, n);
  const data = emptyData();
  data.settings.monthlyGoal = 2000;

  data.clients = [
    { id: 'CLI-001', company: 'Panadería La Espiga Dorada', name: 'Rosa Márquez', phone: '+58 414 000 0101', email: 'rosa@laespiga.demo', city: 'Mérida', industry: 'Gastronomía', source: 'Referido', stage: 'won', value: 1250, tags: ['POS', 'Recurrente'], notes: 'Dos sucursales. Le interesa ampliar a una tercera caja en diciembre.', nextFollowUp: d(3), createdAt: d(-120) },
    { id: 'CLI-002', company: 'Distribuidora Andina C.A.', name: 'Ing. Luis Peñaloza', phone: '+58 424 000 0102', email: 'compras@andina.demo', city: 'Ejido', industry: 'Logística & Distribución', source: 'Sitio web', stage: 'won', value: 1900, tags: ['Web a medida'], notes: 'Portal de pedidos para vendedores en ruta. Muy satisfecho, posible referido.', nextFollowUp: d(10), createdAt: d(-95) },
    { id: 'CLI-003', company: 'Farmacia Santa Elena', name: 'Dra. Carmen Rivas', phone: '+58 416 000 0103', email: 'gerencia@santaelena.demo', city: 'Mérida', industry: 'Salud', source: 'Google', stage: 'negotiation', value: 980, tags: ['POS', 'Inventario'], notes: 'Quiere controlar vencimientos de medicamentos. Pidió descuento por pago de contado.', nextFollowUp: d(0), createdAt: d(-21) },
    { id: 'CLI-004', company: 'Gimnasio Titanes Fit', name: 'Carlos Uzcátegui', phone: '+58 412 000 0104', email: 'carlos@titanes.demo', city: 'El Vigía', industry: 'Servicios profesionales', source: 'Instagram', stage: 'proposal', value: 720, tags: ['Web a medida'], notes: 'Sistema de membresías con recordatorio de pagos por WhatsApp.', nextFollowUp: d(2), createdAt: d(-12) },
    { id: 'CLI-005', company: 'Ferretería El Tornillo', name: 'José Gregorio Mora', phone: '+58 414 000 0105', email: 'ventas@eltornillo.demo', city: 'Tovar', industry: 'Comercio & Retail', source: 'Visita directa', stage: 'contacted', value: 650, tags: ['Redes'], notes: 'Problemas de red: las cajas se desconectan en horas pico.', nextFollowUp: d(-1), createdAt: d(-6) },
    { id: 'CLI-006', company: 'Colegio San Ignacio', name: 'Lcda. Patricia Briceño', phone: '+58 424 000 0106', email: 'direccion@sanignacio.demo', city: 'Mérida', industry: 'Educación', source: 'Referido', stage: 'lead', value: 1500, tags: ['Web a medida'], notes: 'Plataforma de notas y comunicación con representantes. Decisión en enero.', nextFollowUp: d(5), createdAt: d(-3) },
    { id: 'CLI-007', company: 'Restaurante Fogón Andino', name: 'Andrés Albornoz', phone: '+58 416 000 0107', email: 'andres@fogon.demo', city: 'Mérida', industry: 'Gastronomía', source: 'Referido', stage: 'won', value: 800, tags: ['Costos'], notes: 'Usa el módulo de costos de recetas. Renovar soporte mensual.', nextFollowUp: d(14), createdAt: d(-160) },
    { id: 'CLI-008', company: 'Óptica Visión Clara', name: 'Mariela Paredes', phone: '+58 412 000 0108', email: 'info@visionclara.demo', city: 'Mérida', industry: 'Salud', source: 'Instagram', stage: 'lead', value: 450, tags: [], notes: 'Preguntó por una landing page con agenda de citas.', nextFollowUp: d(1), createdAt: d(-1) },
    { id: 'CLI-009', company: 'Autopartes Los Andes', name: 'Ricardo Dávila', phone: '+58 414 000 0109', email: 'ricardo@autopartes.demo', city: 'Lagunillas', industry: 'Comercio & Retail', source: 'Google', stage: 'lost', value: 600, tags: ['POS'], notes: 'Eligió una solución enlatada más económica. Retomar contacto en 6 meses.', nextFollowUp: null, createdAt: d(-70) },
    { id: 'CLI-010', company: 'Clínica Dental Sonríe', name: 'Dr. Héctor Molina', phone: '+58 424 000 0110', email: 'admin@sonrie.demo', city: 'Mérida', industry: 'Salud', source: 'Sitio web', stage: 'proposal', value: 1100, tags: ['Web a medida'], notes: 'Historias clínicas digitales y agenda de citas.', nextFollowUp: d(4), createdAt: d(-9) }
  ];

  data.quotes = [
    { id: 'COT-001', clientId: 'CLI-001', date: d(-118), validityDays: 15, serviceType: 'Puntos de Venta (POS) & Redes', status: 'approved', deliveryTime: '5 días hábiles', paymentTerms: '60% anticipo, 40% al finalizar.', notes: 'Incluye 60 días de garantía.', discountPercent: 0, applyTax: false, taxRate: 16, projectId: 'PRY-001',
      items: [
        { id: 1, description: 'Configuración de terminal POS con impresora térmica y lector', quantity: 4, unitPrice: 110 },
        { id: 2, description: 'Cableado estructurado Cat6 para ambas sucursales', quantity: 2, unitPrice: 180 },
        { id: 3, description: 'Servidor local de inventario con respaldo diario', quantity: 1, unitPrice: 250 }
      ] },
    { id: 'COT-002', clientId: 'CLI-002', date: d(-92), validityDays: 30, serviceType: 'Desarrollo Web a Medida', status: 'approved', deliveryTime: '25 días hábiles', paymentTerms: '40% anticipo, 30% hito intermedio, 30% entrega.', notes: 'Incluye capacitación a 8 vendedores.', discountPercent: 5, applyTax: false, taxRate: 16, projectId: 'PRY-002',
      items: [
        { id: 1, description: 'Portal web de pedidos con roles (vendedor, supervisor, administración)', quantity: 1, unitPrice: 1100 },
        { id: 2, description: 'App web instalable para vendedores en ruta', quantity: 1, unitPrice: 650 },
        { id: 3, description: 'Despliegue, dominio y respaldos automáticos', quantity: 1, unitPrice: 250 }
      ] },
    { id: 'COT-003', clientId: 'CLI-007', date: d(-150), validityDays: 15, serviceType: 'Software de Costos & Finanzas', status: 'approved', deliveryTime: '10 días hábiles', paymentTerms: '50% anticipo, 50% entrega.', notes: 'Incluye inducción de 4 horas al chef y gerencia.', discountPercent: 0, applyTax: false, taxRate: 16, projectId: 'PRY-003',
      items: [
        { id: 1, description: 'Módulo de costos, recetas y mermas', quantity: 1, unitPrice: 420 },
        { id: 2, description: 'Simulador de márgenes y reporte para gerencia', quantity: 1, unitPrice: 380 }
      ] },
    { id: 'COT-004', clientId: 'CLI-003', date: d(-8), validityDays: 15, serviceType: 'Puntos de Venta (POS) & Redes', status: 'sent', deliveryTime: '7 días hábiles', paymentTerms: '50% anticipo, 50% al finalizar.', notes: 'Incluye alertas de vencimiento por lote.', discountPercent: 8, applyTax: false, taxRate: 16, projectId: null,
      items: [
        { id: 1, description: 'Configuración de 2 cajas POS con lector de códigos', quantity: 2, unitPrice: 110 },
        { id: 2, description: 'Módulo de control de lotes y vencimientos', quantity: 1, unitPrice: 520 },
        { id: 3, description: 'Servidor local con respaldo diario', quantity: 1, unitPrice: 250 }
      ] },
    { id: 'COT-005', clientId: 'CLI-004', date: d(-5), validityDays: 15, serviceType: 'Desarrollo Web a Medida', status: 'sent', deliveryTime: '15 días hábiles', paymentTerms: '50% anticipo, 50% contra entrega.', notes: 'Incluye recordatorios automáticos de pago.', discountPercent: 0, applyTax: false, taxRate: 16, projectId: null,
      items: [
        { id: 1, description: 'Sistema de membresías, asistencia y pagos', quantity: 1, unitPrice: 560 },
        { id: 2, description: 'Despliegue y dominio', quantity: 1, unitPrice: 150 }
      ] },
    { id: 'COT-006', clientId: 'CLI-010', date: d(-2), validityDays: 15, serviceType: 'Desarrollo Web a Medida', status: 'draft', deliveryTime: '20 días hábiles', paymentTerms: '50% anticipo, 50% contra entrega.', notes: 'Incluye 60 días de garantía.', discountPercent: 0, applyTax: true, taxRate: 16, projectId: null,
      items: [
        { id: 1, description: 'Historias clínicas digitales con adjuntos', quantity: 1, unitPrice: 700 },
        { id: 2, description: 'Agenda de citas con confirmación por WhatsApp', quantity: 1, unitPrice: 300 },
        { id: 3, description: 'Despliegue, dominio y SSL', quantity: 1, unitPrice: 150 }
      ] },
    { id: 'COT-007', clientId: 'CLI-009', date: d(-60), validityDays: 15, serviceType: 'Puntos de Venta (POS) & Redes', status: 'rejected', deliveryTime: '5 días hábiles', paymentTerms: '50% anticipo, 50% al finalizar.', notes: '', discountPercent: 0, applyTax: false, taxRate: 16, projectId: null,
      items: [{ id: 1, description: 'Configuración de 3 cajas POS', quantity: 3, unitPrice: 110 }, { id: 2, description: 'Cableado Cat6', quantity: 1, unitPrice: 180 }] },
    { id: 'COT-008', clientId: 'CLI-001', date: d(-20), validityDays: 30, serviceType: 'Soporte Mensual', status: 'approved', deliveryTime: 'Servicio continuo', paymentTerms: 'Pago mensual adelantado.', notes: 'Atención prioritaria en menos de 4 horas.', discountPercent: 0, applyTax: false, taxRate: 16, projectId: 'PRY-004',
      items: [{ id: 1, description: 'Soporte mensual (POS, red y respaldos) — 3 meses', quantity: 3, unitPrice: 160 }] }
  ];

  data.projects = [
    { id: 'PRY-001', title: 'Cajas POS y red para 2 sucursales', clientId: 'CLI-001', quoteId: 'COT-001', category: 'Puntos de Venta (POS) & Redes', status: 'completed', budget: 1050, startDate: d(-112), dueDate: d(-100), description: '',
      milestones: [
        { id: 1, text: 'Inspección de ambas sucursales', done: true },
        { id: 2, text: 'Cableado Cat6 y certificación', done: true },
        { id: 3, text: 'Instalación de 4 cajas POS', done: true },
        { id: 4, text: 'Capacitación a cajeros', done: true }
      ] },
    { id: 'PRY-002', title: 'Portal de pedidos para vendedores', clientId: 'CLI-002', quoteId: 'COT-002', category: 'Desarrollo Web a Medida', status: 'in_progress', budget: 1900, startDate: d(-85), dueDate: d(12), description: 'Pedidos en ruta, catálogo con precios por cliente y reportes de ventas.',
      milestones: [
        { id: 1, text: 'Levantamiento de requerimientos', done: true },
        { id: 2, text: 'Base de datos y panel administrativo', done: true },
        { id: 3, text: 'App de vendedores en ruta', done: true },
        { id: 4, text: 'Reportes de ventas y comisiones', done: false },
        { id: 5, text: 'Capacitación y pase a producción', done: false }
      ] },
    { id: 'PRY-003', title: 'Costeo de recetas y mermas', clientId: 'CLI-007', quoteId: 'COT-003', category: 'Software de Costos & Finanzas', status: 'completed', budget: 800, startDate: d(-145), dueDate: d(-130), description: '',
      milestones: [
        { id: 1, text: 'Carga de insumos y recetas base', done: true },
        { id: 2, text: 'Cálculo de mermas y costos por porción', done: true },
        { id: 3, text: 'Simulador de márgenes', done: true }
      ] },
    { id: 'PRY-004', title: 'Soporte mensual — trimestre', clientId: 'CLI-001', quoteId: 'COT-008', category: 'Soporte Mensual', status: 'in_progress', budget: 480, startDate: d(-18), dueDate: d(72), description: 'Visitas preventivas quincenales y atención remota.',
      milestones: [
        { id: 1, text: 'Mes 1: revisión de cajas y respaldos', done: true },
        { id: 2, text: 'Mes 2: mantenimiento preventivo', done: false },
        { id: 3, text: 'Mes 3: informe y renovación', done: false }
      ] },
    { id: 'PRY-006', title: 'Página web y catálogo de productos', clientId: 'CLI-001', quoteId: null, category: 'Desarrollo Web a Medida', status: 'review', budget: 900, startDate: d(-30), dueDate: d(5), description: 'Sitio con catálogo, pedidos por WhatsApp y ubicación de las 2 sucursales.',
      milestones: [
        { id: 1, text: 'Diseño y textos aprobados', done: true },
        { id: 2, text: 'Catálogo con fotos y precios', done: true },
        { id: 3, text: 'Botón de pedidos por WhatsApp', done: true },
        { id: 4, text: 'Publicación y dominio', done: false }
      ] },
    { id: 'PRY-005', title: 'Diagnóstico de red en horas pico', clientId: 'CLI-005', quoteId: null, category: 'Puntos de Venta (POS) & Redes', status: 'planning', budget: 120, startDate: d(1), dueDate: d(4), description: 'Visita técnica pagada previa a la cotización completa.',
      milestones: [
        { id: 1, text: 'Medición de cobertura WiFi y latencia', done: false },
        { id: 2, text: 'Informe con recomendaciones', done: false }
      ] }
  ];

  // Cobros ubicados por mes calendario para que el gráfico muestre una tendencia realista
  // sin importar el día en que se abra la demo.
  const now = new Date();
  const m = (monthsAgo, day) => {
    const dd = monthsAgo === 0 ? Math.min(day, now.getDate()) : Math.min(day, 28);
    return toISO(new Date(now.getFullYear(), now.getMonth() - monthsAgo, dd));
  };
  data.payments = [
    { id: 'PAG-001', clientId: 'CLI-007', projectId: 'PRY-003', amount: 400, date: m(5, 12), method: 'Zelle', reference: 'ZL-2291', note: 'Anticipo 50%' },
    { id: 'PAG-002', clientId: 'CLI-007', projectId: 'PRY-003', amount: 400, date: m(4, 9), method: 'Zelle', reference: 'ZL-2410', note: 'Entrega final' },
    { id: 'PAG-003', clientId: 'CLI-001', projectId: 'PRY-001', amount: 630, date: m(3, 4), method: 'Transferencia', reference: 'TR-88120', note: 'Anticipo 60%' },
    { id: 'PAG-004', clientId: 'CLI-001', projectId: 'PRY-001', amount: 420, date: m(3, 22), method: 'Pago Móvil', reference: 'PM-55102', note: 'Saldo final' },
    { id: 'PAG-005', clientId: 'CLI-002', projectId: 'PRY-002', amount: 760, date: m(2, 6), method: 'Zelle', reference: 'ZL-3011', note: 'Anticipo 40%' },
    { id: 'PAG-008', clientId: 'CLI-007', projectId: null, amount: 160, date: m(1, 8), method: 'Pago Móvil', reference: 'PM-60033', note: 'Soporte puntual' },
    { id: 'PAG-010', clientId: 'CLI-001', projectId: 'PRY-006', amount: 450, date: m(1, 24), method: 'Zelle', reference: 'ZL-3388', note: 'Anticipo 50% web' },
    { id: 'PAG-006', clientId: 'CLI-002', projectId: 'PRY-002', amount: 570, date: m(0, 3), method: 'Binance / USDT', reference: 'BN-77A1', note: 'Hito intermedio' },
    { id: 'PAG-007', clientId: 'CLI-001', projectId: 'PRY-004', amount: 160, date: m(0, 5), method: 'Efectivo USD', reference: '', note: 'Soporte mes 1' },
    { id: 'PAG-011', clientId: 'CLI-007', projectId: null, amount: 160, date: m(0, 10), method: 'Pago Móvil', reference: 'PM-70110', note: 'Soporte mensual' },
    { id: 'PAG-012', clientId: 'CLI-001', projectId: 'PRY-006', amount: 300, date: m(0, 18), method: 'Zelle', reference: 'ZL-3502', note: 'Segundo abono web' },
    { id: 'PAG-009', clientId: 'CLI-005', projectId: 'PRY-005', amount: 60, date: m(0, 25), method: 'Pago Móvil', reference: 'PM-71209', note: 'Anticipo diagnóstico' }
  ];

  data.tasks = [
    { id: 'TAR-001', title: 'Llamar a la Dra. Rivas para cerrar el descuento', clientId: 'CLI-003', dueDate: d(0), priority: 'high', done: false },
    { id: 'TAR-002', title: 'Enviar demo del sistema de membresías', clientId: 'CLI-004', dueDate: d(1), priority: 'normal', done: false },
    { id: 'TAR-003', title: 'Visita técnica: medir red en hora pico', clientId: 'CLI-005', dueDate: d(1), priority: 'high', done: false },
    { id: 'TAR-004', title: 'Preparar presentación para el colegio', clientId: 'CLI-006', dueDate: d(4), priority: 'normal', done: false },
    { id: 'TAR-005', title: 'Cobrar saldo del hito final a Distribuidora Andina', clientId: 'CLI-002', dueDate: d(-2), priority: 'high', done: false },
    { id: 'TAR-006', title: 'Respaldar servidor de La Espiga', clientId: 'CLI-001', dueDate: d(-4), priority: 'low', done: true }
  ];

  data.activities = [
    { id: 'ACT-001', clientId: 'CLI-003', type: 'meeting', text: 'Reunión en la farmacia: revisamos el flujo de caja y vencimientos.', date: d(-9) },
    { id: 'ACT-002', clientId: 'CLI-003', type: 'system', text: 'Cotización COT-004 enviada.', date: d(-8) },
    { id: 'ACT-003', clientId: 'CLI-003', type: 'whatsapp', text: 'Pidió 8% de descuento por pago de contado. Se ajustó la cotización.', date: d(-3) },
    { id: 'ACT-004', clientId: 'CLI-004', type: 'call', text: 'Llamada de descubrimiento: 300 miembros activos, cobran por transferencia.', date: d(-11) },
    { id: 'ACT-005', clientId: 'CLI-004', type: 'system', text: 'Cotización COT-005 enviada.', date: d(-5) },
    { id: 'ACT-006', clientId: 'CLI-005', type: 'whatsapp', text: 'Escribió por la página web. Agendada visita técnica.', date: d(-6) },
    { id: 'ACT-007', clientId: 'CLI-002', type: 'system', text: 'Cobro registrado: $570.00 (hito intermedio).', date: d(-35) },
    { id: 'ACT-008', clientId: 'CLI-006', type: 'note', text: 'Referida por la Panadería La Espiga. Presupuesto aprobado para enero.', date: d(-3) },
    { id: 'ACT-009', clientId: 'CLI-008', type: 'whatsapp', text: 'Consulta por Instagram: landing page con agenda de citas.', date: d(-1) },
    { id: 'ACT-010', clientId: 'CLI-010', type: 'meeting', text: 'Demo del flujo de historias clínicas. Le gustó la agenda.', date: d(-2) },
    { id: 'ACT-011', clientId: 'CLI-001', type: 'note', text: 'Firmó soporte mensual por 3 meses.', date: d(-20) }
  ];

  data.seq = { client: 10, quote: 8, project: 6, payment: 12, task: 6, activity: 11 };
  return data;
};

// IDs de la demo vieja (v3) para no importarlos como datos reales.
export const LEGACY_SEED_IDS = new Set([
  'cli-001', 'cli-002', 'cli-003', 'cli-004',
  'PRJ-001', 'PRJ-002', 'PRJ-003',
  'COT-2026-001', 'COT-2026-002', 'COT-2026-003'
]);
