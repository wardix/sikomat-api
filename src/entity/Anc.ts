import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { DaftarKeluhanPasien } from "./DaftarKeluhanPasien";
import { DetailAnc } from "./DetailAnc";
import { KelompokKeluhan } from "./KelompokKeluhan";
import { Keluhan } from "./Keluhan";
import { Pasien } from "./Pasien";
import { Skreening } from "./Skreening";


@Entity()
export class Anc {

    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne(type => Pasien)
    @JoinColumn({ name: "pasien" })
    pasien: Pasien;

    @Column({
        nullable: true,
        default: ""
    })
    hpht: string;

    @Column({
        nullable: true,
        default: ""
    })
    bb: string;


    @Column({
        nullable: true,
        default: ""
    })
    tb: string;


    @Column({
        nullable: true,
        default: ""
    })
    imt: string;

    @Column({
        nullable: true,
        default: ""
    })
    taksiran_persalinan: String;

    @Column({
        nullable: true,
        default: ""
    })
    fasyankes: String;


    @Column({
        nullable: true,
        default: ""
    })
    rujukan: String;

    @Column({
        nullable: true,
        default: ""
    })
    gravida: string;

    @Column({
        nullable: true,
        default: ""
    })
    para_partus: string;

    @Column({
        nullable: true,
        default: ""
    })
    abortus: string;

    @Column({
        nullable: true,
        default: ""
    })
    ibu_menyusui_dini: String;

    @OneToMany(type => DetailAnc, detail_anc => detail_anc.anc)
    detail_anc: DetailAnc[];

    @OneToMany(type => Skreening, skreening => skreening.anc)
    skreening: Skreening[];


    @Column({
        nullable: true,
        length: 1000,
        default: ""
    })
    feedback: string;

    @Column({
        nullable: true,
        length: 20,
        default: ""
    })
    admin_hp: string;

    @Column({
        nullable: true,
        length: 255,
        default: ""
    })
    feedback_admin: string;

    @Column({
        nullable: true,
        default: null,
    })
    feedback_send_date: Date;

}
