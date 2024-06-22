import axios from 'axios'

const MAIL_URL = import.meta.env.VITE_MAIL_URL

export const sendMail = async (to, subject, mailtext, file = null) => {
    const formData = new FormData();
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('text', mailtext);
  
    if (file) {
      formData.append('attachment', file);
    }

    axios.post(`${MAIL_URL}/send-email`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
      console.log('mailer message: ', response.data.message)
    })
    .catch(error => {
    console.error(error); 
    })
  }