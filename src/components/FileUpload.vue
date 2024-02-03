<!-- Your Vue component template -->
<template>
    <h1>Uitslagen uploaden</h1>
    <form enctype="multipart/form-data">
        <input type="file" id="fileInput" name="file" ref="fileInput">
        <label class="file-input" for="fileInput">Selecteer bestand</label>
        <button type="button" @click="handleFileUpload">Upload bestand</button>
    </form>
    <p>{{ message }}</p>
</template>

  
<script setup>
import { ref } from 'vue';

const fileInput = ref(null);
const message = ref('');

const handleFileUpload = async () => {
  const formData = new FormData();
  formData.append('file', fileInput.value.files[0]);

  try {
    const response = await fetch('https://fu2.computerhuys.nl//upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const data = await response.json();

    // Update the message using the ref
    message.value = data.message;

    setTimeout(() => {
      // Clear the message after 5 seconds
      message.value = '';
    }, 5000);
  } catch (error) {
    console.error('Error:', error);
  }
};
</script>
  