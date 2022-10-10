const dotenv = require("dotenv");
const OnionRedisCall = require('nodejs-onion-redis-call');

dotenv.config();

const mutexService = new OnionRedisCall(
    process.env.ONION_REDIS_URI,
    undefined,
    (error) => {
        if (error) {
            console.log(error);
            return;
        }
        mutexService.provide("Lock", (arguments, next) => {
            const name = arguments.name;
            const key = arguments.key;
            if (name && key) {

            }
            next(true);
        });
        mutexService.provide("Unlock", (arguments, next) => {
            const name = arguments.name;
            const key = arguments.key;
            if (name && key) {

            }
            next(true);
        });
    }).Namespace(process.env.ONION_REDIS_NAMESPACE).Class("Mutex");
g