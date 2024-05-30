const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = [
  './controllers/AuthController.js',
  './controllers/ProductController.js',
  './controllers/UserController.js',
]

swaggerAutogen(outputFile, endpointsFiles)