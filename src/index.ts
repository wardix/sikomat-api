import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
const moment = require("moment");
var cors = require("cors")
import * as bodyParser from "body-parser";
import { checkJwt } from "./middlewares/checkJwt";
import { Request, Response } from "express";
import { Routes } from "./routes";
import { BidanRepository } from "./repositories/BidanRepository";
import { UserRepository } from "./repositories/UserRepository";
var multer = require("multer")
var path = require("path");
var fs = require("fs");
const jwt = require('jsonwebtoken');
import { getCustomRepository, getRepository } from "typeorm";
import { Verify } from "./entity/Verify";
import { print } from "util";
var otpGenerator = require("otp-generator")
import { pagination } from 'typeorm-pagination'



var storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        console.log("destination")
        let u = await req.user;
        cb(null, "uploads/")
    },
    filename: async function (req, file, cb) {
        console.log(await req.body.partograf);
        console.log("filename")
        cb(null, await req.body.partograf);
    }
});

var upload = multer({ storage: storage });

createConnection().then(async connection => {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(express.json());
    app.use(cors())
    app.use(pagination);
    app.use('/public/', express.static('./public'))

    app.set("json replacer", function (key, value) {
        if (this[key] instanceof Date) {
            value = (moment(this[key])).format("YYYY-MM-DD HH:mm:ss");
        }
        if (this[key] == null) {
            value = "";
        }
        return value;
    });
    Routes.forEach(route => {
        if (!route.route.includes("/api/login") && !route.route.includes("/api/auth")
            && !route.route.includes("/api/su/auth")
            && !route.route.includes("/api/verifylogin")
            && !route.route.includes("/api/report")
            && !route.route.includes("/api/files")
            && !route.route.includes("/api/test")
            && !route.route.includes("/api/test/romawi")
            && !route.route.includes("/api/webhooks")
            && !route.route.includes("/api/aktivasi")
            && !route.route.includes("/api/server")
            && !route.route.includes("/api/share")
            && !route.route.includes("/api/public")) {
            if (!route.route.includes("/keluhan/add")) {
                (app as any)[route.method](route.route, checkJwt,
                    (req: Request, res: Response, next: Function) => {
                        const result = (new (route.controller as any))[route.action](req, res, next);
                        if (result instanceof Promise) {
                            result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

                        } else if (result !== null && result !== undefined) {
                            res.json(result);
                        }
                    });
            } else {
                (app as any)[route.method](route.route, checkJwt, upload.single("file"),
                    (req: Request, res: Response, next: Function) => {
                        const result = (new (route.controller as any))[route.action](req, res, next);
                        if (result instanceof Promise) {
                            result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

                        } else if (result !== null && result !== undefined) {
                            res.json(result);
                        }
                    });
            }
        } else {
            (app as any)[route.method](route.route,
                (req: Request, res: Response, next: Function) => {
                    const result = (new (route.controller as any))[route.action](req, res, next);
                    if (result instanceof Promise) {
                        result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

                    } else if (result !== null && result !== undefined) {
                        res.json(result);
                    }
                });
        }
    });

     app.listen(5000);
    console.log("Express server has started on port 5000");
}).catch(error => console.log(error));
