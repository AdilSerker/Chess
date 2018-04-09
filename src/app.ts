import * as express from "express";
import * as compression from "compression";  // compresses requests
import * as session from "express-session";
import * as bodyParser from "body-parser";

import * as dotenv from "dotenv";
import * as path from "path";
import * as expressValidator from "express-validator";

import * as chess from './routers/apiChess';

dotenv.config({ path: ".env.example" });

const app = express();
const expressWs = require('express-ws')(app);

app.set("port", process.env.PORT || 8888);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
resave: true,
saveUninitialized: true,
secret: process.env.SESSION_SECRET,
}));

app.use(express.static(path.join(__dirname, "public"), { maxAge: 0, etag: true }));
app.use('/chess/:id', express.static(path.join(__dirname, "public")));

import * as api from './routers/apiRouts';

app.use('/', api.router);

app.use('/chess', chess.router);

export { app };
