<!-- Toast.vue -->
<template>
  <div v-if="visible" class="pwa-toast">
    <p v-html="message"></p>
    <button class="toast-button" @click="hideToast">OK</button>
  </div>
</template>

<script setup>

import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible'])

const hideToast = () => {
  // zorg dat als op button in deze component geklikt wordt 
  // in parent event update:visible getriggerd wordt
  // met waarde false voor parameter visible van functie updateToastVisibility in parent
  // dit alles omdat direct (hier) wijzigen van prop niet is toegestaan in vue 
  // 'Props are meant to be immutable from the perspective of the child component.' 
  // https://chatgpt.com/share/68f21472-e389-4e09-9f71-d733f5855d60
  emit('update:visible', false)
}

</script>

  
<style scoped>
  /* Your styles for the toast go here */
  /*.pwa-toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px;
    background-color: #333;
    color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }*/

  .toast-button {
    margin: auto;
    display: block;
  }

  .pwa-toast {
    bottom: unset;
    background-color: white;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    right: unset;
  }
</style>
  