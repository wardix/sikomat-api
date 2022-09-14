import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Keluhan } from "./Keluhan";

@Entity()
export class KelompokKeluhan {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    kode: string;

    @Column()
    nama: string;

    @Column({
        nullable: true,
        default: 0
    })
    urutan: number;
}

