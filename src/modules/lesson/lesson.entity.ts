import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'lessons' })
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title', length: 100, nullable: false })
  title: string;

  @Column({ name: 'start_time', nullable: false })
  startTime: string;

  @Column({ name: 'end_time', nullable: false })
  endTime: string;

  @Column({ name: 'lesson_date', nullable: false })
  lessonDate: string;

  @Column({ name: 'observations', length: 500 })
  observations: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
