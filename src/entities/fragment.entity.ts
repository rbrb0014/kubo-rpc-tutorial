import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Data } from './data.entity';

// describe about User Entity with jsdoc-syntax
/**
 * @class Fragment
 * @description 데이터 프레그먼트
 * @extends BaseEntity
 * @property {string} cid 조각 고유번호
 * @property {string} data_id 데이터 번호
 */
@Entity({ name: 'fragment' })
export class Fragment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
  })
  data_id: string;

  @ManyToOne(() => Data, (data) => data.fragments, {
    cascade: ['insert', 'recover', 'update'],
  })
  data: Data;

  @Column({
    type: 'varchar',
    unique: true,
    comment: 'cid',
  })
  cid: string;

  @Column({
    type: 'varchar',
    comment: 'key',
  })
  key: string;

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
