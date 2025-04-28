import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from 'bcrypt';
import User from '../models/User'; // Assure-toi que ce chemin est correct
import dotenv from 'dotenv';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET } from './Env';
dotenv.config();

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET as string,
    ignoreExpiration: false,
};


// 🔑 Stratégie pour l'authentification avec email et mot de passe
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email: string, password: string, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Invalid credentials' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// 🎯 Stratégie JWT pour vérifier l'authentification via le token
passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false, { message: 'User not found' });
    } catch (err) {
        return done(err);
    }
}));


// // Configuration de la stratégie Google
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID as string,
    clientSecret: GOOGLE_CLIENT_SECRET as string,
    callbackURL: '/api/v1/users/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        done(null, profile);
    } catch (err) {
        return done(err);
    }
}));

export default passport;
