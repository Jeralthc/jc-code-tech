<script setup>
import { ref, computed } from 'vue';
import {
  PlusIcon, MagnifyingGlassIcon, ReceiptPercentIcon, PencilSquareIcon, TrashIcon, ArrowDownTrayIcon,
  ArrowTrendingUpIcon, ArrowTrendingDownIcon
} from '@heroicons/vue/24/outline';
import EmptyState from '../ui/EmptyState.vue';
import CompareChart from '../ui/CompareChart.vue';
import { useCrm, useUi } from '../../../crm/ui';
import { EXPENSE_CATEGORIES } from '../../../crm/constants';
import { matches, formatDate, todayISO, monthLabel, formatCompact, formatBs, formatRate, toCSV, downloadFile } from '../../../crm/utils';

const crm = useCrm();
const ui = useUi();
const s = crm.state;
const search = ref('');
const category = ref('all');
const period = ref('month');

const ym = todayISO().slice(0, 7);
const year = todayISO().slice(0, 4);
const compact = (v) => formatCompact(v, s.settings.currency);
const sum = (list) => list.reduce((a, x) => a + Number(x.amount || 0), 0);
const inPeriod = (date, p) => p === 'all' || (p === 'month' ? date?.startsWith(ym) : date?.startsWith(year));

const incomeMonth = computed(() => sum(s.payments.filter(p => inPeriod(p.date, 'month'))));
const expenseMonth = computed(() => sum(s.expenses.filter(x => inPeriod(x.date, 'month'))));
const profitMonth = computed(() => incomeMonth.value - expenseMonth.value);
const marginMonth = computed(() => incomeMonth.value ? Math.round(profitMonth.value / incomeMonth.value * 100) : null);
const profitYear = computed(() => sum(s.payments.filter(p => inPeriod(p.date, 'year'))) - sum(s.expenses.filter(x => inPeriod(x.date, 'year'))));

const months = computed(() => {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return {
      label: monthLabel(d),
      income: sum(s.payments.filter(p => p.date?.startsWith(key))),
      expense: sum(s.expenses.filter(x => x.date?.startsWith(key))),
      highlight: i === 5
    };
  });
});

const kpis = computed(() => [
  { label: 'Gastos del mes', value: compact(expenseMonth.value), sub: `${s.expenses.filter(x => inPeriod(x.date, 'month')).length} registro(s)`, tone: 'text-rose-300' },
  { label: 'Utilidad del mes', value: compact(profitMonth.value), sub: marginMonth.value === null ? 'Sin cobros este mes' : `Margen ${marginMonth.value}% sobre lo cobrado`, tone: profitMonth.value >= 0 ? 'text-emerald-300' : 'text-rose-300', trend: profitMonth.value >= 0 },
  { label: `Utilidad ${year}`, value: compact(profitYear.value), sub: 'Cobrado menos gastos del año', tone: profitYear.value >= 0 ? 'text-cyan-300' : 'text-rose-300' },
  { label: 'Gasto promedio mensual', value: compact(months.value.reduce((a, m) => a + m.expense, 0) / 6), sub: 'Últimos 6 meses', tone: 'text-violet-300' }
]);

const filtered = computed(() => s.expenses
  .filter(x => inPeriod(x.date, period.value))
  .filter(x => category.value === 'all' || x.category === category.value)
  .filter(x => matches(search.value, x.description, x.category, crm.project(x.projectId)?.title, crm.client(x.clientId)?.company))
  .sort((a, b) => b.date.localeCompare(a.date)));

const byCategory = computed(() => {
  const list = s.expenses.filter(x => inPeriod(x.date, period.value));
  const total = sum(list) || 1;
  return EXPENSE_CATEGORIES
    .map(c => ({ c, value: sum(list.filter(x => x.category === c)) }))
    .filter(x => x.value > 0)
    .sort((a, b) => b.value - a.value)
    .map(x => ({ ...x, pct: Math.round(x.value / total * 100) }));
});

