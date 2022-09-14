import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Pasien } from "./Pasien";


@Entity()
export class Bidan {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true,
    })
    nama: string;

    @Column({
        length: 200,
        nullable: true,
    })
    alamat_peta: string;

    @Column({
        length: 200,
        nullable: true,
    })
    alamat_detail: string;

    @Column({
        unique:true,
        nullable: true,
    })
    hp: string;

    @Column({
        nullable: true,
    })
    email: string;

    @Column({
        nullable: true,
    })
   
    @Column("real", {
        nullable: true,
        default: 0
    })
    latitude: number;


    @Column("real", {
        nullable: true,
        default: 0
    })
    longitude: number;

    @Column({
        nullable: true,
    })
    status: number;

    @OneToMany(type => Pasien, pasien => pasien.bidan)
    pasien: Pasien[];

    @Column({
        nullable: true,
    })
    rekanan: string;

}
