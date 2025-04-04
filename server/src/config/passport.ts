import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../models/User'; // Assure-toi que ce chemin est correct
import dotenv from 'dotenv';
dotenv.config();

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string
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
// passport.use(new GoogleStrategy({
//     clientID: 'YOUR_GOOGLE_CLIENT_ID',
//     clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
//     callbackURL: '/auth/google/callback'
// }, async (accessToken, refreshToken, profile, done) => {
//     try {
//         const user = await User.findOne({ where: { oauth_uid: profile.id, oauth_provider: 'google' } });
//         if (user) {
//             return done(null, user);
//         } else {
//             const newUser = await User.create({
//                 username: profile.displayName,
//                 email: profile.emails[0].value,
//                 oauth_provider: 'google',
//                 oauth_uid: profile.id
//             });
//             return done(null, newUser);
//         }
//     } catch (err) {
//         return done(err);
//     }
// }));

// // Configuration de la stratégie Facebook
// passport.use(new FacebookStrategy({
//     clientID: 'YOUR_FACEBOOK_APP_ID',
//     clientSecret: 'YOUR_FACEBOOK_APP_SECRET',
//     callbackURL: '/auth/facebook/callback',
//     profileFields: ['id', 'displayName', 'email']
// }, async (accessToken, refreshToken, profile, done) => {
//     try {
//         const user = await User.findOne({ where: { oauth_uid: profile.id, oauth_provider: 'facebook' } });
//         if (user) {
//             return done(null, user);
//         } else {
//             const newUser = await User.create({
//                 username: profile.displayName,
//                 email: profile.emails[0].value,
//                 oauth_provider: 'facebook',
//                 oauth_uid: profile.id
//             });
//             return done(null, newUser);
//         }
//     } catch (err) {
//         return done(err);
//     }
// }));

export default passport;
