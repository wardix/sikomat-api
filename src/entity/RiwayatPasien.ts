import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { DaftarKeluhanPasien } from "./DaftarKeluhanPasien";
import { KelompokKeluhan } from "./KelompokKeluhan";
import { Keluhan } from "./Keluhan";
import { Pasien } from "./Pasien";
import { User } from "./User";


@Entity()
export class RiwayatPasien {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true,
        type: "date",
    })
    tanggal_periksa: Date;

    @Column({
        nullable: true,
    })
    riwayat_reg: String;

    @Column({
        nullable: true,
        default: 0
    })
    berat_badan: number;

    @Column({
        nullable: true,
        default: 0
    })
    lila: number;

    @Column({
        nullable: true,
    })
    hb_masuk: string;


    @Column({
        nullable: true,
    })
    kgd_masuk: string;


    @Column({
        nullable: true,
    })
    tekanan_darah: string;

    @Column({
        nullable: true,
    })
    tekanan_nadi: string;

    @Column({
        nullable: true,
    })
    suhu: string;

    @Column({
        nullable: true,
    })
    rss: string;

    @Column({
        nullable: true,
    })
    kadar_oksigen: string;

    @Column({
        nullable: true,
    })
    anc_bidan: string;

    @Column({
        nullable: true,
    })
    anc_dokter: string;

    @Column({
        nullable: true,
    })
    anc_spesialis: string;


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
        length: 255
    })
    riwayat_persalinan: string;

    @ManyToOne(type => Pasien)
    @JoinColumn({ name: "pasien" })
    pasien: Pasien;

    @OneToMany(type => DaftarKeluhanPasien, daftar_keluhan_pasien => daftar_keluhan_pasien.riwayat_pasien)
    daftar_keluhan_pasien: DaftarKeluhanPasien[];

    @ManyToOne(type => KelompokKeluhan)
    @JoinColumn({ name: "kelompok_keluhan" })
    kelompok_keluhan: KelompokKeluhan;

    @Column({
        nullable: true,
        length: 1000,
        default: ""
    })
    feedback: string;

    @Column({
        nullable: true,
        length: 255,
        default: ""
    })
    feedback_admin: string;

    @Column({
        default: false
    })
    admin_read: boolean;

    @Column({
        nullable: true,
    })
    admin_read_date: Date;


    @Column({
        nullable: true,
    })
    feedback_send_date: Date;

    @Column({
        default: false
    })
    feedback_read: boolean;

    @Column({
        nullable: true,
    })
    feedback_read_date: Date;

    @Column({
        nullable: true,
        length: 20,
        default: ""
    })
    admin_hp: string;

}
