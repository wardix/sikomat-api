import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Verify {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true,
    })
    user_type: string;
   
    @Column({
        nullable: true,
    })
    hp: string;

    @Column({
        nullable: true,
    })
    event: string;

    @Column({
        nullable: true,
    })
    pin: string;

    @Column({
        nullable: true,
        type: "date",
    })
    created: Date;

    @Column({
        nullable: true,
    })
    expired: Date;

    @Column({
        nullable: true,
    })
    verify: Date;

}


