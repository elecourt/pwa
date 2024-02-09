module.exports = function (app, router) {
    require("./TweetController")(app, router);
    require("./SubscriptionsController")(app, router);
  };