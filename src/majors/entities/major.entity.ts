import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('majors')
export class MajorEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 20, unique: true, nullable: false })
  name: string;
}