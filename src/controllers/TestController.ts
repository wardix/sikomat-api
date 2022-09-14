
import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Verify } from "../entity/Verify";
const moment = require("moment");
var otpGenerator = require("otp-generator")
const { parse, stringify } = require('roman-numerals-convert');
export class TestController {
    private verifyRepo = getRepository(Verify);
    async get(request: Request, response: Response, next: NextFunction) {

        let verify = new Verify();
        verify.pin = otpGenerator.generate(5, { upperCase: false, specialChars: false, digits: true, alphabets: false });
        verify.hp = "081284586773";
        let now = new Date();
        verify.created = moment(now).format("YYYY-MM-DD HH:mm:ss");
        verify.expired = moment(now).add(10, 'minutes').format("YYYY-MM-DD HH:mm:ss");
        console.log(verify);
        this.verifyRepo.insert(verify);
        response.send("OK");
    }

    async romawi(request: Request, response: Response, next: NextFunction) {
        let tahun = (moment(new Date())).format("YYYY");
        let bulan = (moment(new Date())).format("M");
        console.log(tahun + " " + bulan);
        try {
            return { "result": await stringify(parseInt(bulan)) + "/" + await stringify(parseInt(tahun)) }
        } catch (e) {
            return { "result": "failed" }
        }
    }
}