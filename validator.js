export const isValidFile = (uploadFile) => {
  console.log('uploadFile.name: ', uploadFile.name);
  return uploadFile.name.includes('Competitie 2023') && uploadFile.name.includes('ronde') && uploadFile.name.includes('.xlsx');
}

