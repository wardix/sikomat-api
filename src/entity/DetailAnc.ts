import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Anc } from "./Anc";


@Entity()
export class DetailAnc {

    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne(type => Anc)
    @JoinColumn({ name: "anc" })
    anc: Anc;

 
    @Column({
        nullable: true,
        type: "date",
    })
    tanggal_periksa: Date;

    @Column({
        nullable: true,
        default: ""
    })
    tempat_periksa: string;

    @Column({
        nullable: true,
        default: ""
    })
    tri_semester: string;

    @Column({
        nullable: true,
        default: ""
    })
    pemeriksaan_ke: string;


    @Column({
        nullable: true,
        default: ""
    })
    timbang: string;

    @Column({
        nullable: true,
        default: ""
    })
    lila: string;

    @Column({
        nullable: true,
        default: ""
    })
    td: string;
   
    @Column({
        nullable: true,
        default: ""
    })
    tinggi_rahim: string;

    @Column({
        nullable: true,
        default: ""
    })
    letak_janin: string;

    @Column({
        nullable: true,
        default: ""
    })
    djj: string;

    @Column({
        nullable: true,
        default: ""
    })
    status_imunisasi_tetanus: string;


    @Column({
        nullable: true,
        default: ""
    })
    konseling: string;


    @Column({
        nullable: true,
        default: ""
    })
    skreening_dokter: string;

    @Column({
        nullable: true,
        default: ""
    })
    tablet_tambah_darah: string;

    @Column({
        nullable: true,
        default: ""
    })
    test_lab_hb: string;

    @Column({
        nullable: true,
        default: ""
    })
    hb: string;

    @Column({
        nullable: true,
        default: ""
    })
    test_gol_darah: string;

    @Column({
        nullable: true,
        default: ""
    })
    gol_darah: string;

    @Column({
        nullable: true,
        default: ""
    })
    test_lab_protein_urine: string;

    @Column({
        nullable: true,
        default: ""
    })
    lab_protein_urine: string;

    @Column({
        nullable: true,
        default: ""
    })
    test_lab_gula_darah: string;


    @Column({
        nullable: true,
        default: ""
    })
    lab_gula_darah: string;

    @Column({
        nullable: true,
        default: ""
    })
    ppia: string;


    @Column({
        nullable: true,
        default: ""
    })
    tata_laksana_kasus: string;

}
