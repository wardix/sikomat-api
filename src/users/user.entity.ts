import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  nama: string;

  @Column({
    nullable: true,
    unique: true
  })
  hp: string;

  @Column({
    nullable: true,
    unique: true
  })
  email: string;

  @Column({
    nullable: true,
    unique: true
  })
  telegram_id: string;

  @Column({
    nullable: true,
  })
  fcm_token: string;

  @Column({
    nullable: true,
  })
  password: string;

  @Column({
    nullable: true,
  })
  user_type: string;

  @Column({
    nullable: true,
    default: 0
  })
  status: number;

  @Column({
    nullable: true,
  })
  activation_request_date: Date;

  @Column({
    nullable: true,
  })
  activation_date: Date;

}
