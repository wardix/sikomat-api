import { NextFunction, Request, Response } from "express";
import { KelompokKeluhan } from "../entity/KelompokKeluhan";
import { Keluhan } from "../entity/Keluhan";
import { getRepository } from "typeorm";
import { Hotline } from "../entity/Hotline";
var path = require("path");
export class RefController {

    private kelompoRepo = getRepository(KelompokKeluhan);
    private keluhanRepo = getRepository(Keluhan);
    private hotlineRepo = getRepository(Hotline);



    async kelompokKeluhan(request: Request, response: Response, next: NextFunction) {
        return { "kelompok_keluhan": await this.kelompoRepo.find({ order: { urutan: 'ASC' } }) };
    }

    async hotline(request: Request, response: Response, next: NextFunction) {
        return { "hotline": await this.hotlineRepo.find() };
    }


    async keluhan(request: Request, response: Response, next: NextFunction) {
        return await {
            "keluhan": await this.keluhanRepo.find({
                relations: ["kelompok_keluhan", "daftar_keluhan"],
                where: { kelompok_keluhan: request.params.kelompok_keluhan },
                order: { urutan: 'ASC' }
            })
        };
    }

}