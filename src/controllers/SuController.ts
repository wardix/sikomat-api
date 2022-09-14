import { Equal, getCustomRepository, getRepository, IsNull, Like, Not, Repository, Transaction, TransactionRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { Pasien } from "../entity/Pasien";
import { RiwayatPasien } from "../entity/RiwayatPasien";
import { DaftarKeluhanPasien } from "../entity/DaftarKeluhanPasien";
import { BidanRepository } from "../repositories/BidanRepository";
import { isNull } from "util";
import { Anc } from "../entity/Anc";
import { SuperUserRepository } from "../repositories/SuperUserRepository";
import { User } from "../entity/User";
var fs = require("fs");
var path = require("path");
const jwt = require("jsonwebtoken");
const date = require('date-and-time')
const requestIp = require('request-ip');
require("dotenv").config();
const moment = require("moment");
const axios = require('axios')
export class SuController {
    private suRepository = getCustomRepository(SuperUserRepository);
    private bidanRepo = getCustomRepository(BidanRepository);
    private userRepo = getCustomRepository(UserRepository);
    async generateAccessToken(username) {
        return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "180000000s" });
    }
    private riwayatRepo = getRepository(RiwayatPasien);

    async auth(request: Request, response: Response, next: NextFunction) {
        let su = await this.suRepository.findByUsernamePassword(request.body["username"], request.body["password"])
        let token = ""
        if (su != null) {
            const now = new Date();
            token = await this.generateAccessToken({ username: request.body["username"] });
            let auth = {
                created: now, expired: date.addDays(now, 365),
                refresh_token: token,
                token: token,
                userType: su.user_type,
                username: su.username
            }

            return auth;
        }
        return { "token": "", "message": "User tidak ditemukan" };
    }

    async getAllBidan(request: Request, response: Response, next: NextFunction) {
        let su = await this.suRepository.findOne({
            "username": request.user.username
        });
        console.log(su);
        let data = {}
        let keyword = request.query['keyword'];
        if (request.query['keyword']) {
            console.log(request.query['keyword']);
            data = await this.bidanRepo.createQueryBuilder('bidan')
                .where("(hp ilike :keyword or nama ilike :keyword) and rekanan = :rekanan ", { keyword: `%${keyword}%`, rekanan: su.user_type })
                .paginate();
            console.log(this.bidanRepo.createQueryBuilder('bidan')
                .where("(hp ilike :keyword or nama ilike :keyword) and rekanan = :rekanan ", { keyword: `%${keyword}%`, rekanan: su.user_type })
                .getSql())
        } else {
            data = await this.bidanRepo.createQueryBuilder('bidan').where("rekanan = :rekanan ", { rekanan: su.user_type })
                .paginate();
        }
        return { "page": data };
    }

    async saveBidan(request: Request, response: Response, next: NextFunction) {
        let su = await this.suRepository.findOne({
            "username": request.user.username
        });
        console.log(await request.body['id']);

        if (await request.body['id']) {
            console.log("UPDATE")
            let bidan = await this.bidanRepo.findOne({ id: request.body['id'] })

            console.log(bidan);

            if (bidan.hp == request.body['hp']) {
                // Object.keys(request.body).forEach((k) => request.body[k] == "" && delete request.body[k]);
                // bidan = request.body;
                console.log("UPDATE HP SAMA")
                bidan.email = request.body['email'];
                bidan.nama = request.body['nama'];
                bidan.hp = request.body['hp'];
                bidan.alamat_detail = request.body['alamat_detail'];
                bidan.alamat_peta = request.body['alamat_peta'];
                console.log(bidan);

                return { "action_status": "success", "item": await this.bidanRepo.save(bidan), "message": "" };
            } else {
                console.log("UPDATE HP BEDA")
                let bidan_check = await this.bidanRepo.find({
                    where: [{ hp: await request.body['hp'] }]
                });
                let user_check = await this.userRepo.find({
                    where: [{ hp: await request.body['hp'] }]
                });
                if (bidan_check.length == 0 && user_check.length == 0) {
                    console.log("HP FOUND")
                    console.log(request.body)
                    let user = await this.userRepo.findOne({ hp: bidan.hp })
                    //Object.keys(request.body).forEach((k) => request.body[k] == "" && delete request.body[k]);
                    bidan.nama = request.body['nama'];
                    bidan.email = request.body['email'];
                    bidan.hp = request.body['hp'];
                    bidan.alamat_detail = request.body['alamat_detail'];
                    bidan.alamat_peta = request.body['alamat_peta'];

                    user.hp = bidan.hp
                    user.nama = bidan.nama
                    this.userRepo.save(user)
                    return { "action_status": "success", "item": await this.bidanRepo.save(bidan), "message": "" };
                } else {
                    return { "action_status": "warn", "item": "", "message": "Bidan dengan email atau nomor hp sudah ada" };
                }
            }

        } else {
            let bidan_check = await this.bidanRepo.find({
                where: [{ hp: await request.body['hp'] }]
            });
            let user_check = await this.userRepo.find({
                where: [{ hp: await request.body['hp'] }]
            });
            console.log(bidan_check);
            if (bidan_check.length == 0 && user_check.length == 0) {
                console.log("ADD");
                let newBidan = await request.body;
                newBidan.rekanan = su.user_type
                let newUser = new User()
                newUser.hp = newBidan.hp
                newUser.user_type = "bidan"
                newUser.nama = newBidan.nama
                this.userRepo.save(newUser)
                Object.keys(newBidan).forEach((k) => newBidan[k] == "" && delete newBidan[k]);
                return { "action_status": "success", "item": await this.bidanRepo.save(newBidan), "message": "" };
            } else {
                return { "action_status": "warn", "item": "", "message": "Bidan dengan email atau nomor hp sudah ada" };
            }
        }
    }

    async deleteBidan(request: Request, response: Response, next: NextFunction) {
        let su = await this.suRepository.findOne({
            "username": request.user.username
        });
        let bidan = await this.bidanRepo.findOne({ id: await request.params['id'] })

        if (await this.bidanRepo.delete(bidan.id)) {
            let user = await this.userRepo.findOne({ hp: bidan.hp })
            await this.userRepo.delete(user.id);
            return { "action_status": "success", "item": bidan, "message": "" };
        } else {
            return { "action_status": "failed", "item": bidan, "message": "Data Tidak dapat dihapus karena bidan sudah melakukan aktivitas" };
        }
    }

    async getAllSpesialis(request: Request, response: Response, next: NextFunction) {
        let su = await this.suRepository.findOne({
            "username": request.user.username
        });
        console.log(su);
        let data = {}
        let keyword = request.query['keyword'];
        if (request.query['keyword']) {
            console.log(request.query['keyword']);
            data = await this.userRepo.createQueryBuilder('user')
                .where("(hp ilike :keyword or nama ilike :keyword) and user_type=:user_type", { keyword: `%${keyword}%`, user_type: 'admin' })
                .paginate();

        } else {
            data = await this.userRepo.createQueryBuilder('user').where("user_type= :user_type", { user_type: "admin" })
                .paginate();
        }
        return { "page": data };
    }

    async saveSpesialis(request: Request, response: Response, next: NextFunction) {
        let su = await this.suRepository.findOne({
            "username": request.user.username
        });
        console.log(await request.body['id']);

        if (await request.body['id']) {
            console.log("UPDATE")
            let user = await this.userRepo.findOne({ id: request.body['id'] })

            console.log(user);

            if (user.email == request.body['email'] && user.hp == request.body['hp']) {
                Object.keys(request.body).forEach((k) => request.body[k] == "" && delete request.body[k]);
                user = request.body;
                return { "action_status": "success", "item": await this.userRepo.save(user), "message": "" };
            } else {
                let user_check = await this.userRepo.find({
                    where: [{ hp: await request.body['hp'], email: await request.body['email'] }]
                });
                if (user_check.length == 0) {
                    Object.keys(request.body).forEach((k) => request.body[k] == "" && delete request.body[k]);
                    user = request.body;
                    return { "action_status": "success", "item": await this.userRepo.save(user), "message": "" };
                } else {
                    return { "action_status": "warn", "item": "", "message": "Spesialis dengan email atau nomor hp sudah ada" };
                }
            }

        } else {

            let user_check = await this.userRepo.find({
                where: [{ hp: await request.body['hp'], email: await request.body['email'] }]
            });
            if (user_check.length == 0) {
                console.log("ADD");

                let newUser = request.body
                newUser.user_type = "admin"
                Object.keys(newUser).forEach((k) => newUser[k] == "" && delete newUser[k]);

                return { "action_status": "success", "item": await this.userRepo.save(newUser), "message": "" };
            } else {
                return { "action_status": "warn", "item": "", "message": "Spesialis dengan email atau nomor hp sudah ada" };
            }
        }
    }

    async deleteSpesialis(request: Request, response: Response, next: NextFunction) {
        let user = await this.userRepo.findOne({ id: await request.params['id'] })
        if (await this.userRepo.delete(user)) {

            return { "action_status": "success", "item": user, "message": "" };
        } else {
            return { "action_status": "failed", "item": user, "message": "Data Tidak dapat dihapus karena bidan sudah melakukan aktivitas" };
        }
    }

    // async riwayat(request: Request, response: Response, next: NextFunction) {
    //     let su = await this.suRepository.findOne({
    //         "username": request.user.username
    //     });
    //     let data = await this.riwayatRepo.find({

    //         relations: ["pasien", "pasien.bidan", "kelompok_keluhan", "daftar_keluhan_pasien", 'daftar_keluhan_pasien.keluhan', 'daftar_keluhan_pasien.keluhan.daftar_keluhan'],
    //         where: {
    //             pasien: {
    //                 bidan: { rekanan: su.user_type }
    //             }
    //         },
    //         order: {
    //             tanggal_periksa: "DESC",
    //         },
    //     })
    //     return { "riwayat_pasien": data };
    // }

    async riwayat(request: Request, response: Response, next: NextFunction) {
        let su = await this.suRepository.findOne({
            "username": request.user.username
        });
        let keyword = request.query['keyword'];
        let data = {}
        console.log(su);
        if (request.query['keyword']) {
            data = await this.riwayatRepo.createQueryBuilder('riwayat_pasien')
                .innerJoinAndSelect("riwayat_pasien.pasien", "pasien")
                .innerJoinAndSelect("pasien.bidan", "bidan")
                .innerJoinAndSelect("riwayat_pasien.kelompok_keluhan", "kelompok_keluhan")
                .where("pasien.nama ilike :keyword or bidan.nama ilike :keyword or bidan.nama ilike :keyword or bidan.hp ilike :keyword", { keyword: `%${keyword}%` })
                .paginate();
        } else {
            data = await this.riwayatRepo.createQueryBuilder('riwayat_pasien')
                .innerJoinAndSelect("riwayat_pasien.pasien", "pasien")
                .innerJoinAndSelect("pasien.bidan", "bidan")
                .innerJoinAndSelect("riwayat_pasien.kelompok_keluhan", "kelompok_keluhan")
                .paginate();
        }

        return { "page": data };
    }
}