const http = require('http');
const ExcelJS = require('exceljs');
const { Readable } = require('stream');

const productos = [
    { producto: 'Laptop', cantidad: 2, precio: 2500.00 },
    { producto: 'Mouse', cantidad: 10, precio: 45.90 },
    { producto: 'Teclado', cantidad: 8, precio: 89.90 },
    { producto: 'Monitor', cantidad: 5, precio: 750.00 },
    { producto: 'Audífonos', cantidad: 12, precio: 120.50 },
    { producto: 'Webcam', cantidad: 6, precio: 180.00 },
    { producto: 'Memoria USB', cantidad: 20, precio: 35.00 },
    { producto: 'Disco SSD', cantidad: 7, precio: 320.00 },
    { producto: 'Impresora', cantidad: 3, precio: 680.00 },
    { producto: 'Parlantes', cantidad: 9, precio: 95.00 },
    { producto: 'Tablet', cantidad: 4, precio: 1100.00 },
    { producto: 'Smartphone', cantidad: 6, precio: 1500.00 },
    { producto: 'Cargador', cantidad: 15, precio: 55.90 },
    { producto: 'Cable HDMI', cantidad: 18, precio: 30.00 },
    { producto: 'Router', cantidad: 5, precio: 210.00 },
    { producto: 'Micrófono', cantidad: 7, precio: 160.00 },
    { producto: 'Soporte para laptop', cantidad: 11, precio: 75.00 },
    { producto: 'Disco externo', cantidad: 4, precio: 390.00 },
    { producto: 'Cámara digital', cantidad: 3, precio: 1250.00 },
    { producto: 'Proyector', cantidad: 2, precio: 1800.00 }
];

const server = http.createServer(async (req, res) => {
    console.log(`Solicitud recibida: ${req.method} ${req.url}`);

    // Validación de la ruta /reporte
    if (req.url === '/reporte' && req.method === 'GET') {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Ventas');

            worksheet.columns = [
                {
                    header: 'Producto',
                    key: 'producto',
                    width: 25
                },
                {
                    header: 'Cantidad',
                    key: 'cantidad',
                    width: 15
                },
                {
                    header: 'Precio',
                    key: 'precio',
                    width: 15
                }
            ];

            productos.forEach(producto => {
                worksheet.addRow(producto);
            });

            // Estilo de la cabecera
            worksheet.getRow(1).font = {
                bold: true,
                color: { argb: 'FFFFFFFF' }
            };

            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF2563EB' }
            };

            worksheet.getColumn('precio').numFmt = '"S/ "0.00';

            // Generar el archivo Excel en memoria
            const excelBuffer = await workbook.xlsx.writeBuffer();

            // Cabeceras HTTP para descargar el archivo
            res.writeHead(200, {
                'Content-Type':
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition':
                    'attachment; filename="reporte_ventas.xlsx"',
                'Content-Length': excelBuffer.length
            });

            // Convertir el Excel en un Stream
            const excelStream = Readable.from([excelBuffer]);

            // Manejar posibles errores del Stream
            excelStream.on('error', error => {
                console.error(
                    'Error durante el envío del Excel:',
                    error.message
                );

                if (!res.destroyed) {
                    res.destroy(error);
                }
            });

            // Enviar el archivo en streaming
            excelStream.pipe(res);

            // Confirmar el cierre correcto
            res.on('finish', () => {
                console.log('Reporte enviado correctamente.');
                console.log('Stream cerrado correctamente.');
            });
        } catch (error) {
            console.error(
                'Error al generar el Excel:',
                error.message
            );

            if (!res.headersSent) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain; charset=utf-8'
                });

                res.end('Error al generar el reporte Excel.');
            } else {
                res.destroy();
            }
        }

        return;
    }

    // Respuesta para cualquier ruta diferente de /reporte
    console.log(`Ruta no encontrada: ${req.url}`);

    res.writeHead(404, {
        'Content-Type': 'text/plain; charset=utf-8'
    });

    res.end('Visita /reporte para descargar el Excel');
});

server.on('error', error => {
    console.error('Error del servidor:', error.message);
});

server.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
    console.log(
        'Visita http://localhost:3000/reporte para descargar el Excel'
    );
});