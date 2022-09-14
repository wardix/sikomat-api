import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Auth {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true,
    })
    token: string;

    @Column({
        nullable: true,
    })
    refresh_token: string;

    @Column({
        nullable: true,
    })
    ip: string;

    @Column({
        nullable: true,
    })
    platform: string;

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
    userType: string;

    @Column({
        nullable: true,
    })
    username: string;

}


