<script setup>
import { WrenchScrewdriverIcon, ServerIcon, ComputerDesktopIcon, CodeBracketIcon, CircleStackIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <section id="servicios" class="bg-gray-50 py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Nuestros Servicios</h2>
      </div>
      <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
        <div class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">

          <!-- Card 1: Área TECH -->
          <div class="flex flex-col bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 p-8 sm:p-10 transform transition duration-500 hover:-translate-y-2">
            <h3 class="text-2xl font-bold tracking-tight text-cyan-600 mb-6 flex items-center gap-3">
              <WrenchScrewdriverIcon class="h-8 w-8 text-cyan-600" />
              Área TECH (Infraestructura)
            </h3>
            <ul role="list" class="mt-4 space-y-6 text-base leading-7 text-gray-600 flex-1">
              <li class="flex gap-x-3">
                <ServerIcon class="h-6 w-5 flex-none text-cyan-500" aria-hidden="true" />
                <span>Soporte técnico L1-L3.</span>
              </li>
              <li class="flex gap-x-3">
                <ComputerDesktopIcon class="h-6 w-5 flex-none text-cyan-500" aria-hidden="true" />
                <span>Mantenimiento de Puntos de Venta (POS).</span>
              </li>
              <li class="flex gap-x-3">
                <WrenchScrewdriverIcon class="h-6 w-5 flex-none text-cyan-500" aria-hidden="true" />
                <span>Redes estructuradas y recuperación de sistemas.</span>
              </li>
            </ul>
          </div>

          <!-- Card 2: Área CODE -->
          <div class="flex flex-col bg-gray-900 rounded-2xl shadow-xl ring-1 ring-gray-900 p-8 sm:p-10 transform transition duration-500 hover:-translate-y-2">
            <h3 class="text-2xl font-bold tracking-tight text-cyan-400 mb-6 flex items-center gap-3">
              <CodeBracketIcon class="h-8 w-8 text-cyan-400" />
              Área CODE (Desarrollo)
            </h3>
            <ul role="list" class="mt-4 space-y-6 text-base leading-7 text-gray-300 flex-1">
              <li class="flex gap-x-3">
                <CodeBracketIcon class="h-6 w-5 flex-none text-cyan-400" aria-hidden="true" />
                <span>Desarrollo de aplicaciones web internas.</span>
              </li>
              <li class="flex gap-x-3">
                <CircleStackIcon class="h-6 w-5 flex-none text-cyan-400" aria-hidden="true" />
                <span>Bases de datos relacionales y digitalización de inventarios.</span>
              </li>
              <li class="flex gap-x-3">
                <CalendarDaysIcon class="h-6 w-5 flex-none text-cyan-400" aria-hidden="true" />
                <span>Sistemas de citas y control de asistencia.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>
