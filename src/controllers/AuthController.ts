import { getCustomRepository, IsNull, LessThan, MoreThan, Not } from "typeorm";
import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";

import { Auth } from "../entity/Auth";
import { Verify } from "../entity/Verify";

import { UserRepository } from "../repositories/UserRepository";
import { BidanRepository } from "../repositories/BidanRepository";
import { SuperUserRepository } from "../repositories/SuperUserRepository";
const jwt = require("jsonwebtoken");
const date = require("date-and-time");
const requestIp = require("request-ip");
require("dotenv").config();
const moment = require("moment");
const axios = require("axios");
const bcrypt = require("bcryptjs");

export class AuthController {
  private userRepository = getCustomRepository(UserRepository);
  private suRepository = getCustomRepository(SuperUserRepository);
  private bidanRepo = getCustomRepository(BidanRepository);
  private authRepository = getRepository(Auth);
  private verifyRepo = getRepository(Verify);

  // async aktivasi(request: Request, response: Response, next: NextFunction) {
  //     let ver = await this.verifyRepo.findOne({
  //         where: {
  //             pin: request.body['pin'],
  //             event: "aktivasi",
  //             verify: IsNull()
  //         }
  //     })
  //     if (ver != null) {
  //         let token = ""
  //         let now = new Date();
  //         ver.verify = moment(now).format("YYYY-MM-DD HH:mm:ss");
  //         this.verifyRepo.save(ver);
  //         let user = await this.userRepository.findByHp(ver.hp)
  //         if (user != null) {
  //             user.activation_date = new Date();
  //             user.status = 1;
  //             this.userRepository.save(user);
  //             const now = new Date();
  //             token = await this.generateAccessToken({ username: user.hp });
  //             let auth = {
  //                 created: now,
  //                 expired: date.addDays(now, 365),
  //                 id: user.id,
  //                 ip: requestIp.getClientIp(request),
  //                 platform: request.headers['user-agent'],
  //                 user_type: "bidan",
  //                 username: user.hp,
  //                 token: token,
  //             }
  //             await this.authRepository.save(auth);
  //             if (user.user_type == "bidan") {
  //                 let bidan = await this.bidanRepo.findByHp(ver.hp)
  //                 return { "token": token, "msg": "Aktivasi berhasil dilakukan", "user": user, "bidan": bidan, "success": true };
  //             } else {
  //                 return { "token": token, "msg": "Aktivasi berhasil dilakukan", "user": user, "success": true };
  //             }
  //         }
  //     }
  //     return { "token": "", "msg": "Kode Aktivavsi tidak ditemukan", "status": 200, "success": false, user: {} };
  // }

  // async verifylogin(request: Request, response: Response, next: NextFunction) {
  //     let ver = await this.verifyRepo.findOne({
  //         where: {
  //             pin: request.body['pin'],
  //             hp: request.body['hp'],
  //             user_type: request.body['user_type'],
  //             event: 'login',
  //             verify: IsNull()
  //         }
  //     })
  //     if (ver != null) {
  //         let token = ""
  //         let now = new Date();
  //         ver.verify = moment(now).format("YYYY-MM-DD HH:mm:ss");
  //         let user = await this.userRepository.findByHp(ver.hp)
  //         if (user != null) {
  //             const now = new Date();
  //             token = await this.generateAccessToken({ username: user.hp });
  //             let auth = {
  //                 created: now,
  //                 expired: date.addDays(now, 365),
  //                 id: user.id,
  //                 ip: requestIp.getClientIp(request),
  //                 platform: request.headers['user-agent'],
  //                 user_type: "bidan",
  //                 username: user.hp,
  //                 token: token,
  //             }
  //             await this.authRepository.save(auth);
  //             if (user.user_type == "bidan") {
  //                 let bidan = await this.bidanRepo.findByHp(ver.hp)
  //                 return { "token": token, "msg": "Aktivasi berhasil dilakukan", "user": user, "bidan": bidan, "success": true };
  //             } else {
  //                 return { "token": token, "msg": "Aktivasi berhasil dilakukan", "user": user, "success": true };
  //             }
  //         }
  //     }
  //     return { "token": "", "msg": "Kode Aktivavsi tidak ditemukan", "status": 200, "success": false, bidan: {} };
  // }

