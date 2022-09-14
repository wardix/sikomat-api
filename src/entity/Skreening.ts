import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Keluhan } from "./Keluhan";
import { Anc } from "./Anc";


@Entity()
export class Skreening {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Anc)
    @JoinColumn({ name: "anc" })
    anc: Anc;

    @ManyToOne(type => Keluhan)
    @JoinColumn({ name: "keluhan" })
    keluhan: Keluhan;

    @Column({
        nullable: true,
        length: 255
    })
    input: string;
}

