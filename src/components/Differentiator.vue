<script setup>
import { ShieldCheckIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <section class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:text-center">
        <h2 class="text-base font-semibold leading-7 text-cyan-600">Por qué elegirnos</h2>
        <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Tecnología Integral y Segura</p>
        <p class="mt-6 text-lg leading-8 text-gray-600 flex items-start gap-4 text-left lg:text-center">
            <ShieldCheckIcon class="h-12 w-12 flex-none text-cyan-500 lg:hidden" aria-hidden="true" />
            <span>
              Entendemos desde cómo conectar los cables de tu red hasta cómo programar el código de tu sistema de ventas. No solo instalamos sistemas; aplicamos principios de ciberseguridad para proteger la información de tus clientes y tu facturación.
            </span>
        </p>
      </div>
      <div class="mt-10 flex justify-center hidden lg:flex">
          <ShieldCheckIcon class="h-24 w-24 text-cyan-500 opacity-80" aria-hidden="true" />
      </div>
    </div>
  </section>
</template>
