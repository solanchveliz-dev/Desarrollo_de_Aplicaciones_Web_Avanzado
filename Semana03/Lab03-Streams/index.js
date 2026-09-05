//const fs = require('fs');

//const readable = fs.createReadStream('datos.text', { encoding: 'utf8' });

//readable.on('data', chunk =>
    //console.log('Fragmento recibido:', chunk)
//);

//readable.on('end', () =>
   // console.log('Lectura completa')
//);

//readable.on('error', err =>
   // console.error('Error:', err)
//);//
//Actividad2:Escritura en un archivo usando Strerams
//const fs = require('fs');

//const writable = fs.createWriteStream('salida.txt');

//writable.write('Este es un mensaje de prueba.\n');

//writable.end('Fin del mensaje.');

//writable.on('finish', () => {
   // console.log('Escritura completada.');
//});

//writable.on('error', (error) => {
   // console.error('Error al escribir el archivo:', error.message);
//});
//Actividad3
//const fs = require('fs');
//const zlib = require('zlib');

//const readStream = fs.createReadStream('entrada.txt');
//const writeStream = fs.createWriteStream('entrada.txt.gz');
//const gzip = zlib.createGzip();

//readStream
//    .pipe(gzip)
//    .pipe(writeStream);

//writeStream.on('finish', () => {
   // console.log('Archivo comprimido correctamente.');
//});

//readStream.on('error', (error) => {
// console.error('Error al leer el archivo:', error.message);
//});

//writeStream.on('error', (error) => {
    // console.error('Error al crear el archivo comprimido:', error.message);
//});


// Actividad 4: Manejo de errores y Backpressure

const fs = require('fs');

const readable = fs.createReadStream('entrada.txt', {
    encoding: 'utf8'
});

const writable = fs.createWriteStream('salida_backpressure.txt');

readable.on('data', chunk => {
    console.log(`Fragmento recibido: ${chunk.length} caracteres`);

    if (!writable.write(chunk)) {
        console.log('Backpressure detectado: lectura en pausa.');
        readable.pause();
    }
});

writable.on('drain', () => {
    console.log('Memoria liberada: lectura reanudada.');
    readable.resume();
});
writable.on('drain', () => {
    readable.resume();
});

readable.on('end', () => {
    writable.end();
});

writable.on('finish', () => {
    console.log('Flujo de datos completado correctamente.');
});

readable.on('error', error => {
    console.error('Error de lectura:', error.message);
});

writable.on('error', error => {
    console.error('Error de escritura:', error.message);
});