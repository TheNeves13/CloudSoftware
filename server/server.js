const express = require("express");
const routes = require("../backend/routes");
const bodyParser = require('body-parser');
const uploadcsvRoute = require('../backend/uploadcsv');
const uploadResults = require('../backend/uploadresults');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(uploadcsvRoute);
app.use('/',uploadResults);
app.use("/", routes); 

app.listen(3000, () => console.log("Middleware no http://localhost:3000"));
