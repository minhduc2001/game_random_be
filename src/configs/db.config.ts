import { DataSource } from 'typeorm'
import { envConfig } from './env.config'

export const PSQL = new DataSource({
  type: 'postgres',
  host: envConfig.DB_HOST,
  port: envConfig.DB_PORT,
  username: envConfig.DB_USERNAME,
  password: envConfig.DB_PASSWORD,
  database: envConfig.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  subscribers: [],
  migrations: [],
  ssl: false
})

export const createConnection = () => {
  PSQL.initialize()
    .then(() => console.log('Khoi tao thanh cong'))
    .catch((e) => {
      console.log('Khoi tao that bai', e)
    })
}
