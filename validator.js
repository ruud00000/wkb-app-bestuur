export const isValidFile = (file) => {
  const d = new Date();
  let year = d.getFullYear();
  console.log('file.name: ', file.name);
  return file.name.includes('Competitie') && file.name.includes(year) && file.name.includes('ronde') && file.name.includes('.xlsx');
}

export const isValidImage = (file) => {
  // check bestandsextensie
  const validExtensions = ['jpg', 'jpeg', 'png'];
  const fileExtension = file.name.split('.').pop().toLowerCase();
  const isValidExtension = validExtensions.includes(fileExtension);

  console.log('fileExtension: ', fileExtension)


  // check bestandsgrootte
  const isValidSize = file.size <= 2 * 1024 * 1024; // 2 MB in bytes

  // class  .is-invalid of .is-valid toepassen

  let message = ''
  if (!isValidExtension || !isValidSize) {
    message += 'Bestand is niet geüpload: '
  }
  if (!isValidExtension) {
    message += '<br>- ' + 'Bestandstype is niet toegestaan'
  }
  if (!isValidSize) {
    message += '<br>- ' + 'Bestand is groter dan 2 MB'
  }
  
  return message
}

