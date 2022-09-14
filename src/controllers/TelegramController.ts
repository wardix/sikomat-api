
import { NextFunction, Request, Response } from "express";
const axios = require("axios");


export class TelegramController {

    async webhooks(request: Request, response: Response, next: NextFunction) {
        //console.log(request.body)
        console.log(request.body['message']);
        console.log(typeof request.body['message']['contact']);
        if (typeof request.body['message']['contact'] === 'undefined') {
            console.log(request.body['message']['text']);
            if (request.body['message']['text'] == "/start") {
                console.log("START COMMAND");
                if (request.body['message']['chat']['type'] != "group") {
                    var data = {
                        "chat_id": request.body['message']['from']['id'],
                        "text": "Silahkan Verifikasi Nomor Handphone",
                        "parse_mode": "Markdown",
                        "reply_markup": {
                            "one_time_keyboard": true,
                            "keyboard": [
                                [{
                                    text: "Verifikasi Kontak",
                                    request_contact: true,
                                    one_time_keyboard: true
                                }],
                            ]
                        }
                    }
                    this.sendMessage(data);
                }
            }
            else if (typeof request.body['message']['contact'] !== 'undefined') {
                let hp = request.body['message']['contact']['phone_number'];
                console.log(hp.replace("62", "0").replace("+62", "0"));
                let data = {
                    "chat_id": request.body['message']['from']['id'],
                    "text": "OK",

                }
                this.sendMessage(data);

            }
            else {
                console.log("NOT BOOTH");
            }


        }
    }

    async sendMessage(data) {
        try {
            let url = 'https://api.telegram.org/bot5046326803:AAE1ItiKmTlJKU3C6TJiJoK8VEUx6dda-3E/sendMessage';
            return axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(resp => resp)

        }
        catch (error) {
            console.log(error);
        }
    }
}
