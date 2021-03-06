const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderstRoutes = require("./api/routes/orders");

mongoose.connect(
  "mongodb://node-rest-api:" +
    process.env.MONGO_ATLAS_PW +
    "@node-rest-shop-shard-00-00-e4b1u.mongodb.net:27017,node-rest-shop-shard-00-01-e4b1u.mongodb.net:27017,node-rest-shop-shard-00-02-e4b1u.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin&retryWrites=true",
  { useNewUrlParser: true }
);

mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Acces-Control-Allow-Origin", "*");
  res.header(
    "Acces-Control-Allow_Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//ROUTES HANDLING REQUEST
app.use("/products", productRoutes);
app.use("/orders", orderstRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
