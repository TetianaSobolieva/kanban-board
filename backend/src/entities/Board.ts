import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Card } from './Card';

@Entity('boards')
export class Board {
  @PrimaryColumn({ type: 'varchar', length: 21 })
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @OneToMany(() => Card, (card) => card.board, { cascade: true })
  cards!: Card[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
