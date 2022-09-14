import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Keluhan } from "./Keluhan";
import { RiwayatPasien } from "./RiwayatPasien";


@Entity()
export class DaftarKeluhanPasien {

    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne(type => RiwayatPasien)
    @JoinColumn({ name: "riwayat_pasien" })
    riwayat_pasien: RiwayatPasien;

    @ManyToOne(type => Keluhan)
    @JoinColumn({ name: "keluhan" })
    keluhan: Keluhan;

    @Column({
        nullable: true,
        length: 255
    })
    input: string;
}

