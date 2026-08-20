<script setup>
</script>

<template>
  <footer id="contacto" class="bg-gray-900 border-t border-gray-800">
    <div class="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
      <nav class="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
        <div class="pb-6 text-center sm:text-left">
          <h3 class="text-sm font-semibold leading-6 text-white mb-4">Contacto</h3>
          <ul role="list" class="mt-4 space-y-4">
            <li>
              <a href="#" class="text-sm leading-6 text-gray-400 hover:text-cyan-400">
                WhatsApp
              </a>
            </li>
            <li>
              <a href="#" class="text-sm leading-6 text-gray-400 hover:text-cyan-400">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div class="mt-16 sm:mt-20 flex justify-center">
        <p class="text-center text-xs leading-5 text-gray-400">
          &copy; {{ new Date().getFullYear() }} JC Code & Tech. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
</template>
