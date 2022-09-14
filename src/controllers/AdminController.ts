import { Equal, getCustomRepository, getRepository, IsNull, Like, Not, Repository, Transaction, TransactionRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { Pasien } from "../entity/Pasien";
import { RiwayatPasien } from "../entity/RiwayatPasien";
import { DaftarKeluhanPasien } from "../entity/DaftarKeluhanPasien";
import { BidanRepository } from "../repositories/BidanRepository";
import { isNull } from "util";
import { Anc } from "../entity/Anc";
var fs = require("fs");
var path = require("path");
const axios = require('axios')

export class AdminController {

    // private bidanRepo = getCustomRepository(BidanRepository);
    private bidanRepo = getCustomRepository(BidanRepository);
    private riwayatRepo = getRepository(RiwayatPasien);
    private ancRepo = getRepository(Anc);
    private userRepo = getCustomRepository(UserRepository);


    async incoming(request: Request, response: Response, next: NextFunction) {
        let data = await this.riwayatRepo.find({
            where: {
                feedback_admin: ""
            },
            relations: ["pasien", "pasien.bidan", "kelompok_keluhan", "daftar_keluhan_pasien", 'daftar_keluhan_pasien.keluhan', 'daftar_keluhan_pasien.keluhan.daftar_keluhan'],
            order: {
                tanggal_periksa: "DESC",
            },

        })
        return { "riwayat_pasien": data };
    }

    async feedback(request: Request, response: Response, next: NextFunction) {
        let admin = await this.userRepo.findByHp(request.user.username);
        let data = await this.riwayatRepo.findOne({
            where: {
                id: request.body.id,
            },
            relations: ["pasien", "pasien.bidan", "kelompok_keluhan"],
        })
        data.feedback = request.body.feedback
        data.feedback_admin = admin.nama
        data.admin_read = true;
        data.admin_hp = admin.hp;
        data.admin_read_date = new Date();
        data.feedback_send_date = new Date();
        if (await this.riwayatRepo.save(data)) {
            let user = await this.userRepo.findOne({ hp: data.pasien.bidan.hp });
            await axios({
                method: 'post',
                url: 'https://api.telegram.org/bot5046326803:AAE1ItiKmTlJKU3C6TJiJoK8VEUx6dda-3E/sendMessage',
                data: {
                    "text": `Feedback dari admin untuk pasien : ${data.pasien.nama}, Keluhan: ${data.kelompok_keluhan.nama}, silahkan cek aplikasi`,
                },
                config: { headers: { 'Content-Type': 'multipart/form-data' } },
            })
                .then(function (response) {
                    console.log(response)

                })
                .catch(function (error) {
                    console.log(error)
                });


            await axios({
                method: 'post',
                headers: {
                    'Authorization': 'Bearer AAAAI3wx8u4:APA91bFAi2-jJehykzQoCw6QJ2LjYdioFjLu2Pdw_XyZcQ7HdzQYONR4ReC0tg3PTLNDUVDaNLZy9LrhzqvRy9Ovj9njCb5fLuJjasOUsGfnN9YmxnBwzprJlcQFriJ1S9da9rnAw56q'
                },
                url: 'https://fcm.googleapis.com/fcm/send',
                data: {
                    "notification_type": "Nice Thoughts",
                    "to": user.fcm_token,
                    "mutable-content": true,
                    "data": { "riwayat_id": data.id },
                    "notification": {
                        "title": "Report Baru dari Bidan",
                        "body": `Feedback dari admin untuk pasien : ${data.pasien.nama}, Keluhan: ${data.kelompok_keluhan.nama}, silahkan cek aplikasi`,
                        "click_action": "FLUTTER_NOTIFICATION_CLICK",
                    }
                },
                config: { headers: { 'Content-Type': 'multipart/form-data' } },
            })
                .then(function (response) {
                    console.log(response)

                })
                .catch(function (error) {
                    console.log(error)
                })
            return { "success": true };

        } else {
            return { "success": false };
        }
    }

    async feedback_anc(request: Request, response: Response, next: NextFunction) {
        let admin = await this.userRepo.findByHp(request.user.username);
        let data = await this.ancRepo.findOne({
            where: {
                id: request.body.id,
            },
            relations: ["pasien", "pasien.bidan"],
        })
        data.feedback = request.body.feedback
        data.feedback_admin = admin.nama
        data.admin_hp = admin.hp;
        data.feedback_send_date = new Date();
        if (await this.ancRepo.save(data)) {
            let user = await this.userRepo.findOne({ hp: data.pasien.bidan.hp });
            await axios({
                method: 'post',
                url: 'https://api.telegram.org/bot5046326803:AAE1ItiKmTlJKU3C6TJiJoK8VEUx6dda-3E/sendMessage',
                data: {
                    "text": `Feedback ANC dari admin untuk pasien : ${data.pasien.nama}, silahkan cek aplikasi`,
                },
                config: { headers: { 'Content-Type': 'multipart/form-data' } },
            })
                .then(function (response) {
                    console.log(response)

                })
                .catch(function (error) {
                    console.log(error)
                });


            await axios({
                method: 'post',
                headers: {
                    'Authorization': 'Bearer AAAAI3wx8u4:APA91bFAi2-jJehykzQoCw6QJ2LjYdioFjLu2Pdw_XyZcQ7HdzQYONR4ReC0tg3PTLNDUVDaNLZy9LrhzqvRy9Ovj9njCb5fLuJjasOUsGfnN9YmxnBwzprJlcQFriJ1S9da9rnAw56q'
                },
                url: 'https://fcm.googleapis.com/fcm/send',
                data: {
                    "notification_type": "Nice Thoughts",
                    "to": user.fcm_token,
                    "mutable-content": true,
                    "data": { "riwayat_id": data.id },
                    "notification": {
                        "title": "Report Baru dari Bidan",
                        "body": `Feedback anc dari admin untuk pasien : ${data.pasien.nama}, silahkan cek aplikasi`,
                        "click_action": "FLUTTER_NOTIFICATION_CLICK",
                    }
                },
                config: { headers: { 'Content-Type': 'multipart/form-data' } },
            })
                .then(function (response) {
                    console.log(response)

                })
                .catch(function (error) {
                    console.log(error)
                })
            return { "success": true };

        } else {
            return { "success": false };
        }
    }

    async riwayat(request: Request, response: Response, next: NextFunction) {
        let data = await this.riwayatRepo.find({
            where: { feedback_admin: Not("") }, order: {
                tanggal_periksa: "DESC",

            },
            relations: ["pasien", "pasien.bidan", "kelompok_keluhan", "daftar_keluhan_pasien", 'daftar_keluhan_pasien.keluhan', 'daftar_keluhan_pasien.keluhan.daftar_keluhan'],
        })
        return { "riwayat_pasien": data };
    }

    async allbidan(request: Request, response: Response, next: NextFunction) {

        let data = {}
        if (request.query['keyword']) {
            console.log(request.query['keyword']);
            data = await this.bidanRepo.createQueryBuilder('bidan').leftJoinAndSelect("bidan.pasien", "pasien")
                .where("bidan.hp ilike :keyword or bidan.nama ilike :keyword", { keyword: `%${request.query['keyword']}%` })
                .paginate();
        } else {
            data = await this.bidanRepo.createQueryBuilder('bidan')
                .paginate();
        }
        return { "page": data };
    }

    async anc(request: Request, response: Response, next: NextFunction) {
        // let data = await this.ancRepo.find({
        //     relations: ["pasien", "pasien.bidan", "detail_anc", "skreening"],
        //     order: {
        //         taksiran_persalinan: "DESC"
        //     }
        // })
        let data = await this.ancRepo.createQueryBuilder('anc')
            .innerJoinAndSelect("anc.pasien", "pasien")
            .innerJoinAndSelect("anc.skreening", "skreening")
            .innerJoinAndSelect("anc.detail_anc", "detail_anc")
            .innerJoinAndSelect("pasien.bidan", "bidan")
            .innerJoinAndSelect("skreening.keluhan", "keluhan")
            .innerJoinAndSelect("keluhan.daftar_keluhan", "daftar_keluhan")
            .paginate();
        return { "page": data };
    }

    async findbidan(request: Request, response: Response, next: NextFunction) {
        let bidan = {}
        if (request.query['keyword']) {
            bidan = await this.bidanRepo.createQueryBuilder('user').where("hp ilike :keyword or nama ilike :keyword", { keyword: `%${request.query['keyword']}%` })
                .paginate();
        } else {
            bidan = await this.bidanRepo.createQueryBuilder('user')
                .paginate();
        }

        return { "data": bidan };
    }

    async stats(request: Request, response: Response, next: NextFunction) {


    }
}