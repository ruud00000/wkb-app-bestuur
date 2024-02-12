<template>

  <Item>
    <template #icon>
      <UitslagenIcon />
    </template>
    <template #heading>Uitslagen upload</template>
    <template></template>
      <form enctype="multipart/form-data">
        <input type="file" id="fileInputUploadConvert" name="file" ref="fileInputUploadConvert" @change="handleFileUploadConvert" style="display: none;" />
      </form>
    
      Hier kan je de uitslagen uploaden: <a href="#" @click="handleUploadClick">upload Excel-bestand</a>. 
    
  </Item>
  
  <Toast ref="toastRef" />

</template>
  
<script setup>
  import Item from './Item.vue'
  import UitslagenIcon from './icons/IconUitslagen.vue'
  import { ref } from 'vue'
  import { isValidFile } from '../../validator'
  import Toast from './Toast.vue'
    
  const fileInputUploadConvert = ref(null)
  const toastRef = ref(Toast);
  const API_URL = import.meta.env.VITE_API_URL

  const handleUploadClick = () => {
    // Trigger the click event of the hidden file input
    fileInputUploadConvert.value.click()
  }

  const handleFileUploadConvert = async () => {
    const validFile = isValidFile(fileInputUploadConvert.value.files[0])
    if (!validFile) {
      console.log("This is not the expected file")
      toastRef.value.showCustomToast("Bestand is niet geüpload. Controleer of je het juiste bestand hebt geselecteerd.")
      return
    }
    
    toastRef.value.showCustomToast("Bezig met uploaden en converteren...")
    
    const formData = new FormData()
    formData.append('file', fileInputUploadConvert.value.files[0])

    try {
      const response = await fetch(`${API_URL}/uploadconvert`, {        
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Bestand uploaden en converteren is niet gelukt.')
      }

      const data = await response.json()

      //hideToast()
      const uploadDate = new Date().toLocaleString('nl-NL')
      const text = data.message + ' Laatste upload: ' + uploadDate
      toastRef.value.showCustomToast(text)

    } catch (error) {
      console.error(error)
    }
  }

</script>
