const { Router } = require("express");
const Subscriptions = require("../models/Subscriptions");

class SubscriptionsNotFoundException extends Error {
    constructor(message) {
        super(message);
        this.code = "SUBCRIPTIONS_NOT_FOUND";
        this.message = "This Subscriptions does not exists"
        this.status = 404
    }
}

class SubscriptionsBadRequestException extends Error {
    constructor(message) {
      super(message);
      this.code = "BAD_REQUEST_FOR_SUBCRIPTIONS";
      this.message = "This Subscriptions endpoint not exists";
      this.status = 400;
    }
}

/**
 * @param {Express.Application} app
 * @param {Router} router
 */
module.exports = function(app, router){
    router.get(
        "/subscriptions",
        [],
        async (req, res)=>{
            try {
                res.send(await Subscriptions.findAll());
            } catch (error) {
                throw new SubscriptionsNotFoundException();
            }
            
        }
    );
    router.post(
        "/subscriptions",
        [],
        async (req, res)=>{
            console.log(req.body)
            try {
                res.send(await Subscriptions.create({
                    endpoint : req.body.endpoint,
                    key_p256dh : req.body.keys.p256dh,
                    key_auth : req.body.keys.auth,
                }));
            } catch (error) {
                throw new SubscriptionsBadRequestException();
            }
            
        }
    );
}