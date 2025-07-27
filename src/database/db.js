import { Sequelize } from "sequelize";
import mysql from 'mysql2/promise'; // Importa mysql2/promise
import dotenv from "dotenv";

// Cargar variables de entorno según el ambiente
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
  //console.log('.....................Cargando variables de entorno desde .env.test');
} else if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development' });
  //console.log('.....................Cargando variables de entorno desde .env.development');
} else {
  dotenv.config({ path: '.env' });
  //console.log('.....................Cargando variables de entorno desde .env');
}

// Extraemos las variables de entorno para usarlas en ambos procesos
const { DB_NAME, DB_USERNAME, DB_PASSWORD, HOST } = process.env;
//console.log('Variables de entorno cargadas:', { DB_NAME, DB_USERNAME, HOST });

/**
 * ⚙️ Función para crear la base de datos si no existe.
 * Se conecta al servidor MySQL sin especificar una base de datos.
 */
const ensureDatabaseExists = async () => {
  try {
    // Conexión al servidor MySQL (sin seleccionar una base de datos específica)
    const connection = await mysql.createConnection({
      host: HOST,
      user: DB_USERNAME,
      password: DB_PASSWORD
    });
    
    // Ejecuta el comando SQL para crear la base de datos si no existe
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    
    console.log(`-------------->>> Base de datos '${DB_NAME}' verificada/creada.`);
    
    // Cierra la conexión temporal
    await connection.end();
  } catch (error) {
    //console.error('-------------->>> Error al crear la base de datos:', error);
    // Si no se puede crear la DB, es un error crítico, salimos del proceso
    process.exit(1);
  }
};

// Crear la instancia de Sequelize (esto no establece la conexión aún)
export const sequelize = new Sequelize(
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  {
    host: HOST,
    dialect: "mysql",
    logging: false, // Desactiva los logs de las consultas
    dialectOptions: {
      connectTimeout: 100000 // 100 segundos
    }
  }
);

/**
 * 🔌 Función para inicializar la conexión y sincronizar los modelos.
 * Llama primero a la función que asegura que la base de datos exista.
 */
export const initializeDB = async () => {
  try {
    // 1. Asegurarse de que la base de datos exista
    await ensureDatabaseExists();

    // 2. Autenticar la conexión de Sequelize a la base de datos ya existente
    await sequelize.authenticate();
    //console.log('-------------->>> Conexión a DB establecida');

    // 3. Sincronizar los modelos (crear/alterar tablas)
    await sequelize.sync({ alter: true });
    //console.log('-------------->>> Tablas sincronizadas');
  } catch (error) {
    //console.error('-------------->>> Error en la inicialización de DB:', error);
  }
};

