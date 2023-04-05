<template>
  <VSnackbar
    v-model="show"
    top
    centered
    transition="scroll-y-transition"
    min-height="85"
    timeout="8000"
    elevation="4"
    rounded="xl"
    v-bind="$attrs"
    @click.native="show = false"
    @keypress.native="show = false"
    v-on="$listeners"
    :color="`${color}--text`"
  >
    <div class="flex justify-between items-center">
      <div>
        <p class="font-extrabold mb-2">
          {{ title }}
        </p>
        <p>{{ message }}</p>
      </div>
    </div>
    <template v-slot:action="{ attrs }">
      <VBtn dark text v-bind="attrs" elevation="1">بستن</VBtn>
    </template>
  </VSnackbar>
</template>

<script lang="ts">
export { Toast as default } from './toast';
</script>
