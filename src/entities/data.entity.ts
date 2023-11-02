import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Fragment } from './fragment.entity';

// describe about User Entity with jsdoc-syntax
/**
 * @class Data
 * @description 데이터 기초명
 * @extends BaseEntity
 * @property {string} path 경로명
 */
@Entity({ name: 'data' })
export class Data extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    unique: true,
    comment: '경로명',
  })
  path: string;

  @CreateDateColumn({
    type: 'timestamp',
    comment: '생성날짜',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: '수정날짜',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    comment: '삭제날짜',
  })
  deletedAt: Date;

  @OneToMany(() => Fragment, (fragments) => fragments.data, {
    cascade: ['insert', 'recover', 'remove', 'soft-remove', 'update'],
  })
  fragments: Fragment[];
}