  async login(request: Request, response: Response, next: NextFunction) {
    // // Get Verify Table By Where
    // let ver = await this.verifyRepo.findOne({
    //     where: {
    //         pin: request.body['pin'],
    //         hp: request.body['hp'],
    //         user_type: request.body['user_type'],
    //         event: 'login',
    //         verify: IsNull()
    //     }
    // })

    // if (ver != null) {
    //     let token = ""
    //     let now = new Date();
    //     ver.verify = moment(now).format("YYYY-MM-DD HH:mm:ss");
    //     // User tabel search Phone Number
    //     let user = await this.userRepository.findByHp(ver.hp)
    //     if (user != null) {
    //         const now = new Date();
    //         token = await this.generateAccessToken({ username: user.hp });
    //         let auth = {
    //             created: now,
    //             expired: date.addDays(now, 365),
    //             id: user.id,
    //             ip: requestIp.getClientIp(request),
    //             platform: request.headers['user-agent'],
    //             user_type: "bidan",
    //             username: user.hp,
    //             token: token,
    //         }
    //         await this.authRepository.save(auth);
    //         if (user.user_type == "bidan") {
    //             let bidan = await this.bidanRepo.findByHp(ver.hp)
    //             return { "token": token, "msg": "Aktivasi berhasil dilakukan", "user": user, "bidan": bidan, "success": true };
    //         } else {
    //             return { "token": token, "msg": "Aktivasi berhasil dilakukan", "user": user, "success": true };
    //         }
    //     }
    // }
    // return { "token": "", "msg": "Kode Aktivavsi tidak ditemukan", "status": 200, "success": false, bidan: {} };

    const username = request.body.username;
    const password = request.body.password;

    let userFetch = await this.userRepository.findByHp(username);

    if (userFetch != null) {
      if (bcrypt.compareSync(password, userFetch.password)) {
        if (userFetch.status == 1 && userFetch.activation_date != null) {
          const now = new Date();
          const token = await this.generateAccessToken({
            username: userFetch.hp,
          });
          let auth = {
            created: now,
            expired: date.addDays(now, 365),
            id: userFetch.id,
            ip: requestIp.getClientIp(request),
            platform: request.headers["user-agent"],
            user_type: "bidan",
            username: userFetch.hp,
            token: token,
          };
          await this.authRepository.save(auth);
          if (userFetch.user_type == "bidan") {
            let bidan = await this.bidanRepo.findByHp(userFetch.hp);
            return {
              token: token,
              msg: "Berhasil Login",
              user: userFetch,
              bidan: bidan,
              success: true,
            };
          } else {
            return {
              token: token,
              msg: "Berhasil Login",
              user: userFetch,
              success: true,
            };
          }
        } else {
          return {
            token: "",
            msg: "Akun anda belum diaktivasi oleh Admin!",
            user: {},
            status: 200,
            success: false,
            bidan: {},
          };
        }
      } else {
        return {
          token: "",
          msg: "Username atau Password Salah!",
          user: {},
          status: 200,
          success: false,
          bidan: {},
        };
      }
    } else {
      return {
        token: "",
        msg: "Akun anda belum terdaftar!",
        user: {},
        status: 200,
        success: false,
        bidan: {},
      };
    }
    
    // if (userFetch != null) {
    //   const now = new Date();
    //   const token = await this.generateAccessToken({ username: userFetch.hp });
    //   let auth = {
    //     created: now,
    //     expired: date.addDays(now, 365),
    //     id: userFetch.id,
    //     ip: requestIp.getClientIp(request),
    //     platform: request.headers["user-agent"],
    //     user_type: "bidan",
    //     username: userFetch.hp,
    //     token: token,
    //   };
    //   await this.authRepository.save(auth);
    //   if (userFetch.user_type == "bidan") {
    //     let bidan = await this.bidanRepo.findByHp(userFetch.hp);
    //     return {
    //       token: token,
    //       msg: "Berhasil Login",
    //       user: userFetch,
    //       bidan: bidan,
    //       success: true,
    //     };
    //   } else {
    //     return {
    //       token: token,
    //       msg: "Berhasil Login",
    //       user: userFetch,
    //       success: true,
    //     };
    //   }
    // } else {
    //   return {
    //     token: "",
    //     msg: "Username atau Password Salah!",
    //     user: {},
    //     status: 200,
    //     success: false,
    //     bidan: {},
    //   };
    // }
  }

