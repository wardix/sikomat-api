import { getCustomRepository, getRepository, Repository, Transaction, TransactionRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { Pasien } from "../entity/Pasien";
import { RiwayatPasien } from "../entity/RiwayatPasien";
import { DaftarKeluhanPasien } from "../entity/DaftarKeluhanPasien";
var fs = require("fs");
var path = require("path");
export class UserController {

    // private bidanRepo = getCustomRepository(BidanRepository);
    private userRepo = getCustomRepository(UserRepository);
    private pasienRepo = getRepository(Pasien);
    private riwayatRepo = getRepository(RiwayatPasien);
    private keluhanPasienRepo = getRepository(DaftarKeluhanPasien);
    private daftarKeluhanPasienRepo = getRepository(DaftarKeluhanPasien);


    async get(request: Request, response: Response, next: NextFunction) {
        return {};
    }

    async fcmtoken(request: Request, response: Response, next: NextFunction) {
        let user = await this.userRepo.findOne({ hp: request.user.username });
        console.log("fcm Token: " + request.body['fcm_token'])
        user.fcm_token = request.body['fcm_token'];
        return await this.userRepo.save(user);
    }

    async profile(request: Request, response: Response, next: NextFunction) {
        let payload = await this.userRepo.findOne({ hp: request.user.username });
        return payload;
    }

    async update(request: Request, response: Response, next: NextFunction) {
        let user = await this.userRepo.findOne({ hp: request.user.username });
        console.log("update user")
        console.log(request.body['hp']);
        let cekEmail = null;
        if (request.body['email'] !== user.email) {
            cekEmail = await this.userRepo.findOne({ email: request.body['email'] });
        }

        if (cekEmail == null) {
            user.nama = request.body['nama'];

            user.email = request.body['email'];
            let update = await this.userRepo.save(user);
            return await { msg: "OK", user: update, success: true };
        } else {
            return await { msg: "Email sudah digunakan", user: {}, success: false };
        }
    }
}