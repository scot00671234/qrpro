import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import connectPg from "connect-pg-simple";
import bcrypt from "bcrypt";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-for-development',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Local authentication strategy
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email: string, password: string, done) => {
      try {
        // For now, create a simple demo user system
        // In production, you'd want proper user registration/login
        const user = await storage.getUserByEmail(email);
        
        if (!user) {
          // Auto-create user for demo purposes
          const newUser = await storage.upsertUser({
            id: email,
            email: email,
            firstName: email.split('@')[0],
            lastName: '',
          });
          return done(null, newUser);
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Simple login route for demo
  app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.json({ message: 'Logged in successfully', user: req.user });
  });

  app.post('/api/logout', (req, res) => {
    req.logout(() => {
      res.json({ message: 'Logged out successfully' });
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};