// Rentabilidad real de los proyectos con gastos asociados.
const projectProfit = computed(() => s.projects
  .map(p => ({ p, paid: crm.projectPaid(p), cost: crm.projectExpenses(p), profit: crm.projectProfit(p) }))
  .filter(r => r.cost > 0)
  .map(r => ({ ...r, margin: r.paid ? Math.round(r.profit / r.paid * 100) : null }))
  .sort((a, b) => b.cost - a.cost)
  .slice(0, 5));

const periodLabel = { month: 'este mes', year: `en ${year}`, all: 'en total' };
const remove = (x) => ui.deleted('Gasto eliminado', crm.withUndo(() => crm.deleteExpense(x.id)));
const exportCSV = () => {
  const data = [['ID', 'Fecha', 'Descripción', 'Categoría', 'Proyecto', 'Cliente', 'Monto', 'Moneda', 'Monto Bs', 'Tasa', 'Pagado con']];
  filtered.value.forEach(x => data.push([x.id, x.date, x.description, x.category, crm.project(x.projectId)?.title || '', crm.client(x.clientId)?.company || '',
    x.amount, x.currency, x.amountVes || '', x.rate || '', x.method]));
  downloadFile(`gastos-${todayISO()}.csv`, '﻿' + toCSV(data), 'text/csv;charset=utf-8');
};
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-white tracking-tight">Gastos y utilidad</h1>
        <p class="text-sm text-slate-400 mt-1">Cuánto te cuesta cada trabajo y cuánto te queda de verdad</p>
      </div>
      <div class="flex gap-2">
        <button class="crm-btn-secondary" :disabled="!filtered.length" @click="exportCSV"><ArrowDownTrayIcon class="w-4 h-4" /><span class="hidden sm:inline">Exportar</span></button>
        <button class="crm-btn-primary" @click="ui.editExpense()"><PlusIcon class="w-4 h-4" />Registrar gasto</button>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div v-for="k in kpis" :key="k.label" class="crm-card p-4">
        <p class="text-xs text-slate-400 truncate">{{ k.label }}</p>
        <p :class="['text-xl sm:text-2xl font-extrabold font-mono mt-1 flex items-center gap-1.5', k.tone]">
          {{ k.value }}
          <component :is="k.trend ? ArrowTrendingUpIcon : ArrowTrendingDownIcon" v-if="k.trend !== undefined" class="w-5 h-5" />
        </p>
        <p class="text-2xs text-slate-500 mt-1 truncate">{{ k.sub }}</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-4 items-start">
      <section class="crm-card p-5 sm:p-6 lg:col-span-2">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h3 class="font-bold text-white">Cobrado vs. gastos</h3>
            <p class="text-xs text-slate-400 mt-0.5">Últimos 6 meses · pasa el cursor para ver la utilidad</p>
          </div>
          <div class="flex gap-3 text-xs text-slate-400">
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-emerald-400"></span>Cobrado</span>
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-rose-400"></span>Gastos</span>
          </div>
        </div>
        <CompareChart :data="months" :format="compact" />
      </section>

      <section class="crm-card p-5 space-y-4">
        <div>
          <h3 class="font-semibold text-white">Rentabilidad por proyecto</h3>
          <p class="text-xs text-slate-500">Lo cobrado menos sus gastos</p>
        </div>
        <ul class="space-y-3">
          <li v-for="r in projectProfit" :key="r.p.id" class="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
            <div class="flex justify-between gap-2">
              <div class="min-w-0">
                <p class="text-sm font-semibold text-white truncate">{{ r.p.title }}</p>
                <p class="text-xs text-slate-500 truncate">{{ crm.client(r.p.clientId)?.company }}</p>
              </div>
              <span :class="['font-mono text-sm shrink-0', r.profit >= 0 ? 'text-emerald-300' : 'text-rose-300']">{{ crm.money(r.profit) }}</span>
            </div>
            <div class="flex h-1.5 rounded-full bg-slate-800 overflow-hidden mt-2">
              <div class="h-full bg-rose-400/80" :style="{ width: Math.min(100, r.paid ? r.cost / r.paid * 100 : 100) + '%' }"></div>
            </div>
            <p class="text-2xs text-slate-500 mt-1.5">Cobrado {{ crm.money(r.paid) }} · Gastos {{ crm.money(r.cost) }}<span v-if="r.margin !== null"> · Margen {{ r.margin }}%</span></p>
          </li>
          <li v-if="!projectProfit.length" class="text-sm text-slate-500 text-center py-4">Asocia gastos a un proyecto para ver su ganancia real.</li>
        </ul>

        <div v-if="byCategory.length" class="pt-4 border-t border-slate-800">
          <h4 class="text-sm font-semibold text-white mb-3">Por categoría <span class="text-slate-500 font-normal">({{ periodLabel[period] }})</span></h4>
          <div v-for="x in byCategory" :key="x.c" class="mb-2.5">
            <div class="flex justify-between text-xs mb-1"><span class="text-slate-300">{{ x.c }}</span><span class="font-mono text-slate-400">{{ compact(x.value) }} · {{ x.pct }}%</span></div>
            <div class="h-1.5 rounded-full bg-slate-800 overflow-hidden"><div class="h-full bg-rose-400/70 rounded-full" :style="{ width: x.pct + '%' }"></div></div>
          </div>
        </div>
      </section>
    </div>

    <section class="crm-card">
      <div class="p-4 flex flex-col sm:flex-row gap-3 border-b border-slate-800">
        <div class="relative flex-1">
          <MagnifyingGlassIcon class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input v-model="search" class="crm-input !py-2 pl-10" placeholder="Buscar gasto, proyecto o cliente…" />
        </div>
        <select v-model="period" class="crm-input !py-2 sm:w-36">
          <option value="month">Este mes</option>
          <option value="year">Este año</option>
          <option value="all">Todo</option>
        </select>
        <select v-model="category" class="crm-input !py-2 sm:w-52">
          <option value="all">Todas las categorías</option>
          <option v-for="c in EXPENSE_CATEGORIES" :key="c">{{ c }}</option>
        </select>
      </div>
      <EmptyState v-if="!s.expenses.length" :icon="ReceiptPercentIcon" title="Sin gastos registrados" text="Anota materiales, traslados y licencias para conocer la utilidad real de tu negocio y de cada proyecto.">
        <button class="crm-btn-primary" @click="ui.editExpense()"><PlusIcon class="w-4 h-4" />Registrar gasto</button>
      </EmptyState>
      <EmptyState v-else-if="!filtered.length" :icon="MagnifyingGlassIcon" title="Sin gastos en este período" />
      <ul v-else class="divide-y divide-slate-800/60">
        <li v-for="x in filtered" :key="x.id" class="group px-4 py-3.5 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-rose-500/10 ring-1 ring-rose-500/30 flex items-center justify-center text-rose-300 shrink-0"><ReceiptPercentIcon class="w-5 h-5" /></div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-white truncate">{{ x.description }}</p>
            <p class="text-xs text-slate-500 truncate">
              {{ formatDate(x.date) }} · {{ x.category }}
              <span v-if="x.projectId"> · <button class="hover:text-cyan-300" @click="ui.go('projects')">{{ crm.project(x.projectId)?.title }}</button></span>
              <span v-else-if="x.clientId"> · {{ crm.client(x.clientId)?.company }}</span>
            </p>
          </div>
          <div class="text-right shrink-0">
            <p class="font-mono font-semibold text-rose-300">-{{ crm.money(x.amount) }}</p>
            <p v-if="x.currency === 'VES' && x.amountVes" class="text-2xs text-slate-500 font-mono">{{ formatBs(x.amountVes) }} · {{ formatRate(x.rate) }}</p>
            <p v-else class="text-2xs text-slate-500">{{ x.method }}</p>
          </div>
          <div class="flex sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="crm-icon-btn" title="Editar" @click="ui.editExpense(x)"><PencilSquareIcon class="w-4 h-4" /></button>
            <button class="crm-icon-btn hover:text-rose-400" title="Eliminar" @click="remove(x)"><TrashIcon class="w-4 h-4" /></button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
