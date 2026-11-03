// Tasa oficial del BCV (USD → Bs) desde DolarApi, con caché de unas horas en el navegador.
import { reactive } from 'vue';

const CACHE_KEY = 'jc_bcv_rate';
const MAX_AGE = 3 * 60 * 60 * 1000;

export const bcv = reactive({ rate: 0, date: '', loading: false, error: '' });

const readCache = () => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || null; } catch { return null; }
};

export async function loadBcvRate(force = false) {
  const cached = readCache();
  if (cached?.rate) Object.assign(bcv, { rate: cached.rate, date: cached.date });
  if (!force && cached && Date.now() - cached.fetchedAt < MAX_AGE) return bcv.rate;
  bcv.loading = true;
  bcv.error = '';
  try {
    const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const rate = Number(json.promedio || json.venta || json.compra);
    if (!rate) throw new Error('Respuesta sin tasa');
    const date = String(json.fechaActualizacion || '').slice(0, 10);
    Object.assign(bcv, { rate, date });
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ rate, date, fetchedAt: Date.now() })); } catch { /* sin almacenamiento */ }
  } catch {
    bcv.error = 'No se pudo consultar la tasa BCV. Puedes escribirla a mano.';
  } finally {
    bcv.loading = false;
  }
  return bcv.rate;
}
