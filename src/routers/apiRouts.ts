import * as express from 'express';

import * as apiController from '../controllers/api';
import * as homeController from "../controllers/home";
import * as userController from "../controllers/user";

import * as passportConfig from "../config/passport";

import * as contactController from "../controllers/contact";
 


export const router = express.Router();

router.get("/account", passportConfig.isAuthenticated, userController.getAccount);
router.post("/account/profile", passportConfig.isAuthenticated, userController.postUpdateProfile);
router.post("/account/password", passportConfig.isAuthenticated, userController.postUpdatePassword);
router.post("/account/delete", passportConfig.isAuthenticated, userController.postDeleteAccount);
router.get("/account/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);

router.get('/api', apiController.getApi);

router.get("/login", userController.getLogin);
router.post("/login", userController.postLogin);
router.get("/logout", userController.logout);
router.get("/forgot", userController.getForgot);
router.post("/forgot", userController.postForgot);
router.get("/reset/:token", userController.getReset);
router.post("/reset/:token", userController.postReset);
router.get("/signup", userController.getSignup);
router.post("/signup", userController.postSignup);
router.get("/contact", contactController.getContact);
router.post("/contact", contactController.postContact);

router.get("/", homeController.index);

