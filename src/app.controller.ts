import {Controller, Get} from '@nestjs/common';
import {AppService} from './app.service';
// import {stringify} from "flatted";

// const {http, https} = require('follow-redirects');

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get('/test')
    async getTest() {
        const url = require('url');
        const {http, https} = require('follow-redirects');

        const options = url.parse('http://tinyurl.com/2p95z4n4');
        console.log(options)
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

        const request = http.request(options, response => {
            console.log(response.responseUrl);
            console.log(response.socket.authorized || false)
            console.log(response.socket.authorizationError)
            console.log(response.redirects)

            console.log( response.elapsedTime);
            // 'http://duckduckgo.com/robots.txt'

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
