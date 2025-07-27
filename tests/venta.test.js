import request from 'supertest';
import app from '../src/server.js'; 
import { sequelize } from '../src/database/db.js'; 
import { Cliente } from '../src/models/Cliente.js';
import { Empleado } from '../src/models/Empleado.js';
import { Producto } from '../src/models/Producto.js';
import { Unidad } from '../src/models/Unidad.js';
import { Categoria } from '../src/models/Categoria.js';
import { Ingreso } from '../src/models/Ingresos.js';
import { IngresoDetalle } from '../src/models/IngresoDetalles.js';
import { Proveedor } from '../src/models/Proveedor.js';

describe('\nPruebas para los endpoints de Ventas y Detalle de Venta\n------------------------------------------------------------', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        await Proveedor.create({ id: 1, nombre: 'Proveedor Prueba',nombre_contacto: 'Proveedor Prueba',direccion: "CALLE SIMON BOLIVAR # 369",telefono: "1111111",celular: "60455555",email: "juan@trupper.com",estado: 'true' });
        await Ingreso.create({ id: 1, fechaIngreso: '2025-07-19',
        montoTotal: '4500', proveedor_id:1});
        
        await Categoria.create({ id: 1, nombre: 'HERRAMIENTAS MANUALES',
        descripcion: 'HERRAMIENTAS COMO MARTILLOS, DESTORNILLADORES, ALICATES, ETC' });
        await Unidad.create({ id: 1, nombre: 'PIEZA' });
        await Cliente.create({ id: 1, nombre_cliente: 'Cliente Prueba', direccion: "CALLE SIMON BOLIVAR # 369",celular: "60455555",email: "juan@trupper.com",estado: 'true', estadoCredito: 'true' });
        await Empleado.create({ id: 1, nombre: 'Empleado Prueba',direccion: "CALLE SIMON BOLIVAR # 369",telefono: "1111111",celular: "60455555",email: "juan@trupper.com",estado: 'true' });
        await Producto.create({ id: 1, nombre: 'Producto 1', descripcion:'descripcion test', stock:'30',categoria_id:'1', unidad_id:'1',imagen:''});
        await Producto.create({ id: 2, nombre: 'Producto 2',descripcion:'descripcion test', stock:'30',categoria_id:'1', unidad_id:'1',imagen:'' });

        await IngresoDetalle.create({ id: 1, lote: '1',cantidad: '45',
        precio: '40',precioVenta:'45',saldoProducto:'50',producto_id:'1',ingreso_id:'1' });
        await IngresoDetalle.create({ id: 2, lote: '1',cantidad: '45',
        precio: '45',precioVenta:'70',saldoProducto:'5',producto_id:'2',ingreso_id:'1' });
    });

    let ventaId;
    const datosVenta = {
            fechaVenta: "2025-01-04",
            monto: 4500,
            metodoPago: "EFECTIVO",
            tipoVenta: "ONLINE",
            tipoEntrega: "TIENDA",
            cliente_id: 1,
            detalles: [
                    {
                    producto_id: '1',
                    cantidad: '1',
                    precio: '45',
                    total: '45' 
                    },
                    {
                    producto_id: '2',
                    cantidad: '1',
                    precio: '70',
                    total: '70'
                    }
                ]
    };
     test('debería crear una Venta con su Detalle \t\t\t\t- POST /api/ventas', async () => {
        const response = await request(app).post('/api/ventas').send(datosVenta);
        //console.log(response);
        expect(response.statusCode).toBe(201);
        ventaId = response.body.nuevaVenta.id;
        
    });

    test('debería obtener todas las Ventas \t\t\t- GET /api/ventas', async () => {
        const response = await request(app).get('/api/ventas');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
    });

test('debería obtener una venta especifica por ID \t\t\t- GET /api/ventas/:id', async () => {
        const response = await request(app).get(`/api/ventas/${ventaId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.monto).toBe(datosVenta.monto);
    });

    test('debería actualizar datos de una Venta \t\t\t- PUT /api/ventas/:id', async () => {
        const datosActualizados = {
            fechaVenta: "2025-07-20",
            metodoPago: "QR",            
        }
        const response = await request(app).put(`/api/ventas/${ventaId}`).send(datosActualizados);
        expect(response.statusCode).toBe(201);
        expect(response.body.body.fecha).toBe(datosActualizados.fecha);
        expect(response.body.body.metodoPago).toBe(datosActualizados.metodoPago);
    });

    test('debería obtener el detalle de una venta especifica por ID \t\t\t- GET /api/ventas/:id', async () => {
        const response = await request(app).get(`/api/ventas/${ventaId}/detalles`);
        expect(response.statusCode).toBe(200);
       
    });
    afterAll(async () => {
        await sequelize.close();
    }); 
});
