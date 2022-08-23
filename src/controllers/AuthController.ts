import { getCustomRepository, IsNull, LessThan, MoreThan, Not } from "typeorm";
import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";

import { Auth } from "../entity/Auth";
import { Verify } from "../entity/Verify";

import { UserRepository } from "../repositories/UserRepository";
import { BidanRepository } from "../repositories/BidanRepository";
import { SuperUserRepository } from "../repositories/SuperUserRepository";
const jwt = require("jsonwebtoken");
const date = require('date-and-time')
const requestIp = require('request-ip');
require("dotenv").config();
const moment = require("moment");
const axios = require('axios')

export class AuthController {
    private userRepository = getCustomRepository(UserRepository);
    private suRepository = getCustomRepository(SuperUserRepository);
    private bidanRepo = getCustomRepository(BidanRepository);
    private authRepository = getRepository(Auth);
    private verifyRepo = getRepository(Verify);

    async aktivasi(request: Request, response: Response, next: NextFunction) {
        let ver = await this.verifyRepo.findOne({
            where: {
                pin: request.body['pin'],
                event: "aktivasi",
                verify: IsNull()
            }
        })
        if (ver != null) {
            let token = ""
            let now = new Date();
            ver.verify = moment(now).format("YYYY-MM-DD HH:mm:ss");
            this.verifyRepo.save(ver);
            let user = await this.userRepository.findByHp(ver.hp)
            if (user != null) {
                user.activation_date = new Date();
                user.status = 1;
                this.userRepository.save(user);
                const now = new Date();
                token = await this.generateAccessToken({ username: user.hp });
                let auth = {
                    created: now,
                    expired: date.addDays(now, 365),
                    id: user.id,
                    ip: requestIp.getClientIp(request),
                    platform: request.headers['user-agent'],
                    user_type: "bidan",
                    username: user.hp,
                    token: token,
                }
                await this.authRepository.save(auth);
                if (user.user_type == "bidan") {
                    let bidan = await this.bidanRepo.findByHp(ver.hp)
                    return { "token": token, "msg": "Aktivasi berhasil dilakukan", "user": user, "bidan": bidan, "success": true };
                } else {
                    return { "token": token, "msg": "Aktivasi berhasil dilakukan", "user": user, "success": true };
                }
            }
        }
        return { "token": "", "msg": "Kode Aktivavsi tidak ditemukan", "status": 200, "success": false, user: {} };
    }

    async verifylogin(request: Request, response: Response, next: NextFunction) {
        let ver = await this.verifyRepo.findOne({
            where: {
                pin: request.body['pin'],
                hp: request.body['hp'],
                user_type: request.body['user_type'],
                event: 'login',
                verify: IsNull()
            }
        })
        if (ver != null) {
            let token = ""
            let now = new Date();
            ver.verify = moment(now).format("YYYY-MM-DD HH:mm:ss");
            let user = await this.userRepository.findByHp(ver.hp)
            if (user != null) {
                const now = new Date();
                token = await this.generateAccessToken({ username: user.hp });
                let auth = {
                    created: now,
                    expired: date.addDays(now, 365),
                    id: user.id,
                    ip: requestIp.getClientIp(request),
                    platform: request.headers['user-agent'],
                    user_type: "bidan",
                    username: user.hp,
                    token: token,
                }
                await this.authRepository.save(auth);
                if (user.user_type == "bidan") {
                    let bidan = await this.bidanRepo.findByHp(ver.hp)
                    return { "token": token, "msg": "Aktivasi berhasil dilakukan", "user": user, "bidan": bidan, "success": true };
                } else {
                    return { "token": token, "msg": "Aktivasi berhasil dilakukan", "user": user, "success": true };
                }
            }
        }
        return { "token": "", "msg": "Kode Aktivavsi tidak ditemukan", "status": 200, "success": false, bidan: {} };
    }
    async checkToken(request: Request, response: Response, next: NextFunction) {
        if (Date.now() >= request.user.exp * 1000) {
            return { "msg": "Token Expired, Login Ulang", "status": 200, "success": true, expired: true };
        } else {
            return { "msg": "OK", "status": 200, "success": true, expired: false };
        }

    }

    async login(request: Request, response: Response, next: NextFunction) {
        let user = await this.userRepository.findByHp(request.body['hp']);
        if (user != null) {
            if (user.activation_date != null) {
                var otpGenerator = require('otp-generator')
                let verifyRepo = getRepository(Verify);
                let verify = new Verify();
                verify.pin = otpGenerator.generate(5, { alphabets: false, upperCase: false, specialChars: false });
                verify.hp = request.body['hp'];
                let now = new Date();
                verify.event = "login";
                verify.user_type = user.user_type
                verify.created = moment(now).format("YYYY-MM-DD HH:mm:ss");
                verify.expired = moment(now).add(10, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                console.log(verify);
                verifyRepo.save(verify);
                await axios({
                    method: 'post',
                    url: 'https://api.telegram.org/bot5046326803:AAE1ItiKmTlJKU3C6TJiJoK8VEUx6dda-3E/sendMessage',
                    data: {
                        "chat_id": user.telegram_id,
                        "text": "Kode Akses Untuk Masuk: " + verify.pin,
                    },
                    config: { headers: { 'Content-Type': 'multipart/form-data' } },
                })
                    .then(function (response) {
                        console.log(response)

                    })
                    .catch(function (error) {
                        console.log(error)
                    })
                return { "pin": verify.pin, msg: "OK", success: true, "telegram_id": user.telegram_id };
            } else {
                return { "pin": "", msg: "NOMOR HP DITEMUKAN BELUM MELAKUKAN AKTIVASI, LAKUKAN AKTIVASI TERLEBIH DAHULU", success: false, "telegram_id": "" };
            }
        } else {
            return { "pin": "", msg: "NOMOR HP TIDAK DITEMUKAN", success: false, "telegram_id": "" };
        }


    }
    async loginAdmin(request: Request, response: Response, next: NextFunction) {
        let user = await this.userRepository.findOne({ hp: request.body["hp"] })
        let token = ""
        if (user != null) {
            const now = new Date();
            token = await this.generateAccessToken({ hp: request.body["username"] });
            let auth = {
                created: now, expired: date.addDays(now, 365),
                id: user.id, ip: requestIp.getClientIp(request),
                platform: request.body["platform"],
                refresh_token: token,
                token: token,
                userType: "bidan",
                hp: user.hp
            }

            return auth;
        }
        return { "token": "", "message": "User tidak ditemukan" };
    }

    async generateAccessToken(username) {
        return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "180000000s" });
    }
}