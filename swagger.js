const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: "My API",
        description: "Names",
    },
    host: "test-solution2.onrender.com",
    schemes: ['https'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);