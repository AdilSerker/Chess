import * as express from 'express';

import * as homeController from "../controllers/home";

import * as contactController from "../controllers/contact";

export const router = express.Router();

router.get("/contact", contactController.getContact);
router.post("/contact", contactController.postContact);

router.get("/", homeController.index);

