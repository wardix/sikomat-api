import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { DaftarKeluhan } from "./DaftarKeluhan";
import { KelompokKeluhan } from "./KelompokKeluhan";

@Entity({
    orderBy: {
        urutan: "ASC"
    }
})
export class Keluhan {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => KelompokKeluhan)
    @JoinColumn({ name: "kelompok_keluhan" })
    kelompok_keluhan: KelompokKeluhan;

    @ManyToOne(type => DaftarKeluhan)
    @JoinColumn({ name: "daftar_keluhan" })
    daftar_keluhan: DaftarKeluhan;
    
    @Column({
        nullable: true,
        length: 255
    })
    keterangan_tambahan: string;

    @Column({
        nullable: true,
        default: 0
    })
    urutan: number;
}

