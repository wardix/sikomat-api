import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class DaftarKeluhan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    kode: string;

    @Column()
    keluhan: string;

    @Column()
    parameter_input: string;

    @Column(
        { nullable: true, default: "" }
    )
    label: string;

    @Column(
        { nullable: true, default: "" }
    )
    satuan: string;

    @Column(
        { nullable: true, default: "" }
    )
    masking: string;

}

