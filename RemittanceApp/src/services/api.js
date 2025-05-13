axios.post('/api/kyc', formData)
  .then(res => console.log(res))
  .catch(err => console.error(err));