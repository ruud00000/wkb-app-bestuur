<template>

  <Item>
    <template #icon>
      <UitslagenIcon />
    </template>
    <template #heading>Uitslagen upload</template>
    <template #content>
      <form enctype="multipart/form-data">
        <input 
          type="file" 
          id="fileInputUploadConvert" 
          name="file" 
          ref="fileInputUploadConvert" 
          @change="handleFileUploadConvert" 
          style="display: none ;" 
          data-cy="fileInputUploadConvert" />
      </form>
      Hier kan je de uitslagen uploaden: <a href="#" @click="handleUploadClick"  data-cy="handleUploadClick">upload Excel-bestand</a>. 
    </template>
  </Item>

  <Item>
    <template #icon>
      <NieuwsIcon />
    </template>
    <template #heading>Nieuws upload</template>
    <template #content>
      Hier kan je de terecht om nieuws op de site te zetten: 
      <RouterLink to="/nieuws">nieuws publiceren</RouterLink>
    </template>
  </Item>
  
  <Toast :message="toastMessage" :visible="toastVisible" @update:visible="updateToastVisibility" />

</template>
  
<script setup>
  import Item from './Item.vue'
  import UitslagenIcon from './icons/IconUitslagen.vue'
  import NieuwsIcon from './icons/IconNieuwsItem.vue'
  import { ref } from 'vue'
  import { isValidFile } from '../../validator'
  import Toast from './Toast.vue'
  import { sendMail } from '@/utils/mailService'
    
  const fileInputUploadConvert = ref(null)
  const FILEUPLOAD_URL = import.meta.env.VITE_FILEUPLOAD_URL
  const MAILTO = import.meta.env.VITE_MAILTO
  
  const subject = 'WKB upload'

  const toastMessage = ref("")
  const toastVisible = ref(false)

  const showToast = (message) => {
    toastMessage.value = message;
    toastVisible.value = true;
  }

  const updateToastVisibility = (visible) => {
    toastVisible.value = visible
  }

  const handleUploadClick = () => {
    // Trigger the click event of the hidden file input
    fileInputUploadConvert.value.click()
  }

  const handleFileUploadConvert = async () => {
    const validFile = isValidFile(fileInputUploadConvert.value.files[0])
    if (!validFile) {
      console.log("This is not the expected file")
      showToast(("Bestand is niet geüpload. Controleer of je het juiste bestand hebt geselecteerd."))
      const mailText = `Bestand met naam ${fileInputUploadConvert.value.files[0].name} werd niet geupload.`
      sendMail(MAILTO, subject, mailText)
      return
    }
    
    showToast("Bezig met uploaden en converteren...")
    
    const formData = new FormData()
    formData.append('file', fileInputUploadConvert.value.files[0])

    try {
      const response = await fetch(`${FILEUPLOAD_URL}/uploadconvert`, {        
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const mailText = `Uploaden en converteren van bestand ${fileInputUploadConvert.value.files[0].name} is niet gelukt.`
        sendMail(MAILTO, subject, mailText)
        throw new Error('Bestand uploaden en converteren is niet gelukt.')

      }

      const data = await response.json()

      const uploadDate = new Date().toLocaleString('nl-NL')
      const text = data.message + ' Laatste upload: ' + uploadDate
      showToast(text)
      const mailText = `Bestand met naam ${fileInputUploadConvert.value.files[0].name} werd op ${uploadDate} geupload en geconverteerd.`
      sendMail(MAILTO, subject, mailText)

    } catch (error) {
      console.error(error)
      const mailText = `Fout bij uploaden en converteren van bestand ${fileInputUploadConvert.value.files[0].name}: ${error}.`
      sendMail(MAILTO, subject, mailText)

    }
  }

</script>
