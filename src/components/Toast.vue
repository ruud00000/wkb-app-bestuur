<!-- Toast.vue -->
<template>
    <div v-if="showToast" class="pwa-toast">
      <p>{{ toastMessage }}</p>
      <button class="toast-button" @click="hideToast">OK</button>
    </div>
</template>

<script setup>
  import { ref } from 'vue'

  const showToast = ref(false);
  const toastMessage = ref('');
  
  const showCustomToast = (text) => {
    toastMessage.value = text;
    showToast.value = true;
  };
  
  const hideToast = () => {
    showToast.value = false;
  };

  defineExpose({
    showCustomToast,
    hideToast})

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
</style>
  