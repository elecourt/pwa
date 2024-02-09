require("dotenv").config();
require("./utils/db")

const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const cors = require('cors'); 

app.use(bodyParser.json())
app.use(cors());
app.use("/api", router);

require("./controller")(app, router);

app.use((error, req, res, next) => {
  if(error?.status) {
    res.status(error?.status).send({
      code : error?.code,
      message:error?.message
    })
  } else {
    res.status(500).send({
      code : "SERVER_ERRROR",
      message: "Internal Server Error"
    })
  }
})

app.listen(process.env.APP_PORT, () => {
  console.log(`Api listening at http://localhost:${process.env.APP_PORT}`);
}); 