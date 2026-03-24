import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserModel } from '../User/User.model';

const { fromExtractors, fromAuthHeaderAsBearerToken } = ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.signedCookies) {
    token = req.signedCookies['token'];
  }
  return token;
};

const jwtFromRequest = fromExtractors([
  cookieExtractor,
  fromAuthHeaderAsBearerToken(),
]);
const secretOrKey = process.env.JWT_SECRET;
const options = { jwtFromRequest, secretOrKey };

declare global {
  // eslint-disable-next-line
  namespace Express {
    // eslint-disable-next-line
    interface User {
      id?: string;
      name: string;
      lastname: string;
      email: string;
      password: string;
      job: string;
    }
  }
}

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await UserModel.findOne({ email: payload.sub }).exec();
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error, null);
    }
  }),
);
