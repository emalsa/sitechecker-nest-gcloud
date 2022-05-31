import {Controller, Get} from '@nestjs/common';
import {AppService} from './app.service';
import {stringify} from "flatted";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get('/test')
    async getTest() {
        const https = require('https');
        const validator = require('validator');

        const getDaysBetween = (validFrom, validTo) => {
            return Math.round(Math.abs(+validFrom - +validTo) / 8.64e7);
        };

        const getDaysRemaining = (validFrom, validTo) => {
            const daysRemaining = getDaysBetween(validFrom, validTo);
            if (new Date(validTo).getTime() < new Date().getTime()) {
                return -daysRemaining;
            }
            return daysRemaining;
        };

        const getSSLCertificateInfo = host => {
            console.log('Start a')
            console.log(host);
            if (!validator.isFQDN(host)) {
                console.log('IF')
                // return Promise.reject(new Error('Invalid host.'));
            }

            console.log('Option start')
            let postData = JSON.stringify({
                'body': 'Hello World!'
            });
            const options = {
                agent: false,
                method: 'POST',
                port: 443,
                rejectUnauthorized: false,
                host: host,
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": postData.length,
                },
                // path: '/questions/72451778/azure-devops-pipeline-get-modified-or-added-files-only',
            };

            console.log('Option end')

            return new Promise((resolve, reject) => {
                console.log('Promise start 1')
                try {
                    console.log('Promise start 2')
                    const req = https.request(options, res => {
                        const crt = res.connection.getPeerCertificate(),
                            vFrom = crt.valid_from, vTo = crt.valid_to;
                        let validTo = new Date(vTo);
                        res.setEncoding('utf8');
                        res.on('data', function (chunk) {
                            console.log('Response: ' + chunk);
                        });
                        resolve({
                            test: res,
                            daysRemaining: getDaysRemaining(new Date(), validTo),

                            test1: res.socket.authorizationError,
                            valid: res.socket.authorized || false,
                            validFrom: new Date(vFrom).toISOString(),
                            validTo: validTo.toISOString(),
                            responseCode: res.statusCode,
                            headers: res.headers
                        });
                    });
                    req.on('error', reject);
                    req.write(postData);
                    req.end();
                } catch (e) {
                    reject(e);
                }
            });
        };


        async function checkCertificateValidity(host) {
            let res;
            console.log(host)
            try {
                // @ts-ignore
                console.log(host)
                res = await getSSLCertificateInfo(host);
                // console.log(JSON.stringify(res))
                return res;
                // @ts-ignore
                // if(res.daysRemaining <= 0 || !res.valid) {
                //     isValid = false;
                // }
            } catch (err) {
                res = err
            }

            return res;
        }


        // return checkCertificateValidity('stackoverflow.com')

        const aa = checkCertificateValidity('www.nicastro.io')
            .then((response) => {
                console.log('SUCCESS')
                console.log(response)
                return response

            })
            .catch((err) => {
                console.log('ERROR')
                console.log(err)
            })
        return JSON.stringify(aa)
    }

    @Get()
    getHello() {


        return this.appService.getHello()
            .then((response) => {
                return response;
            })
            .catch((errorResponse) => {
                console.log(errorResponse)
                return errorResponse
            });
    }
}
