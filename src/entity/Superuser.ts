import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Superuser {

    @PrimaryGeneratedColumn()
    id: number;

  
    @Column()
    nama: string;

    @Column({
        nullable: true,
    })
    username: string;

    @Column({
        nullable: true,
    })
    user_type: string;

    @Column({
        nullable: true,
    })
    password: string;

}

