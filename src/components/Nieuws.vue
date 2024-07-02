<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Toast from './Toast.vue'
import { isInvalidImage } from '../../validator'
import { sendMail } from 'wkb-utils'

const objects = ref([])
const selectedObjectId = ref(null)
const selectedObject = ref(null)

const API_URL = import.meta.env.VITE_API_URL
const MAILTO = import.meta.env.VITE_MAILTO

const subject = 'WKB nieuws upload'
const uploadDate = ref(new Date().toLocaleString('nl-NL'))
const mailText = ref("")
  
const editMode = ref(false)
const cancelEnabled = ref(false)

const message = ref("")
const toastMessage = ref("")
const toastVisible = ref(false)

const showToast = (message) => {
  toastMessage.value = message;
  toastVisible.value = true;
}

const updateToastVisibility = (visible) => {
  toastVisible.value = visible
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

const today = ref((new Date()).toISOString())
// console.log('todayISOString: ', today.value)
// console.log('formattedDate: ', formatDate(today.value)); // Output: 2024-05-30

const form = ref({
  datum_: formatDate(today.value),
  titel_kort: '',
  titel_lang: '',
  inhoud_kort: '',
  inhoud_lang: '',
  foto_naam: '',
  visibility: true
});

const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

onMounted(async () => {
  try {
    const response = await axios.get(`${API_URL}/get-nieuws`)
    //console.log('axios response: ', response)
    objects.value = response.data;
    // let op dit levert array van objecten op in de vorm 
    // {"_id":"666c375cfdd9511c09d060a8","datum":"1-5-2024","titel_kort":"test titel kort","titel_lang":"test titel lang","inhoud_kort":"test inhoud kort","inhoud_lang":"test inhoud lang\n","id":{"$numberInt":"2"},"foto_naam":"","visibility":"public"} 
    // i.p.v. (verzonden door get-nieuws endpoint):
    // {"_id":{"$oid":"666c375cfdd9511c09d060a8"},"datum":"1-5-2024","titel_kort":"test titel kort","titel_lang":"test titel lang","inhoud_kort":"test inhoud kort","inhoud_lang":"test inhoud lang\n","id":{"$numberInt":"2"},"foto_naam":"","visibility":"public"}
    // dus niet .$oid gebruiken 
    // (zie https://chatgpt.com/share/a44cba60-47d9-4911-87dc-78b59db14f61 voor uitleg over $oid)
    //console.log('received response.data from get-nieuws: ', response.data)

    // Annuleren knop in beeld zetten asl er iets getypt wordt
    const inputNodes = document.querySelectorAll('input')
    console.log('inputNodes: ', inputNodes)

    // Loop over them and enable cancel
    Array.from(inputNodes).forEach(inputNode => {
      inputNode.addEventListener('input', event => {
        cancelEnabled.value = true
      }, false)
    })
  } catch (error) {
    //console.error('Error fetching nieuws items:', error);
  }
  
});

const selectObject = () => {
  const object = objects.value.find(obj => obj._id === selectedObjectId.value)
  console.log('object: ', object)
  console.log('selectedObjectId: ', selectedObjectId)
  if (object) {
    selectedObject.value = object
    selectedObject.value.datum_ = formatDate(object.datum_)  // datum formatteren voor input-tag
    Object.assign(form.value, object)
    editMode.value = true
  } else {
    selectedObject.value = null
    editMode.value = false
    resetForm()
  }
  cancelEnabled.value = true
}

const handleFileUpload = async () => {
  const file = fileInput.value.files[0]

  if (file) {
    // validatie
    message.value = isInvalidImage(file)    
    if (message.value) {
      console.log(message.value)
      showToast(message.value)
      mailText.value = message.value
      try {
        await sendMail(MAILTO, subject, mailText.value)
      } catch (error) {
        console.error('Error sending mail:', error);
      }
      return
    } 
    // console.log('Selected file:', file)    
    const formData = new FormData()
    formData.append('file', file)
    // console.log('form met file: ', formData.get('file'))
    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      //const uploadDate = new Date().toLocaleString('nl-NL')
      message.value = response.data.message
      console.log('message: ', message.value)
      showToast(message.value)
    
      mailText.value = `Bestand met naam ${file.name} werd op ${uploadDate.value} geupload.`
      try {
        await sendMail(MAILTO, subject, mailText.value, file)
      } catch (error) {
        console.error('Error sending mail:', error);
      }

      // naam in form object zetten (kan niet met v-model voor input van type file)
      form.value.foto_naam = formData.get('file').name
    } catch (error) {
      console.error('Error uploading file:', error);
      showToast('Error uploading file.');
    }
  }
}

