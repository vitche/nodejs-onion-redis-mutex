const dotenv = require("dotenv");
const OnionRedisCall = require("nodejs-onion-redis-call");

dotenv.config();

const mutexClient = new OnionRedisCall(
    process.env.ONION_REDIS_URI,
    undefined,
    (error) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log(`${process.env.ONION_REDIS_NAMESPACE}.Mutex connected to ${process.env.ONION_REDIS_URI}`);
        mutexClient.consume('Lock', {
            name: "test", key: ":)"
        }, (result) => {
            console.log("First lock", result);
            mutexClient.consume('Unlock', {
                name: "test", key: ":)"
            }, (result) => {
                console.log("Unlock", result);
                mutexClient.consume('Lock', {
                    name: "test", key: ":("
                }, (result) => {
                    console.log("Second lock", result);
                });
            });
        });

    }).Namespace(process.env.ONION_REDIS_NAMESPACE).Class("Mutex");
