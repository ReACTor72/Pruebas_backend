import { jest, describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import { Empleado } from '../src/models/Empleado.js';
import {
  listarEmpleados,
  crearEmpleado,
  verEmpleado,
  actualizarEmpleado
} from '../src/controllers/empleado.controller.js';

const mockRequest = (body = {}, params = {}, query = {}) => ({ body, params, query });

// Función mock para simular el objeto response (res) de Express
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res); // Mockea el método status y lo encadena
  res.json = jest.fn().mockReturnValue(res);   // Mockea el método json y lo encadena
  return res;
};

// Suite principal de pruebas para el Controlador de Empleados
describe('Pruebas del Controlador de Empleados', () => {

  // Se ejecuta antes de cada prueba individual
  beforeEach(() => {
    // Limpia todos los mocks de Jest para asegurar que cada prueba sea independiente
    jest.restoreAllMocks();
  });

  // --- Pruebas para la función listarEmpleados ---
  describe('listarEmpleados', () => {
    it('Debería obtener una lista de empleados existentes', async () => {
      // Datos de empleados simulados que findAll debería devolver
      const empleadosMock = [
        { id: 1, nombre: 'Juan Perez', cargo: 'Vendedor', celular: 11111111, email: 'juan@test.com', direccion: 'Calle A 123', telefono: 1234567 },
        { id: 2, nombre: 'Maria Lopez', cargo: 'Cajero', celular: 22222222, email: 'maria@test.com', direccion: 'Calle B 456', telefono: 7654321 },
      ];
      // Simula que Empleado.findAll() devuelve los datos mockeados
      jest.spyOn(Empleado, 'findAll').mockResolvedValue(empleadosMock);

      const req = mockRequest(); // No se necesita cuerpo ni parámetros para esta prueba
      const res = mockResponse();

      // Llama a la función del controlador
      await listarEmpleados(req, res);

      // Verifica las aserciones:
      // 1. Que se llamó a res.status con 200 (OK)
      expect(res.status).toHaveBeenCalledWith(200);
      // 2. Que se llamó a res.json con el formato esperado del controlador
      expect(res.json).toHaveBeenCalledWith({
        message: "Lista de Empleados", // Nota: Tu controlador dice "Lista de Clientes" para empleados
        ok: true,
        status: 200,
        body: empleadosMock,
      });
    });

    it('Debería obtener una lista vacía de empleados si no hay ninguno', async () => {
      // Simula que Empleado.findAll() devuelve un array vacío
      jest.spyOn(Empleado, 'findAll').mockResolvedValue([]);

      const req = mockRequest();
      const res = mockResponse();

      await listarEmpleados(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Lista de Empleados",
        ok: true,
        status: 200,
        body: [],
      });
    });

    it('Debería manejar errores del servidor al obtener empleados', async () => {
      // Simula que Empleado.findAll() lanza un error
      jest.spyOn(Empleado, 'findAll').mockImplementationOnce(() => {
        throw new Error('Error de base de datos simulado al listar');
      });

      const req = mockRequest();
      const res = mockResponse();

      await listarEmpleados(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      // Espera el mensaje de error corregido (error.message)
      expect(res.json).toHaveBeenCalledWith({ message: 'Error de base de datos simulado al listar' });
    });
  });

  // --- Pruebas para la función crearEmpleado ---
  describe('crearEmpleado', () => {
    it('Debería crear un nuevo empleado con datos válidos', async () => {
      // Datos de un nuevo empleado para la prueba
      const nuevoEmpleadoData = {
        nombre: 'Carlos Ruiz',
        direccion: 'Av. Siempre Viva 742',
        telefono: 9876543,
        celular: 33344455,
        email: 'carlos@test.com',
        estado: true,
      };
      // Simula que Empleado.create() devuelve un objeto con los datos creados y un ID
      const empleadoCreadoMock = { id: 3, ...nuevoEmpleadoData };
      jest.spyOn(Empleado, 'create').mockResolvedValue(empleadoCreadoMock);

      const req = mockRequest(nuevoEmpleadoData);
      const res = mockResponse();

      await crearEmpleado(req, res);

      // Verifica que Empleado.create fue llamado con los datos correctos
      expect(Empleado.create).toHaveBeenCalledWith(nuevoEmpleadoData);
      expect(res.status).toHaveBeenCalledWith(201); // 201 Created
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        status: 201,
        message: 'Empleado Regitrado',
      });
    });

    it('No debería crear un empleado si faltan campos obligatorios', async () => {
      // Datos incompletos para simular una validación fallida
      const datosIncompletos = {
        nombre: 'Empleado Incompleto',
        // Faltan direccion, telefono, celular, email
      };
      // Simula que Empleado.create() es rechazado debido a una violación de notNull
      const errorMock = new Error('notNull Violation: empleados.direccion cannot be null');
      jest.spyOn(Empleado, 'create').mockRejectedValue(errorMock);

      const req = mockRequest(datosIncompletos);
      const res = mockResponse();

      await crearEmpleado(req, res);

      expect(res.status).toHaveBeenCalledWith(500); // Tu controlador devuelve 500 para este tipo de error
      expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) }); // Espera cualquier string como mensaje de error
    });

    it('Debería manejar errores del servidor al crear empleado', async () => {
      // Simula que Empleado.create() lanza un error general
      jest.spyOn(Empleado, 'create').mockImplementationOnce(() => {
        throw new Error('Error de base de datos simulado al crear');
      });

      const req = mockRequest({});
      const res = mockResponse();

      await crearEmpleado(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error de base de datos simulado al crear' });
    });
  });

  // --- Pruebas para la función verEmpleado ---
  describe('verEmpleado', () => {
    it('Debería obtener un empleado específico por ID', async () => {
      // Datos de un empleado simulado para ser encontrado
      const empleadoMock = {
        id: 1,
        nombre: 'Empleado Buscado',
        cargo: 'Gerente',
        celular: 99988877,
        email: 'buscado@test.com',
        direccion: 'Calle Z 10',
        telefono: 1010101
      };
      // Simula que Empleado.findOne() devuelve el empleado mockeado
      jest.spyOn(Empleado, 'findOne').mockResolvedValue(empleadoMock);

      const req = mockRequest({}, { id: 1 }); // Pasa el ID en req.params
      const res = mockResponse();

      await verEmpleado(req, res);

      // Verifica que Empleado.findOne fue llamado con los parámetros correctos
      expect(Empleado.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(empleadoMock);
    });

    it('Debería retornar null si el empleado no se encuentra', async () => {
      // Simula que Empleado.findOne() no encuentra ningún empleado
      jest.spyOn(Empleado, 'findOne').mockResolvedValue(null);

      const req = mockRequest({}, { id: 999 }); // ID que no existe
      const res = mockResponse();

      await verEmpleado(req, res);

      expect(Empleado.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(res.status).toHaveBeenCalledWith(200); // Tu controlador devuelve 200 con null
      expect(res.json).toHaveBeenCalledWith(null);
    });

    it('Debería manejar errores del servidor al obtener un empleado', async () => {
      // Simula que Empleado.findOne() lanza un error
      jest.spyOn(Empleado, 'findOne').mockImplementationOnce(() => {
        throw new Error('Error de base de datos simulado al buscar');
      });

      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      await verEmpleado(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error de base de datos simulado al buscar' });
    });
  });

  // --- Pruebas para la función actualizarEmpleado ---
  describe('actualizarEmpleado', () => {
    it('Debería actualizar un empleado existente', async () => {
      // Objeto de empleado existente con métodos mockeados de Sequelize
      const empleadoExistente = {
        id: 1,
        nombre: 'Empleado Original',
        direccion: 'Dir Original',
        telefono: 1234567,
        celular: 11122233,
        email: 'original@test.com',
        estado: true,
        set: jest.fn(), // Mockea el método set de Sequelize
        save: jest.fn().mockResolvedValue(true) // Mockea el método save
      };
      // Datos para actualizar el empleado
      const datosActualizados = {
        nombre: 'Empleado Actualizado',
        direccion: 'Nueva Direccion Actualizada',
        celular: 99988877
      };

      // Simula que Empleado.findOne() devuelve el empleado existente
      jest.spyOn(Empleado, 'findOne').mockResolvedValue(empleadoExistente);

      const req = mockRequest(datosActualizados, { id: 1 }); // Pasa el ID y los datos actualizados
      const res = mockResponse();

      await actualizarEmpleado(req, res);

      // Verifica las aserciones
      expect(Empleado.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(empleadoExistente.set).toHaveBeenCalledWith(datosActualizados);
      expect(empleadoExistente.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      // Espera el formato de respuesta corregido (similar a Cliente)
      expect(res.json).toHaveBeenCalledWith({
        message: "Registro Actualizado",
        ok: true,
        status: 200,
        body: empleadoExistente, // El mock del empleado se devuelve
      });
    });

    it('Debería manejar errores si el empleado no se encuentra para actualizar', async () => {
      // Simula que Empleado.findOne() no encuentra el empleado
      jest.spyOn(Empleado, 'findOne').mockResolvedValue(null);

      const req = mockRequest({ nombre: 'No Existe' }, { id: 999 }); // ID que no existe
      const res = mockResponse();

      await actualizarEmpleado(req, res);

      expect(Empleado.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
    });

    it('Debería manejar errores del servidor al actualizar un empleado', async () => {
      // Simula que Empleado.findOne() encuentra el empleado, pero save() falla
      jest.spyOn(Empleado, 'findOne').mockImplementationOnce(() => {
        const mockEmpleado = {
          set: jest.fn(),
          save: jest.fn().mockRejectedValue(new Error('Error al guardar en DB')),
        };
        return mockEmpleado;
      });

      const req = mockRequest({ nombre: 'Falla al guardar' }, { id: 1 });
      const res = mockResponse();

      await actualizarEmpleado(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al guardar en DB' });
    });
  });
});
