require('dotenv').config({ path: './.env' });

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.MARIADB_HOST,
      user: process.env.MARIADB_USER,
      password: process.env.MARIADB_PASSWORD,
      database: 'schedulebot'
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations'
    }
  },
  production: {
    client: 'mysql',
    connection: {
      host: process.env.MARIADB_HOST,
      user: process.env.MARIADB_USER,
      password: process.env.MARIADB_PASSWORD,
      database: 'schedulebot'
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations'
    }
  }
};
