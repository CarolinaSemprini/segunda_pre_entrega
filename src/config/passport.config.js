import fetch from 'node-fetch';
import passport from "passport";
import GitHubStrategy from 'passport-github2';
import local from "passport-local";
import { isValidPassword, createHash } from "../utils/hash.js";
import dotenv from 'dotenv'
import { userService } from '../services/users.service.js';
import { MongooseUserModel } from '../DAO/models/mongoose/users.mongoose.js';
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
                        return done(null, user);
                    }

                    if (!user) {
                        console.log("User Not Found with email " + email);
                        return done(null, false);
                    }

                    if (!isValidPassword(password, user.password)) {
                        console.log("Invalid Password");
                        return done(null, false);
                    }

                    return done(null, user);
                } catch (err) {
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
                        console.log("User already exists");
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
                    console.log("User Registration succesful");
                    return done(null, userCreated);
                } catch (e) {
                    console.log("Error in register");
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

                    let user = await userService.getOne(profile.username);
                    if (!user) {
                        let userCreated = await userService.create({
                            first_name: profile.displayName || 'noname',
                            last_name: 'nolast',
                            username: profile.username,
                            email: profile.email,
                            age: 'noage',
                            password: 'nopass',
                        });
                        console.log('User Registration succesful');
                        return done(null, userCreated);
                    } else {
                        console.log('User already exists');
                        return done(null, user);
                    }
                } catch (e) {
                    console.log('Error en auth github');
                    console.log(e);
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