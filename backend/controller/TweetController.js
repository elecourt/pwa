require("dotenv").config();
const { Router } = require("express");
const Tweets = require("../models/Tweets");
const Subscriptions = require("../models/Subscriptions")
const webpush = require('web-push')

webpush.setVapidDetails(
    'mailto:roussel---arnaud@hotmail.com',
    process.env.Public_Key,
    process.env.Private_Key
)

class TweetNotFoundException extends Error {
    constructor(message) {
        super(message);
        this.code = "TWEET_NOT_FOUND";
        this.message = "This tweet does not exists"
        this.status = 404
    }
}

class TweetBadRequestException extends Error {
    constructor(message) {
      super(message);
      this.code = "BAD_REQUEST_FOR_TWEET";
      this.message = "This tweet endpoint not exists";
      this.status = 400;
    }
}

/**
 * @param {Express.Application} app
 * @param {Router} router
 */
module.exports = function(app, router){
    router.get(
        "/tweets",
        [],
        async (req, res)=>{
            try {
                res.send(await Tweets.findAll());
            } catch (error) {
                throw new TweetNotFoundException();
            }
            
        }
    );
    router.post(
        "/tweets",
        [],
        async (req, res)=>{
            console.log(req.body)
            try {
                res.send(await Tweets.create({
                    title : req.body.title,
                    message : req.body.message
                }));
                const serializedSubscription =  await Subscriptions.findAll();
                for (const sub of serializedSubscription){
                    const sendsub = {
                        "endpoint" : sub.endpoint,
                        'keys': {
                            "p256dh":sub.key_p256dh,
                            "auth":sub.key_auth
                        }
                    }
                
                    const notification = {
                        "title" : "new tweet",
                        "body" : "Read the new tweet"
                    }
                    webpush.sendNotification(
                        sendsub,
                        JSON.stringify(notification)
                    ).catch(notificationError =>{
                        if(
                            notificationError.statusCode == 404
                            || notificationError.statusCode == 410
                        ){
                            console.log('subscription is not valide')
                            sub.destroy()
                        }else{
                            console.log("notificationError" + notificationError)
                        }
                    })
                }
            } catch (error) {
                throw new TweetBadRequestException();
            }
            
        }
    );
}