import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ name: 'created_at', nullable: true })
  createdAt: string;

  @Column({ name: 'updated_at', nullable: true })
  updatedAt: string;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: string;
}
