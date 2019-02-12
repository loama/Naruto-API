const axios = require('axios')

axios.get(process.env.url + '/v1/fetchData')
  .then(function (response) {
    console.log(response)
  })
  .catch(function (error) {
    console.log(error)
  })
