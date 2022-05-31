import {Controller, Get} from '@nestjs/common';
import {AppService} from './app.service';
// import {stringify} from "flatted";
// const {http, https} = require('follow-redirects');
import got from 'got';


@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get('/time')
    async getTime() {
        const data = await got.get('https://badssl.com', {}).then((res) => {
            return res.timings;
        });

        console.log(data);
        return data
    }

    @Get('/test')
    async getTest() {


        const url = require('url');
        const {https} = require('follow-redirects');
        const options = url.parse('https://nicastro.io');
        options.maxRedirects = 10;
        options.trackRedirects = (options, response, request) => {
            // Use this to adjust the request options upon redirecting,
            // to inspect the latest response headers,
            // or to cancel the request by throwing an error

            // response.headers = the redirect response headers
            // response.statusCode = the redirect response code (eg. 301, 307, etc.)

            // request.url = the requested URL that resulted in a redirect
            // request.headers = the headers in the request that resulted in a redirect
            // request.method = the method of the request that resulted in a redirect
            if (options.hostname === "example.com") {
                options.auth = "user:password";
            }
            // console.log(response)
        };

        const request = https.request(options, response => {
            console.log(response.responseUrl);
            console.log(response.socket.authorized || false)
            console.log(response.socket.authorizationError)
            console.log(response.redirects)

            // console.log('Time elapsed:', new Date().getTime() - start_time);
            // console.log(response);
            // 'http://duckduckgo.com/robots.txt'
            let data = '';
            let start1 = process.hrtime();
            response.on('data', (chunk) => {
                data = data + chunk.toString();
                console.log("datza");
            });

            response.on('end', () => {
                // const body = JSON.parse(data);
                // console.log(body);
                let elapsed1 = process.hrtime(start1)[1] / 1000000;
                console.log("Http elapsed time:", elapsed1);
            });
        });


        request.end();
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
