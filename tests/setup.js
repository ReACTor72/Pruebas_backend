import { sequelize } from '../src/database/db.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

beforeAll(async () => {
  // Añadir autenticación explícita y sincronización
  try {
    await sequelize.authenticate();
    //console.log('Conexión a BD_TEST establecida');
    await sequelize.sync({ force: true });
    //console.log('Tablas creadas en BD_TEST');
  } catch (error) {
    console.error('Error en setup:', error);
  }
});

afterAll(async () => {
  await sequelize.close();
});