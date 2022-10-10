const OnionRedisCall = require("nodejs-onion-redis-call");
const instances = {};
module.exports = {
    Factory: function () {
        const mutexService = new OnionRedisCall(
            process.env.ONION_REDIS_URI,
            undefined,
            (error) => {
                if (error) {
                    console.log(error);
                    return;
                }
                console.log(`${process.env.ONION_REDIS_NAMESPACE}.Mutex connected to ${process.env.ONION_REDIS_URI}`);
                mutexService.provide("Lock", (arguments, next) => {
                    const name = arguments.name;
                    const key = arguments.key;
                    if (name && key) {
                        if (instances["name"] === key) {
                            // Locked by the same instance (reentrancy)
                            next(true);
                        } else if (instances["name"]) {
                            // Locked by another instance
                            next(false);
                        } else {
                            // Lock
                            instances["name"] = key;

                            // Not locked
                            next(true);
                        }
                    } else {
                        // Not enough arguments
                        next(false);
                    }
                });
                mutexService.provide("Unlock", (arguments, next) => {
                    const name = arguments.name;
                    const key = arguments.key;
                    if (name && key) {
                        if (instances["name"] === key) {
                            // Unlocked by the same instance
                            delete instances["name"];
                            next(true);
                        } else if (instances["name"]) {
                            // Unlocked by another instance
                            next(false);
                        } else {
                            // Not locked
                            next(true);
                        }
                    } else {
                        // Not enough arguments
                        next(false);
                    }
                });
            }).Namespace(process.env.ONION_REDIS_NAMESPACE).Class("Mutex");
        return mutexService;
    }
}
