import { getCustomRepository, getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";

import * as moment from "moment";
import "moment/locale/id";
import { getManager } from "typeorm";
import { RiwayatPasien } from "../entity/RiwayatPasien";
import { BidanRepository } from "../repositories/BidanRepository";


let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
var fs = require("fs");
var qr = require("qr-image");

export class StatistikController {
    private bidanRepo = getCustomRepository(BidanRepository);
    private riwayatRepo = getRepository(RiwayatPasien);

    async stats(request: Request, response: Response, next: NextFunction) {
        let hariini = (moment(new Date())).format("YYYY-MM-DD HH:mm:ss");
        let haritanggal = (moment(new Date())).format("dddd, DD MMMM YYYY");
        let bulantahun = (moment(new Date())).format("MMMM YYYY");
        let tahun = (moment(new Date())).format("YYYY");
        const { jumlah_bidan } = await this.bidanRepo
            .createQueryBuilder("bidan")
            .select("COUNT(*)", "jumlah_bidan")
            .getRawOne()
        const riwayat_per_hari = await this.riwayatRepo
            .createQueryBuilder("riwayat_pasien")
            .select("TO_CHAR(tanggal_periksa, 'dd') AS tanggal")
            .addSelect("COUNT(*)", "riwayat_per_hari")
            .groupBy("TO_CHAR(tanggal_periksa, 'dd')")
            .addOrderBy(
                "TO_CHAR(tanggal_periksa, 'dd')"
            )
            .getRawMany()
        const { jumlah_hari_ini } = await this.riwayatRepo
            .createQueryBuilder("bidan")
            .select("COUNT(*)", "jumlah_hari_ini")
            .where({ tanggal_periksa: hariini.slice(0, 10) })
            .getRawOne()
        const riwayat_per_bulan = await this.riwayatRepo
            .createQueryBuilder("riwayat_pasien")
            .select("TO_CHAR(tanggal_periksa, 'yyyy') AS year,TO_CHAR(tanggal_periksa, 'month') AS bulan")
            .addSelect("COUNT(*)", "riwayat_per_bulan")
            .groupBy("TO_CHAR(tanggal_periksa, 'yyyy'), TO_CHAR(tanggal_periksa, 'month')")
            .getRawMany()
        const topKelompokKeluhan = await this.riwayatRepo
            .createQueryBuilder("riwayat_pasien")
            .innerJoinAndSelect("kelompok_keluhan", "kelompok_keluhan", "riwayat_pasien.kelompok_keluhan = kelompok_keluhan.id")
            .select("kelompok_keluhan.nama")
            .addSelect("COUNT(*)", "topKelompokKeluhan")
            .groupBy("kelompok_keluhan.nama")
            .addOrderBy(
                "COUNT(*)", "DESC"
            )
            .getRawMany()
        return {
            "jumlah_bidan": jumlah_bidan,
            "riwayat_per_hari": riwayat_per_hari,
            "riwayat_per_bulan": riwayat_per_bulan,
            "hariini": hariini,
            "haritanggal": haritanggal,
            "bulantahun": bulantahun,
            "tahun": tahun,
            "jumlah_hari_ini": jumlah_hari_ini,
            "topKelompokKeluhan": topKelompokKeluhan
        };
    }
}
