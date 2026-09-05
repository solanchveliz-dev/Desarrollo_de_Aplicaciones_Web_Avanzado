const fs = require('fs');
const { Transform } = require('stream');

const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        const textoMayusculas = chunk.toString().toUpperCase();
        callback(null, textoMayusculas);
    }
});

const readStream = fs.createReadStream('texto.txt', {
    encoding: 'utf8'
});

const writeStream = fs.createWriteStream('texto_mayusculas.txt');

readStream
    .pipe(transformStream)
    .pipe(writeStream);

writeStream.on('finish', () => {
    console.log('Texto transformado correctamente.');
    console.log('Se creó el archivo texto_mayusculas.txt');
});

readStream.on('error', error => {
    console.error('Error al leer el archivo:', error.message);
});

transformStream.on('error', error => {
    console.error('Error al transformar el texto:', error.message);
});

writeStream.on('error', error => {
    console.error('Error al escribir el archivo:', error.message);
});