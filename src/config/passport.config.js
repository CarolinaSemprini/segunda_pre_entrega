//archivo passport.config.js
import fetch from 'node-fetch';
import passport from "passport";
import GitHubStrategy from 'passport-github2';
import local from "passport-local";
import { isValidPassword, createHash } from "../utils/hash.js";
import dotenv from 'dotenv'
import { userService } from '../services/users.service.js';

import { MongooseUserModel } from '../DAO/models/mongoose/users.mongoose.js';
import logger from '../utils/logger.js';

const LocalStrategy = local.Strategy;

dotenv.config()
const secret = process.env.SECRET_GITHUB

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

export function iniPassport() {
    passport.use(
        "login",
        new LocalStrategy(
            { usernameField: 'email' },
            async (email, password, done) => {
                try {
                    let user = await userService.getOneByEmail(email);

                    // Check for admin credentials
                    if (email === adminEmail && password === adminPassword) {
                        if (!user) {
                            user = await userService.create({
                                first_name: 'Admin',
                                last_name: 'Coder',
                                username: 'adminCoder',
                                email: adminEmail,
                                age: '---',
                                password: createHash(adminPassword),
                                role: 'admin'
                            });
                        }
                        logger.warning('User already exists');
                        return done(null, user);
                    }

                    if (!user) {
                        logger.error('no se encontro el usuario con el email ' + email);
                        return done(null, false);
                    }

                    if (!isValidPassword(password, user.password)) {
                        logger.warning('contraseña invalida');
                        return done(null, false);
                    }

                    return done(null, user);
                } catch (err) {
                    logger.error(`Error registering user: ${err.message}`);
                    return done(err);
                }
            }
        )
    );

    passport.use(
        "register",
        new LocalStrategy({
            passReqToCallback: true,
            usernameField: 'email' // Usar email en lugar de username
        },
            async (req, username, password, done) => {
                try {
                    const { age, email, first_name, last_name } = req.body;
                    let user = await userService.getOneByEmail(email);
                    if (user) {
                        logger.info("User already exists");
                        return done(null, false);
                    }

                    let userCreated = await userService.create({
                        first_name,
                        last_name,
                        username,
                        email,
                        age,
                        password: createHash(password)
                    });
                    logger.info("User Registration succesful");
                    return done(null, userCreated);
                } catch (e) {
                    logger.error(`Error creating message: ${error.message}`);
                    console.log(e);
                    return done(e);
                }
            }
        )
    );

    passport.use(
        'github',
        new GitHubStrategy(
            {
                clientID: '1fcb23e4f6944259df14',
                clientSecret: secret,
                callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
            },
            async (accesToken, _, profile, done) => {
                try {
                    const res = await fetch('https://api.github.com/user/emails', {
                        headers: {
                            Accept: 'application/vnd.github+json',
                            Authorization: 'Bearer ' + accesToken,
                            'X-Github-Api-Version': '2022-11-28',
                        },
                    });
                    const emails = await res.json();
                    const emailDetail = emails.find((email) => email.verified == true);

                    if (!emailDetail) {
                        return done(new Error('cannot get a valid email for this user'));
                    }
                    profile.email = emailDetail.email;

                    //let user = await userService.getOne(profile.username);
                    let user = await userService.getOneByUsername(profile.username);
                    if (!user) {
                        let userCreated = await userService.create({
                            first_name: profile.displayName || 'noname',
                            last_name: 'nolast',
                            username: profile.username,
                            email: profile.email,
                            age: 'noage',
                            password: 'nopass',
                        });
                        logger.info('User Registration succesful');
                        return done(null, userCreated);
                    } else {
                        logger.info('User already exists');
                        return done(null, user);
                    }
                } catch (e) {
                    logger.error('Error en auth github');
                    logger.error(e);
                    return done(e);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await MongooseUserModel.findById(id);
        done(null, user);
    });
}