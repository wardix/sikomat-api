import { getCustomRepository, getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";

import * as moment from "moment";
import "moment/locale/id";
import { RiwayatPasien } from "../entity/RiwayatPasien";
import { BidanRepository } from "../repositories/BidanRepository";

let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
var fs = require("fs");
var qr = require("qr-image");
var { AgeCalculator } = require("@dipaktelangre/age-calculator"); // undefined

export class ReportController {

    private riwayatRepo = getRepository(RiwayatPasien);
    private bidanRepo = getCustomRepository(BidanRepository);

    async qr(request: Request, response: Response, next: NextFunction) {
        var code = qr.image(request.params["text"], { type: "png", ec_level: "H", size: 10, margin: 0 });
        response.type("png");
        code.pipe(response);
    }

    async riwayatKeluhanPasienReport(request: Request, response: Response, next: NextFunction) {

        let riwayatPasien = await this.riwayatRepo.findOne({
            where: {
                id: request.params['riwayat_pasien']
            },
            relations: ["pasien", "pasien.bidan", "kelompok_keluhan", "daftar_keluhan_pasien", 'daftar_keluhan_pasien.keluhan', 'daftar_keluhan_pasien.keluhan.daftar_keluhan'],

        })
        let bidan = riwayatPasien.pasien.bidan;

        let url_document = "/api/report/qr/" + riwayatPasien.riwayat_reg;
        let host = process.env.HOST;
        let usia = AgeCalculator.getAge(new Date(riwayatPasien.pasien.tanggal_lahir));
        console.log(usia);
        console.log(url_document);
        await ejs.renderFile(path.join(__dirname, "../ejs/", "reportpasien.ejs"), {
            data: riwayatPasien,
            bidan: bidan,
            logo: '/public/img/sikomat.png',
            moment: moment,
            usia: usia,
            host: host,
            url_document: url_document
        }, (err, data) => {
            if (err) {
                return response.json({ "failed": true });
            } else {
                let options = {
                    "height": "13.25in",
                    "width": "8.5in",
                    "header": {
                        "height": "20mm"
                    },
                    "footer": {
                        "height": "20mm",
                    },
                };

                pdf.create(data, options).toFile("./protected/pasien/" + riwayatPasien.id + ".pdf", function (err, data) {
                    if (err) {
                        console.log("ERROR");
                        return response.json({ "failed": true });
                    } else {
                        // console.log("NOT ERROR");
                        // response.contentType("application/pdf");
                        // //return response.json({ "failed": false });
                        // return response.send(data);
                        var data = fs.readFileSync("./protected/pasien/" + riwayatPasien.id + ".pdf");
                        response.contentType("application/pdf");
                        response.send(data);
                    }
                });
            }

        });
    }


}
