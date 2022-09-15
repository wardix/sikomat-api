import { getConnection, getCustomRepository, getRepository, IsNull, Not, Repository, Transaction, TransactionRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { BidanRepository } from "../repositories/BidanRepository";
import { Pasien } from "../entity/Pasien";
import { RiwayatPasien } from "../entity/RiwayatPasien";
import { DaftarKeluhanPasien } from "../entity/DaftarKeluhanPasien";
import { Anc } from "../entity/Anc";
import { DetailAnc } from "../entity/DetailAnc";
import { UserRepository } from "../repositories/UserRepository";
import { Skreening } from "../entity/Skreening";
import * as moment from "moment";
import { print } from "util";
var fs = require("fs");
var path = require("path");
const axios = require('axios')
const { parse, stringify } = require('roman-numerals-convert');

export class BidanController {

    private bidanRepo = getCustomRepository(BidanRepository);
    private pasienRepo = getRepository(Pasien);
    private riwayatRepo = getRepository(RiwayatPasien);
    private ancRepo = getRepository(Anc);
    private detailAncRepo = getRepository(DetailAnc);
    private userRepo = getCustomRepository(UserRepository);
    private skreeningRepo = getRepository(Skreening);



    async get(request: Request, response: Response, next: NextFunction) {
        return {};
    }

    async profile(request: Request, response: Response, next: NextFunction) {
        console.log("Call Profile");
        let payload = await this.bidanRepo.findOne({ hp: request.user.username });
        return payload;
    }

    async update(request: Request, response: Response, next: NextFunction) {
        let bidan = await this.bidanRepo.findOne({ hp: request.user.username });
        console.log("update bidan")
        console.log(request.body['hp']);
        let cekBidanEmail = null;
        if (request.body['email'] !== bidan.email) {
            cekBidanEmail = await this.bidanRepo.findOne({ email: request.body['email'] });
        }

        if (cekBidanEmail == null) {
            bidan.nama = request.body['nama'];
            bidan.alamat_peta = request.body['alamat_peta'];
            bidan.alamat_detail = request.body['alamat_detail'];
            bidan.email = request.body['email'];
            bidan.latitude = request.body['latitude'];
            bidan.longitude = request.body['longitude'];
            let updateBidan = await this.bidanRepo.save(bidan);
            return await { msg: "OK", bidan: updateBidan, success: true };
        } else {
            return await { msg: "Email sudah digunakan", bidan: {}, success: false };
        }
    }


    async list(request: Request, response: Response, next: NextFunction) {

        return []

    }

    async delete(request: Request, response: Response, next: NextFunction) {
        console.log(request.params.id);

    }

    async pasienAdd(request: Request, response: Response, next: NextFunction) {
        let bidan = await this.bidanRepo.findOne({ hp: request.user.username });
        let pasien = await this.pasienRepo.findOne({ id: request.body.id });

        if (pasien == null) {
            console.log("ADD");
            let newPasien = request.body;
            Object.keys(newPasien).forEach((k) => newPasien[k] == "" && delete newPasien[k]);
            newPasien.bidan = bidan;
            return await this.pasienRepo.save(newPasien);
        } else {
            console.log("UPDATE");
            Object.keys(request.body).forEach((k) => request.body[k] == "" && delete request.body[k]);
            Object.keys(request.body).forEach((k) => {
                if (k != 'id' && k != 'bidan') {
                    pasien[k] = request.body[k]
                }
            });
            return await this.pasienRepo.save(pasien);
        }
    }

    async pasienList(request: Request, response: Response, next: NextFunction) {
        let bidan = await this.bidanRepo.findOne({ hp: request.user.username });
        let pasien = await this.pasienRepo.find({ where: { bidan: bidan }, relations: ['riwayat', 'riwayat.daftar_keluhan_pasien', 'riwayat.kelompok_keluhan'] });
        return { "pasien": pasien };
    }


    async addAnc(request: Request, response: Response, next: NextFunction) {

        // console.log(request.body.danc);
        let anc = await this.ancRepo.findOne({ pasien: request.body.anc.pasien.id });
        // Object.keys(request.body.anc).forEach((k) => console.log(request.body.anc[k]))
        console.log(anc);
        if (anc == null) {
            Object.keys(request.body.anc).forEach((k) => (request.body.anc[k] == "" || request.body.anc[k] == null) && delete request.body.anc[k]);
            return this.ancRepo.save(request.body.anc);


        } else {
            Object.keys(request.body.anc).forEach((k) => (request.body.anc[k] == "" || request.body.anc[k] == null) && delete request.body.anc[k]);
            console.log(request.body.anc);
            anc = request.body.anc;
            return await this.ancRepo.save(anc);

        }
    }

    async addDetailAnc(request: Request, response: Response, next: NextFunction) {
        console.log(request.body.danc);
        let danc = null;
        if (request.body.danc.id) {
            danc = await this.detailAncRepo.findOne({
                where: {
                    id: request.body.danc.id
                },
                relations: ["anc", "anc.pasien", "anc.pasien.bidan"]
            });
            console.log("EDIT");

            Object.keys(request.body.danc).forEach((k) => (request.body.danc[k] == "" || request.body.danc[k] == null) && delete request.body.danc[k]);
            return this.detailAncRepo.save(request.body.danc);

        } else {
            console.log("NEW");
            danc = await this.detailAncRepo.findOne({
                where: {
                    anc: request.body.anc,
                    pemeriksaan_ke: request.body.danc.pemeriksaan_ke,
                },
                relations: ["anc", "anc.pasien", "anc.pasien.bidan"]
            });


            if (danc == null) {
                Object.keys(request.body.danc).forEach((k) => (request.body.danc[k] == "" || request.body.danc[k] == null) && delete request.body.danc[k]);
                request.body.danc.anc = request.body.anc;
                request.body.danc.tri_semester = request.body.tri_semester
                let admins = await this.userRepo.find({ where: { user_type: "admin" } });
                admins.forEach(async (user) => {
                    await axios({
                        method: 'post',
                        url: 'https://api.telegram.org/bot5046326803:AAE1ItiKmTlJKU3C6TJiJoK8VEUx6dda-3E/sendMessage',
                        data: {
                            "text": `Ada report ANC dari aplikasi bidan silahkan cek aplikasi`,
                        },
                        config: { headers: { 'Content-Type': 'multipart/form-data' } },
                    })
                        .then(function (response) {
                            console.log(response)

                        })
                        .catch(function (error) {
                            console.log(error)
                        })
                });
                await axios({
                    method: 'post',
                    headers: {
                        'Authorization': 'Bearer AAAAI3wx8u4:APA91bFAi2-jJehykzQoCw6QJ2LjYdioFjLu2Pdw_XyZcQ7HdzQYONR4ReC0tg3PTLNDUVDaNLZy9LrhzqvRy9Ovj9njCb5fLuJjasOUsGfnN9YmxnBwzprJlcQFriJ1S9da9rnAw56q'
                    },
                    url: 'https://fcm.googleapis.com/fcm/send',
                    data: {
                        "notification_type": "Nice Thoughts",
                        "to": "/topics/reportbidan",
                        "mutable-content": true,
                        "notification": {
                            "title": "Report Baru dari Bidan",
                            "body": `Ada report ANC dari aplikasi bidan, silahkan cek aplikasi`,
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
                return this.detailAncRepo.save(request.body.danc);
            }
        }





        // Object.keys(pasien).forEach((k) => pasien[k] == "" && delete pasien[k]);

        // pasien.bidan = bidan;
    }
    async getAnc(request: Request, response: Response, next: NextFunction) {
        console.log("request.params.pasien " + request.params.pasien)
        let payload = await this.ancRepo.findOne({
            where: { pasien: request.params.pasien },
            relations: ["pasien", "detail_anc", "skreening", "skreening.keluhan", "skreening.keluhan.daftar_keluhan"],
        });
        if (payload != null) {
            return { "isEmpty": false, 'item': payload };
        } else {
            return { "isEmpty": true };
        }
    }

    async riwayatPasienAdd(request: Request, response: Response, next: NextFunction) {
        let haritanggal = (moment(new Date())).format("dddd, DD MMMM YYYY");
        let tahun = (moment(new Date())).format("YY");
        let bulan = (moment(new Date())).format("MM");
        Object.keys(request.body).forEach((k) => (request.body[k] == "" || request.body[k] == null) && delete request.body[k]);
        let riwayat = request.body;

        console.log(riwayat);
        let data = await this.riwayatRepo.save(riwayat);
        data.riwayat_reg = data.id + "-RIW-" + data.pasien.id + "-" + stringify(parseInt(bulan)) + "-" + stringify(parseInt(tahun))
        return await this.riwayatRepo.save(riwayat);
    }


    async unread(request: Request, response: Response, next: NextFunction) {
        let bidan = await this.bidanRepo.findOne({ hp: request.user.username });
        console.log(bidan);
        let riwayatPasien = await this.riwayatRepo.find({
            relations: ["pasien", "kelompok_keluhan", "daftar_keluhan_pasien", 'daftar_keluhan_pasien.keluhan', 'daftar_keluhan_pasien.keluhan.daftar_keluhan'],
            where: {
                feedback_read: false,
                feedback: Not(""),
                // 'pasien.bidan.id' : bidan.id
                pasien: {
                    bidan: { id: bidan.id }
                }
            },
            order: {
                feedback_send_date: "DESC"
            }

        })
        console.log(riwayatPasien);
        return { "data": riwayatPasien };
    }

    async riwayatKeluhanPasienGet(request: Request, response: Response, next: NextFunction) {
        console.log(request.params['riwayat_pasien']);
        let riwayatPasien = await this.riwayatRepo.findOne({
            where: {
                id: request.params['riwayat_pasien']
            },
            relations: ["pasien", "kelompok_keluhan", "daftar_keluhan_pasien", 'daftar_keluhan_pasien.keluhan', 'daftar_keluhan_pasien.keluhan.daftar_keluhan'],

        })

        return riwayatPasien;
    }

    async feedbackRead(request: Request, response: Response, next: NextFunction) {
        console.log(request.params['id']);
        let riwayatPasien = await this.riwayatRepo.findOne({
            where: {
                id: request.params['id']
            },
            relations: ["pasien", "kelompok_keluhan", "daftar_keluhan_pasien", 'daftar_keluhan_pasien.keluhan', 'daftar_keluhan_pasien.keluhan.daftar_keluhan'],

        })
        riwayatPasien.feedback_read = true;
        riwayatPasien.feedback_read_date = new Date();
        this.riwayatRepo.save(riwayatPasien);
        return riwayatPasien;
    }

    async getPartograf(request: Request, response: Response, next: NextFunction) {
        var mime = {
            html: "text/html",
            pdf: "application/pdf",
            txt: "text/plain",
            css: "text/css",
            gif: "image/gif",
            jpg: "image/jpeg",
            png: "image/png",
            svg: "image/svg+xml",

        };
        var data = fs.readFileSync("./uploads/" + request.params.path);
        response.set("Content-Disposition", "inline;");
        response.set(mime);
        response.send(data);
    }

    @Transaction()
    async keluhanPasienAdd(request: Request, response: Response, next: NextFunction, @TransactionRepository(DaftarKeluhanPasien) keluhanRepo: Repository<DaftarKeluhanPasien>) {
        console.log("keluhanPasienAdd");
        console.log(await request.body);
        let data = await request.body.data;
        //let riwayat_pasien = new RiwayatPasien();

        await data.forEach(element => {
            let keluhan_pasien = new DaftarKeluhanPasien();
            keluhan_pasien.input = element.input;
            keluhan_pasien.riwayat_pasien = request.body.riwayat_pasien;
            keluhan_pasien.keluhan = element.keluhan;
            keluhanRepo.save(keluhan_pasien);
            console.log(keluhan_pasien);
        });

        let riwayatPasien = await this.riwayatRepo.findOne({
            where: {
                id: request.body.riwayat_pasien
            },
            relations: ["pasien", "pasien.bidan", "kelompok_keluhan", "daftar_keluhan_pasien", 'daftar_keluhan_pasien.keluhan', 'daftar_keluhan_pasien.keluhan.daftar_keluhan'],

        })

        let admins = await this.userRepo.find({ where: { user_type: "admin" } });
        admins.forEach(async (user) => {
            await axios({
                method: 'post',
                url: 'https://api.telegram.org/bot5046326803:AAE1ItiKmTlJKU3C6TJiJoK8VEUx6dda-3E/sendMessage',
                data: {
                    "text": `Ada report baru dari aplikasi bidan, pengirim: ${riwayatPasien.pasien.bidan.nama}, Keluhan: ${riwayatPasien.kelompok_keluhan.nama}, silahkan cek aplikasi`,
                },
                config: { headers: { 'Content-Type': 'multipart/form-data' } },
            })
                .then(function (response) {
                    console.log(response)

                })
                .catch(function (error) {
                    console.log(error)
                })
        });
        await axios({
            method: 'post',
            headers: {
                'Authorization': 'Bearer AAAAI3wx8u4:APA91bFAi2-jJehykzQoCw6QJ2LjYdioFjLu2Pdw_XyZcQ7HdzQYONR4ReC0tg3PTLNDUVDaNLZy9LrhzqvRy9Ovj9njCb5fLuJjasOUsGfnN9YmxnBwzprJlcQFriJ1S9da9rnAw56q'
            },
            url: 'https://fcm.googleapis.com/fcm/send',
            data: {
                "notification_type": "Nice Thoughts",
                "to": "/topics/reportbidan",
                "mutable-content": true,
                "data": { "riwayat_id": riwayatPasien.id },
                "notification": {
                    "title": "Report Baru dari Bidan",
                    "body": `Ada report baru dari aplikasi bidan, Pengirim:  ${riwayatPasien.pasien.bidan.nama}, Keluhan:${riwayatPasien.kelompok_keluhan.nama}`,
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

        return riwayatPasien;

    }

    async addSkreening(request: Request, response: Response, next: NextFunction) {
        console.log("skreening add");
        console.log(await request.body);
        let data = await request.body.data;
        //let riwayat_pasien = new RiwayatPasien();
        let del = await this.skreeningRepo.find({
            where: { anc: request.body.anc }
        });
        del.forEach(element => {
            this.skreeningRepo.delete(element);
        })

        await data.forEach(element => {
            let skreening = new Skreening();
            skreening.input = element.input;
            skreening.anc = request.body.anc;
            skreening.keluhan = element.keluhan;
            this.skreeningRepo.save(skreening);
            console.log(skreening);
        });

        let payload = await this.ancRepo.findOne({
            where: { id: request.body.anc.id },
            relations: ["pasien", "detail_anc", "skreening", "skreening.keluhan", "skreening.keluhan.daftar_keluhan"],
        });
        if (payload != null) {
            return { "isEmpty": false, 'item': payload };
        } else {
            return { "isEmpty": true };
        }



    }

}