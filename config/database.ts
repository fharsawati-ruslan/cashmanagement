import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  /**
   * Default connection.
   */
  connection: 'mysql',

  /**
   * Pretty-print SQL debug output in development.
   */
  prettyPrintDebugQueries: true,

  connections: {
    mysql: {
      client: 'mysql2',

      connection: {
        host: env.get('DB_HOST'),
        port: Number(env.get('DB_PORT') ?? 3306),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },

      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },

      debug: app.inDev,
    },
  },
})

export default dbConfig