const resetForm = (event) => {
  form.value = {
    datum_: formatDate(today.value),
    titel_kort: '',
    titel_lang: '',
    inhoud_kort: '',
    inhoud_lang: '',
    foto_naam: '',
    visibility: true
  };
  try {
    const formNode = document.querySelector('.needs-validation')
    formNode.classList.remove('was-validated')
    cancelEnabled.value = false
  } catch (error) {
    console.error('Error removing class was-validated after validation:', error);
  }
}

const cancelEdit = () => {
  try {
    resetForm()
    selectedObject.value = null
    selectedObjectId.value = null
    editMode.value = false
  } catch (error) {
    console.error('Error resetting form:', error);
  }
}

const deleteDocument = async () => {
  try {
    const response = await axios.post(`${API_URL}/delete-nieuws`, form.value)

    try {      
      console.log(response.data.info)
      showToast(response.data.info)

      try {
        mailText.value = JSON.stringify(response.data)
        await sendMail(MAILTO, 'WKB nieuws delete', mailText.value)
      } catch (mailError) {
        console.error('Error sending mail:', mailError);
      }

      // objects bijwerken 
      objects.value = response.data.collection 
    
      resetForm()
      selectedObject.value = null
      selectedObjectId.value = null
      editMode.value = false
    } catch (updateError) {
      console.error('Error updating objects or resetting form:', updateError);
    }

  } catch (error) {
    console.error('Error deleting document:', error);
    showToast('Er is iets misgegaan bij het verwijderen van het nieuwsitem.');
  }
 
}

const submitForm = async (event) => {
  const formNode = event.target;  

  if (!formNode.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
    cancelEnabled.value = true
    formNode.classList.add('was-validated')      
  } else {
    try {
      // Handle update / add logic
      const response = await axios.post(`${API_URL}/update-nieuws`, form.value) 

      try {
        console.log(response.data.info)
        showToast(response.data.info)
        try {
          mailText.value = JSON.stringify(response.data)
          await sendMail(MAILTO, 'WKB nieuws update', mailText.value)
        } catch (mailError) {
          console.error('Error sending mail:', mailError);
        }
        // objects bijwerken incl. door mongodb gegenereerde _id
        objects.value = response.data.collection 

        resetForm()
        selectedObject.value = null
        selectedObjectId.value = null
        editMode.value = false
      } catch (updateError) {
        console.error('Error updating objects or resetting form:', updateError);
      }

    } catch (error) {
      console.error("An error occurred during form submission:", error);
      showToast("Er is iets misgegaan bij het updaten.");
    }
  }
}
</script>

