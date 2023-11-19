import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// describe about User Entity with jsdoc-syntax
/**
 * @class Data
 * @description 데이터
 * @extends BaseEntity
 * @property {string} path 지정경로
 * @property {string} cid 조각 고유번호
 * @property {string} data_id 데이터 번호
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

  @Column('varchar', {
    array: true,
    unique: true,
    comment: 'cids',
  })
  cids: string[];

  @Column('varchar', {
    array: true,
    comment: 'keys',
  })
  keys: string[];

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
}
