import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertTeamSchema, 
  insertTeamMemberSchema, 
  insertDonationSchema,
  insertSponsorSchema 
} from "@shared/schema";
import Stripe from "stripe";
import * as z from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_your_key";
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16",
});

// Setup session store
const MemoryStoreSession = MemoryStore(session);

// Registration schema with validation
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Create team schema with validation
const createTeamSchema = insertTeamSchema.extend({
  captainId: z.number().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session
  app.use(
    session({
      cookie: { maxAge: 86400000 }, // 24 hours
      store: new MemoryStoreSession({
        checkPeriod: 86400000 // Clear expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "walk-for-friendship-secret"
    })
  );
  
  // Initialize passport for authentication
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Configure passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: "Invalid username" });
        }
        
        // In a real app, compare hashed passwords
        if (user.password !== password) {
          return done(null, false, { message: "Invalid password" });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
  
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  
  // Authentication middleware
  const isAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };
  
  // Admin middleware
  const isAdmin = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated() && req.user && (req.user as any).isAdmin) {
      return next();
    }
    res.status(403).json({ message: "Forbidden" });
  };
  
  // API Routes
  
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Create user (password should be hashed in a real app)
      const { confirmPassword, ...userData } = validatedData;
      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/auth/login", (req, res, next) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) {
          return next(err);
        }
        
        if (!user) {
          return res.status(401).json({ message: info.message || "Authentication failed" });
        }
        
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          
          const { password, ...userWithoutPassword } = user;
          return res.json({ user: userWithoutPassword });
        });
      })(req, res, next);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      next(error);
    }
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  
  app.get("/api/auth/user", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const { password, ...userWithoutPassword } = req.user as any;
    res.json({ user: userWithoutPassword });
  });
  
  // Team routes
  app.get("/api/teams", async (req, res) => {
    try {
      const teams = await storage.getTeams();
      console.log("GET /api/teams - Retrieved teams:", teams.length);
      console.log("Teams sample:", teams.slice(0, 2));
      res.json({ teams });
    } catch (error) {
      console.error("Error in GET /api/teams:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/teams/top", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const teams = await storage.getTopTeams(limit);
      console.log("GET /api/teams/top - Retrieved top teams:", teams.length);
      console.log("Top teams sample:", teams.slice(0, 2));
      res.json({ teams });
    } catch (error) {
      console.error("Error in GET /api/teams/top:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/teams/:id", async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const team = await storage.getTeam(teamId);
      
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      // Get team members with user details
      const members = await storage.getTeamMembers(teamId);
      
      // Get team donations
      const donations = await storage.getTeamDonations(teamId);
      
      res.json({ team, members, donations });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/teams", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      
      const validatedData = createTeamSchema.parse({
        ...req.body,
        captainId: userId
      });
      
      const team = await storage.createTeam(validatedData);
      res.status(201).json({ team });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.patch("/api/teams/:id", isAuthenticated, async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const userId = (req.user as any).id;
      
      // Get the team
      const team = await storage.getTeam(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      // Check if user is the team captain or an admin
      if (team.captainId !== userId && !(req.user as any).isAdmin) {
        return res.status(403).json({ message: "Not authorized to update this team" });
      }
      
      // Update team
      const updatedTeam = await storage.updateTeam(teamId, req.body);
      res.json({ team: updatedTeam });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/teams/:id/join", isAuthenticated, async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const userId = (req.user as any).id;
      
      // Check if team exists
      const team = await storage.getTeam(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      // Check if user is already a member
      const members = await storage.getTeamMembers(teamId);
      const isAlreadyMember = members.some(member => member.userId === userId);
      
      if (isAlreadyMember) {
        return res.status(400).json({ message: "User is already a member of this team" });
      }
      
      // Add user to team
      const teamMember = await storage.addTeamMember({
        teamId,
        userId,
        isActive: true
      });
      
      res.status(201).json({ teamMember });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.delete("/api/teams/:teamId/members/:userId", isAuthenticated, async (req, res) => {
    try {
      const teamId = parseInt(req.params.teamId);
      const memberUserId = parseInt(req.params.userId);
      const currentUserId = (req.user as any).id;
      
      // Get the team
      const team = await storage.getTeam(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      // Check if the current user is the team captain, the member being removed, or an admin
      if (team.captainId !== currentUserId && memberUserId !== currentUserId && !(req.user as any).isAdmin) {
        return res.status(403).json({ message: "Not authorized to remove this team member" });
      }
      
      // Don't allow removing the captain
      if (memberUserId === team.captainId) {
        return res.status(400).json({ message: "Cannot remove the team captain" });
      }
      
      // Remove member
      const success = await storage.removeTeamMember(teamId, memberUserId);
      
      if (!success) {
        return res.status(404).json({ message: "Team member not found" });
      }
      
      res.json({ message: "Team member removed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // User team routes
  app.get("/api/user/teams", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const userTeams = await storage.getUserTeams(userId);
      
      // Also get teams where user is captain
      const captainTeams = await storage.getTeamsByCaptain(userId);
      
      res.json({ userTeams, captainTeams });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Donation routes
  app.post("/api/donations", async (req, res) => {
    try {
      const validatedData = insertDonationSchema.parse(req.body);
      
      // Create payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(validatedData.amount * 100), // Convert to cents
        currency: "usd",
        receipt_email: validatedData.donorEmail,
        metadata: {
          donorName: validatedData.donorName,
          teamId: validatedData.teamId?.toString() || "",
          userId: validatedData.userId?.toString() || "",
          isAnonymous: validatedData.isAnonymous ? "true" : "false",
          isInHonorOf: validatedData.isInHonorOf ? "true" : "false",
          honoreeInfo: validatedData.honoreeInfo || ""
        }
      });
      
      // Create donation in pending status
      const donation = await storage.createDonation({
        ...validatedData,
        stripePaymentId: paymentIntent.id,
        paymentStatus: "pending"
      });
      
      res.status(201).json({ 
        donation,
        clientSecret: paymentIntent.client_secret
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Stripe webhook for donation status updates
  app.post("/api/webhooks/stripe", async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test";
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      // Find the donation by Stripe payment ID
      const donations = await storage.getDonations();
      const donation = donations.find(d => d.stripePaymentId === paymentIntent.id);
      
      if (donation) {
        // Update donation status to completed
        await storage.updateDonationStatus(donation.id, "completed");
      }
    }
    
    res.json({ received: true });
  });
  
  // Sponsor routes
  app.get("/api/sponsors", async (req, res) => {
    try {
      const sponsors = await storage.getSponsors();
      res.json({ sponsors });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/sponsors", isAdmin, async (req, res) => {
    try {
      const validatedData = insertSponsorSchema.parse(req.body);
      const sponsor = await storage.createSponsor(validatedData);
      res.status(201).json({ sponsor });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Event settings and stats
  app.get("/api/event", async (req, res) => {
    try {
      const settings = await storage.getEventSettings();
      const stats = await storage.getEventStats();
      
      res.json({ settings, stats });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.patch("/api/event", isAdmin, async (req, res) => {
    try {
      const updatedSettings = await storage.updateEventSettings(req.body);
      res.json({ settings: updatedSettings });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
