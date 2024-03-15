export const isValidFile = (uploadFile) => {
  const d = new Date();
  let year = d.getFullYear();
  console.log('uploadFile.name: ', uploadFile.name);
  return uploadFile.name.includes('Competitie') && uploadFile.name.includes(year) && uploadFile.name.includes('ronde') && uploadFile.name.includes('.xlsx');
}

