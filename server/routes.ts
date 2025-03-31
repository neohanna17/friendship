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
      
      // Get the team
      const team = await storage.getTeam(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      // Get the captain
      const captain = team.captainId ? await storage.getUser(team.captainId) : null;
      
      // Get team members with user details
      const teamMembers = await storage.getTeamMembers(teamId);
      
      // Get team donations
      const donations = await storage.getTeamDonations(teamId);
      const filteredDonations = donations.filter(donation => 
        donation.paymentStatus === "completed"
      ).map(donation => ({
        id: donation.id,
        amount: donation.amount,
        donorName: donation.isAnonymous ? "Anonymous" : donation.donorName,
        message: donation.message,
        isAnonymous: donation.isAnonymous,
        createdAt: donation.createdAt
      }));
      
      // Format captain name
      const captainName = captain ? `${captain.firstName} ${captain.lastName}` : "Unknown";
      
      // Calculate progress percentage
      const progress = team.goalAmount > 0 ? Math.min(100, (team.raisedAmount / team.goalAmount) * 100) : 0;
      
      // Format members with their fundraising stats
      const members = await Promise.all(teamMembers.map(async (member) => {
        // Get user's donations
        const userDonations = storage.getActiveDonationsForUser(member.user.id);
        const raisedAmount = userDonations.reduce((sum, donation) => sum + donation.amount, 0);
        
        return {
          id: member.user.id,
          firstName: member.user.firstName,
          lastName: member.user.lastName,
          profileImage: member.user.profileImage,
          raisedAmount: raisedAmount,
          joinedAt: member.joinedAt
        };
      }));
      
      // Construct response
      const teamData = {
        id: team.id,
        name: team.name,
        description: team.description,
        goalAmount: team.goalAmount,
        raisedAmount: team.raisedAmount,
        progress: progress,
        teamImage: team.teamImage,
        captainId: team.captainId,
        captainName: captainName,
        membersCount: members.length,
        members: members,
        donations: filteredDonations,
        createdAt: team.createdAt
      };
      
      res.json({ team: teamData });
    } catch (error) {
      console.error("Error getting team:", error);
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
      
      // For demo purposes, skip actual payment processing
      // In a production app, you would integrate with Stripe or another payment processor
      
      // Create donation with "completed" status directly
      const donation = await storage.createDonation({
        ...validatedData,
        stripePaymentId: `demo-${Date.now()}-${Math.round(Math.random() * 10000)}`,
        paymentStatus: "completed"
      });
      
      res.status(201).json({ 
        donation,
        success: true
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
  
  // Fundraisers route - get all fundraisers
  app.get("/api/fundraisers", async (req, res) => {
    try {
      // Get all users
      const allUsers = await storage.getUsers();
      
      // Format users as fundraisers with relevant data
      const fundraisers = allUsers
        .filter(user => !user.isAdmin) // Filter out admin users
        .map(user => {
          // Get user donations
          const userDonations = storage.getActiveDonationsForUser(user.id);
          
          // Calculate total raised
          const raisedAmount = userDonations.reduce((sum, donation) => sum + donation.amount, 0);
          
          // Set default goal amount
          const goalAmount = 1000;
          
          // Add badges based on achievements (simplified version)
          const badges = [];
          if (raisedAmount > 0) badges.push("donor");
          if (raisedAmount >= 100) badges.push("fundraiser");
          if (raisedAmount >= 500) badges.push("champion");
          if (raisedAmount >= 1000) badges.push("hero");
          
          return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            profileImage: user.profileImage,
            bio: user.bio,
            raisedAmount,
            goalAmount,
            badges
          };
        });
      
      res.json({ fundraisers });
    } catch (error) {
      console.error("Error getting fundraisers:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get individual fundraiser profile
  app.get("/api/fundraisers/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Get the user
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Fundraiser not found" });
      }
      
      // Don't expose admin accounts as fundraisers
      if (user.isAdmin) {
        return res.status(404).json({ message: "Fundraiser not found" });
      }
      
      // Get all user donations
      const userDonations = storage.getActiveDonationsForUser(userId);
      
      // Calculate total raised
      const raisedAmount = userDonations.reduce((sum, donation) => sum + donation.amount, 0);
      
      // Set default goal amount
      const goalAmount = 1000;
      
      // Add badges based on achievements
      const badges = [];
      if (raisedAmount > 0) badges.push("donor");
      if (raisedAmount >= 100) badges.push("fundraiser");
      if (raisedAmount >= 500) badges.push("champion");
      if (raisedAmount >= 1000) badges.push("hero");
      
      // Get teams the user is a member of
      const userTeams = await storage.getUserTeams(userId);
      const teamsList = userTeams.map(membership => ({
        id: membership.team.id,
        name: membership.team.name,
        teamImage: membership.team.teamImage
      }));
      
      // Format donations for display
      const donations = userDonations.map(donation => ({
        id: donation.id,
        amount: donation.amount,
        donorName: donation.isAnonymous ? "Anonymous" : donation.donorName,
        message: donation.message,
        isAnonymous: donation.isAnonymous,
        createdAt: donation.createdAt
      }));
      
      // Calculate progress percentage
      const progress = goalAmount > 0 ? Math.min(100, (raisedAmount / goalAmount) * 100) : 0;
      
      // Construct response
      const fundraiserData = {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          bio: user.bio,
          goalAmount,
          raisedAmount,
          progress,
          badges,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000) // Random date in past 90 days
        },
        donations,
        teams: teamsList
      };
      
      res.json({ data: fundraiserData });
    } catch (error) {
      console.error("Error getting fundraiser profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Top fundraisers - get top fundraisers by amount raised
  app.get("/api/top-fundraisers", async (req, res) => {
    try {
      // Get all users
      const allUsers = await storage.getUsers();
      
      // Calculate raised amount for each user
      const fundraisers = allUsers
        .filter(user => !user.isAdmin) // Filter out admin users
        .map(user => {
          // Get user donations
          const userDonations = storage.getActiveDonationsForUser(user.id);
          
          // Calculate total raised
          const raisedAmount = userDonations.reduce((sum, donation) => sum + donation.amount, 0);
          
          return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImage: user.profileImage,
            raisedAmount,
            goalAmount: 1000,
          };
        })
        .sort((a, b) => b.raisedAmount - a.raisedAmount) // Sort by amount raised
        .slice(0, 10); // Get top 10
      
      res.json({ fundraisers });
    } catch (error) {
      console.error("Error getting top fundraisers:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Top donors - get top donors by amount donated
  app.get("/api/top-donors", async (req, res) => {
    try {
      // Get all donations
      const allDonations = await storage.getDonations();
      
      // Group donations by donor and calculate total
      const donorMap = new Map();
      
      allDonations.forEach(donation => {
        if (donation.paymentStatus === 'completed') {
          const key = donation.isAnonymous ? `anonymous-${donation.id}` : donation.donorName;
          const current = donorMap.get(key) || {
            id: donation.id,
            name: donation.isAnonymous ? 'Anonymous' : donation.donorName,
            amount: 0,
            isAnonymous: donation.isAnonymous
          };
          
          current.amount += donation.amount;
          donorMap.set(key, current);
        }
      });
      
      // Convert to array and sort
      const donors = Array.from(donorMap.values())
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10); // Get top 10
      
      res.json({ donors });
    } catch (error) {
      console.error("Error getting top donors:", error);
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
