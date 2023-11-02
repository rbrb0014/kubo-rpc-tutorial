import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'kubodb',
  entities: ['dist/**/*.entity.{js,ts}'],
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
};
