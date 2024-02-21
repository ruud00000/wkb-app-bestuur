<template>

  <Item>
    <template #icon>
      <UitslagenIcon />
    </template>
    <template #heading>Uitslagen upload</template>
    <template></template>
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
    
      Hier kan je de uitslagen uploaden: <a href="#" @click="handleUploadClick"  data-cy="handleUploadClick">upload Excel-bestand </a>. 
    
  </Item>
  
  <Toast ref="toastRef" data-cy="toastMessage"/>

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
  const MAILTO = import.meta.env.VITE_MAILTO
  const MAIL_URL = import.meta.env.VITE_MAIL_URL
  const subject = 'WKB upload'

  const handleUploadClick = () => {
    // Trigger the click event of the hidden file input
    fileInputUploadConvert.value.click()
  }

  const sendMail = async (to, subject, mailtext) => {
    const payload = {
          to: to,
          subject: subject,
          text: mailtext
    }
    try {
      const response = await fetch(`${MAIL_URL}/send-email`, {        
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
          throw new Error('Mail sturen is niet gelukt.')
        }
  
      const data = await response.json()
    } catch (error) {
      console.error(error)
    }
  }

  const handleFileUploadConvert = async () => {
    const validFile = isValidFile(fileInputUploadConvert.value.files[0])
    if (!validFile) {
      console.log("This is not the expected file")
      toastRef.value.showCustomToast("Bestand is niet geüpload. Controleer of je het juiste bestand hebt geselecteerd.")
      const mailText = `Bestand met naam ${fileInputUploadConvert.value.files[0].name} werd niet geupload.`
      sendMail(MAILTO, subject, mailText)
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
        const mailText = `Uploaden en converteren van bestand ${fileInputUploadConvert.value.files[0].name} is niet gelukt.`
        sendMail(MAILTO, subject, mailText)
        throw new Error('Bestand uploaden en converteren is niet gelukt.')

      }

      const data = await response.json()

      //hideToast()
      const uploadDate = new Date().toLocaleString('nl-NL')
      const text = data.message + ' Laatste upload: ' + uploadDate
      toastRef.value.showCustomToast(text)
      const mailText = `Bestand met naam ${fileInputUploadConvert.value.files[0].name} werd op ${uploadDate} geupload en geconverteerd.`
      sendMail(MAILTO, subject, mailText)

    } catch (error) {
      console.error(error)
      const mailText = `Fout bij uploaden en converteren van bestand ${fileInputUploadConvert.value.files[0].name}: ${error}.`
      sendMail(MAILTO, subject, mailText)

    }
  }

</script>
