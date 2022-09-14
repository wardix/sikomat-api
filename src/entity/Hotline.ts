import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Hotline {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true
    })
    hp: string;

    @Column({
        nullable: true
    })
    email: string;

    @Column(
        {
            nullable: true
        }
    )
    pj: string;

    @Column({
        nullable: true
    })
    lokasi: string;
}

