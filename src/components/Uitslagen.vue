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
      Laatste upload: {{ uploadDateTime }}
  </Item>
  
  <p>{{ message }}</p>

</template>
  
<script setup>
  import Item from './Item.vue'
  import UitslagenIcon from './icons/IconUitslagen.vue'
  import { ref } from 'vue'

  const fileInputUploadConvert = ref(null)
  const message = ref('')
  const uploadDateTime = ref('')
  

  const handleUploadClick = () => {
    // Trigger the click event of the hidden file input
    fileInputUploadConvert.value.click()
  }

  const handleFileUploadConvert = async () => {
    const formData = new FormData()
    formData.append('file', fileInputUploadConvert.value.files[0])

    try {
      const response = await fetch('https://fu2.computerhuys.nl//uploadconvert', {        
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload and convert failed')
      }

      const data = await response.json()

      // Update the message using the ref
      message.value = data.message
      uploadDateTime.value = new Date().toLocaleString('nl-NL')

      // pwa-toast maken met melding


      setTimeout(() => {
        // Clear the message after 5 seconds
        message.value = ''
      }, 5000);

    } catch (error) {
      console.error(error)
    }
  }

</script>





