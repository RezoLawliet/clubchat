import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY_JWT,
}

passport.use('jwt', new JwtStrategy(opts, (jwt_payload, done) => {}))