<template #content>  
  <div class="card">
    <div class="card-header">
      <label for="nieuws_item" class="form-label">Nieuws item</label>
      <select v-model="selectedObjectId" @change="selectObject" id="nieuws_item" class="form-select">
        <option v-for="obj in objects" :key="obj._id" :value="obj._id">
          {{ obj.titel_kort }}
        </option>
      </select>
    </div>

    <div class="card-body">
      <form @submit.prevent="submitForm" class="needs-validation" novalidate>
        <div class="form-group mb-3">
          <label for="datum" class="form-label">Publicatiedatum</label>
          <input type="date" id="datum" v-model="form.datum_" class="form-control" required/>
          <div class="form-text">
            Publicatiedatum in format dd-mm-jjjj.
          </div>
        </div>

        <div class="form-group mb-3">
          <label for="titel_kort" class="form-label">Titel</label>
          <input type="text" id="titel_kort" v-model="form.titel_kort" class="form-control" required/>
          <div id="titel_kort_feedback" class="invalid-feedback">
            Dit veld is verplicht.
          </div>
          <div class="form-text">
            Titel die op de website boven het bericht komt te staan.
          </div>
        </div>

        <div class="form-group mb-3">
          <label for="inhoud_lang" class="form-label">Berichttekst</label>
          <textarea id="inhoud_lang" v-model="form.inhoud_lang" rows="10" class="form-control" required></textarea>
          <div id="inhoud_lang_feedback" class="invalid-feedback">
            Dit veld is verplicht.
          </div>
          <div class="form-text">
            Tekst van het bericht dat op de website komt te staan. Als er een foto bij het bericht wordt geplaatst dan komt deze tekst onder de foto te staan.
          </div>
        </div>

        <div class="form-group mb-3">
          <div class="form-switch">
            <label v-if="form.foto_naam" for="foto_naam" class="form-label">Geselecteerd bestand: {{ form.foto_naam }}</label>
            <span v-else><label for="foto_naam" class="form-label">Foto</label></span>
                  
            <input 
              type="file" 
              class="form-control d-none" 
              id="foto_naam" 
              @change="handleFileUpload"
              ref="fileInput"
              accept=".jpg, .png" >
            <button 
              class="btn btn-outline-secondary" 
              @click.prevent="triggerFileInput">Upload
            </button>
          </div>
          <div v-if="form.foto_naam" class="form-text">
            Upload een andere foto als je een andere foto bij het bericht wil plaatsen.
          </div>
          <div v-else class="form-text">
            Selecteer foto bij bericht. Bestand moet een .jpg of .png bestand zijn, niet goter dan 2 MB.<br>
            <p style="transform: rotate(0);">Foto kleiner maken kan met <a href="https://tinypng.com" target="_blank" class="stretched-link">https://tinypng.com</a>
            </p>
          </div>        
        </div>

        <div class="form-group mb-3">
          <div class="form-check form-switch">
            <label for="visibility" class="form-check-label">Tonen</label>
            <input type="checkbox" role="switch" id="visibility" v-model="form.visibility" class="form-check-input form-check-input-lg"/>   
          </div>
          <div class="form-text">
            Hiermee kun je zorgen dat een bericht niet getoond wordt op de site bijvoorbeeld omdat je de foto nog niet geüpload hebt of omdat je een bericht niet meer wil laten zien maar nog niet wilt verwijderen.
          </div>
        </div>


        <div class="d-flex gap-2 justify-content-center">
          <button type="submit" class="btn btn-primary">{{ editMode ? 'Wijzigen' : 'Toevoegen' }}</button>
          <button type="button" v-if="cancelEnabled" @click="cancelEdit" class="btn btn-secondary">Annuleren</button>
          <button type="button" v-if="editMode" @click="deleteDocument" class="btn btn-danger">Verwijderen</button>
        </div>
      </form>
    </div>  
  </div>

  <Toast :message="toastMessage" :visible="toastVisible" @update:visible="updateToastVisibility" />

</template>

<style scoped>
.form-switch {
  display: flex !important;
  justify-content: space-between !important;
  padding-left: 0;
}

.form-check-input-lg {
            width: 3rem;
            height: 1.5rem;
            margin-top: 0.3rem;
        }

.form-check-input-lg:checked {
    background-color: #0d6efd;
}

.form-check-input-lg::before {
    width: 1.5rem;
    height: 1.5rem;
}
</style>
