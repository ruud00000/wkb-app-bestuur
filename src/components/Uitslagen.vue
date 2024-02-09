<template>

  <Item>
    <template #icon>
      <UitslagenIcon />
    </template>
    <template #heading>Uitslagen upload</template>
    <form enctype="multipart/form-data">
      <input type="file" id="fileInputUploadConvert" name="file" ref="fileInputUploadConvert" @change="handleFileUploadConvert" style="display: none;" />
    </form>
  
      Hier kan je de uitslagen uploaden: <a href="#" @click="handleUploadClick">upload Excel-bestand</a>. 
      
  </Item>
  
  <!-- Toast component -->
  <div v-if="showToast" class="pwa-toast">
    <p>{{ toastMessage }}</p>    
    <button class="toast-button" @click="hideToast">OK</button>
  </div>

</template>
  
<script setup>
  import Item from './Item.vue'
  import UitslagenIcon from './icons/IconUitslagen.vue'
  import { ref } from 'vue'
  import { isValidFile } from '../../validator';
  
  const fileInputUploadConvert = ref(null)
  const toastMessage = ref('')
  // Reactive state for controlling toast visibility
  const showToast = ref(false)

  // Method to show the toast
  const showCustomToast = (text) => {
    toastMessage.value = text
    showToast.value = true
  }

  // Method to hide the toast
  const hideToast = () => {
    showToast.value = false
  }

  const handleUploadClick = () => {
    // Trigger the click event of the hidden file input
    fileInputUploadConvert.value.click()
  }

  const handleFileUploadConvert = async () => {
    const validFile = isValidFile(fileInputUploadConvert.value.files[0])
    if (!validFile) {
      console.log("This is not the expected file")
      showCustomToast("Bestand is niet geüpload. Controleer of je het juiste bestand hebt geselecteerd.")
      return
    }
    
    showCustomToast("Bezig met uploaden en converteren...")
    const formData = new FormData()
    formData.append('file', fileInputUploadConvert.value.files[0])

    try {
      const response = await fetch('https://fu2.computerhuys.nl//uploadconvert', {        
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Bestand uploaden en converteren is niet gelukt.')
      }

      const data = await response.json()

      hideToast()
      const uploadDate = new Date().toLocaleString('nl-NL')
      const text = data.message + ' Laatste upload: ' + uploadDate
      showCustomToast(text)

    } catch (error) {
      console.error(error)
    }
  }

</script>

<style scoped>
.toast-button {
  margin: auto;
  display: block;
}
</style>

../../isValidFile../../validator