  async register(request: Request, response: Response, next: NextFunction) {
    const { nama, hp, password, fcm_token, alamat_detail } = request.body;

    let token = "";

    // Password Hashing
    var salt = bcrypt.genSaltSync(10);
    var hashPassword = bcrypt.hashSync(password, salt);

    // Save Data to User Tabel
    try {
      token = await this.generateAccessToken({ hp: hp });
      let now = new Date();
      let savedDataPasien = await this.userRepository.insert({
        nama: nama,
        hp: hp,
        password: hashPassword,
        email: null,
        user_type: "bidan",
        status: 0,
        fcm_token: fcm_token,
        activation_request_date: moment(now).format("YYYY-MM-DD HH:mm:ss"),
      });
      console.log(savedDataPasien);

      let savedDataBidan = await this.bidanRepo.insert({
        nama: nama,
        hp: hp,
        email: null,
        alamat_detail: alamat_detail,
        rekanan: "ibi",
      });
      console.log(savedDataBidan);

      return {
        token: token,
        msg: "Registrasi berhasil!",
        user: await this.userRepository.findOne(savedDataPasien.raw[0].id),
        status: 200,
        success: true,
        bidan: await this.bidanRepo.findByHp(hp),
      };
    } catch (error) {
      return {
        token: token,
        msg: error.detail,
        user: {},
        status: 404,
        success: false,
        bidan: {},
      };
    }
  }

  async checkToken(request: Request, response: Response, next: NextFunction) {
    if (Date.now() >= request.user.exp * 1000) {
      return {
        msg: "Token Expired, Login Ulang",
        status: 200,
        success: true,
        expired: true,
      };
    } else {
      return { msg: "OK", status: 200, success: true, expired: false };
    }
  }

  // async login(request: Request, response: Response, next: NextFunction) {
  //     let user = await this.userRepository.findByHp(request.body['hp']);
  //     if (user != null) {
  //         if (user.activation_date != null) {
  //             var otpGenerator = require('otp-generator')
  //             let verifyRepo = getRepository(Verify);
  //             let verify = new Verify();
  //             verify.pin = otpGenerator.generate(5, { alphabets: false, upperCase: false, specialChars: false });
  //             verify.hp = request.body['hp'];
  //             let now = new Date();
  //             verify.event = "login";
  //             verify.user_type = user.user_type
  //             verify.created = moment(now).format("YYYY-MM-DD HH:mm:ss");
  //             verify.expired = moment(now).add(10, 'minutes').format("YYYY-MM-DD HH:mm:ss");
  //             console.log(verify);
  //             verifyRepo.save(verify);
  //             await axios({
  //                 method: 'post',
  //                 url: 'https://api.telegram.org/bot5046326803:AAE1ItiKmTlJKU3C6TJiJoK8VEUx6dda-3E/sendMessage',
  //                 data: {
  //                     "chat_id": user.telegram_id,
  //                     "text": "Kode Akses Untuk Masuk: " + verify.pin,
  //                 },
  //                 config: { headers: { 'Content-Type': 'multipart/form-data' } },
  //             })
  //                 .then(function (response) {
  //                     console.log(response)

  //                 })
  //                 .catch(function (error) {
  //                     console.log(error)
  //                 })
  //             return { "pin": verify.pin, msg: "OK", success: true, "telegram_id": user.telegram_id };
  //         } else {
  //             return { "pin": "", msg: "NOMOR HP DITEMUKAN BELUM MELAKUKAN AKTIVASI, LAKUKAN AKTIVASI TERLEBIH DAHULU", success: false, "telegram_id": "" };
  //         }
  //     } else {
  //         return { "pin": "", msg: "NOMOR HP TIDAK DITEMUKAN", success: false, "telegram_id": "" };
  //     }

  // }

  async loginAdmin(request: Request, response: Response, next: NextFunction) {
    let user = await this.userRepository.findOne({ hp: request.body["hp"] });
    let token = "";
    if (user != null) {
      const now = new Date();
      token = await this.generateAccessToken({ hp: request.body["username"] });
      let auth = {
        created: now,
        expired: date.addDays(now, 365),
        id: user.id,
        ip: requestIp.getClientIp(request),
        platform: request.body["platform"],
        refresh_token: token,
        token: token,
        userType: "bidan",
        hp: user.hp,
      };

      return auth;
    }
    return { token: "", message: "User tidak ditemukan" };
  }

  async generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, {
      expiresIn: "180000000s",
    });
  }
}
