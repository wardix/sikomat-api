import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Bidan } from "./Bidan";
import { RiwayatPasien } from "./RiwayatPasien";


@Entity()
export class Pasien {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true,
        length: 255

    })
    nama: string;

    @Column({
        nullable: true,
        length: 255

    })
    nama_suami_kel: string;

    @Column({
        nullable: true,
        length: 255

    })
    nik: string;

    @Column({
        nullable: true,
        length: 255

    })
    nik_suami_kel: string;


    @Column({
        nullable: true,
        length: 255

    })
    no_jkn: string;
    
    @Column({
        nullable: true,
        length: 255

    })
    no_jkn_suami_kel: string;



    @Column({
        nullable: true,
        length: 255

    })
    faskes_satu: string;

    @Column({
        nullable: true,
        length: 255

    })
    faskes_satu_suami_kel: string;


    @Column({
        nullable: true,
        length: 255

    })
    faskes_rujukan: string;

    @Column({
        nullable: true,
        length: 255

    })
    faskes_rujukan_suami_kel: string;

    @Column({
        nullable: true,
        length: 255

    })
    gol_darah: string;


    @Column({
        nullable: true,
        length: 255

    })
    gol_darah_suami_kel: string;

   
    @Column({
        nullable: true,
        length: 255

    })
    tempat_lahir: string;

    @Column({
        nullable: true,
        length: 255

    })
    tempat_lahir_suami_kel: string;


    @Column({
        nullable: true,
        type: "date",
    })
    tanggal_lahir: Date;


    @Column({
        nullable: true,
        type: "date",
    })
    tanggal_lahir_suami_kel: Date;

   

    @Column({
        nullable: true,
        length: 255

    })
    pendidikan: string;


    @Column({
        nullable: true,
        length: 255

    })
    pendidikan_suami_kel: string;

    @Column({
        nullable: true,
        length: 255

    })
    pekerjaan: string;

    @Column({
        nullable: true,
        length: 255

    })
    pekerjaan_suami_kel: string;
    
    @Column({
        nullable: true,
        length: 255

    })
    alamat: string;

    @Column({
        nullable: true,
        length: 255

    })
    alamat_suami_kel: string;

    @Column({
        nullable: true,
        length: 255

    })
    telepon: string;

    @Column({
        nullable: true,
        length: 255

    })
    telepon_suami_kel: string;
    
    @Column({
        nullable: true,
        length: 255

    })
    puskesmas_domisili: string;


    @Column({
        nullable: true,
        length: 255

    })
    no_reg_kohort_ibu: string;


    @Column({
        nullable: true,
        default: 0
    })
    nikah_ke: number;

    @Column({
        nullable: true,
        default: 0
    })
    anak_ke: number;


    @Column({
        nullable: true,
        default: 0
    })
    tinggi_badan: number;


    @Column({
        nullable: true,
        default: 0
    })
    jarak_rumah: number;

    @ManyToOne(type => Bidan)
    @JoinColumn({ name: "bidan" })
    bidan: Bidan;

    @OneToMany(type => RiwayatPasien, riwayat => riwayat.pasien)
    riwayat: RiwayatPasien[];


}
