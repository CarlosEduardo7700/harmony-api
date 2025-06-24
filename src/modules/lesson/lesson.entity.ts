import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'lessons' })
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'google_event_id', length: 100, nullable: false })
  googleEventId: string;

  @Column({ name: 'google_event_link', length: 210, nullable: false })
  googleEventLink: string;

  @Column({ name: 'title', length: 100, nullable: false })
  title: string;

  @Column({ name: 'start_time', nullable: false })
  startTime: string;

  @Column({ name: 'end_time', nullable: false })
  endTime: string;

  @Column({ type: 'date', name: 'lesson_date', nullable: false })
  lessonDate: Date;

  @Column({ name: 'observations', length: 500, nullable: true })
  observations: string;

  @Column({ name: 'created_at', nullable: true })
  createdAt: string;

  @Column({ name: 'updated_at', nullable: true })
  updatedAt: string;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: string;
}
