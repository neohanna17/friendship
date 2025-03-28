import { 
  users, teams, teamMembers, donations, sponsors, eventSettings,
  type User, type InsertUser, 
  type Team, type InsertTeam,
  type TeamMember, type InsertTeamMember,
  type Donation, type InsertDonation,
  type Sponsor, type InsertSponsor,
  type EventSetting
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  updateStripeCustomerId(id: number, stripeCustomerId: string): Promise<User | undefined>;
  
  // Team methods
  getTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  getTeamsByCaptain(captainId: number): Promise<Team[]>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, teamData: Partial<Team>): Promise<Team | undefined>;
  getTopTeams(limit: number): Promise<Team[]>;
  
  // Team members methods
  getTeamMembers(teamId: number): Promise<(TeamMember & { user: User })[]>;
  addTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  removeTeamMember(teamId: number, userId: number): Promise<boolean>;
  getUserTeams(userId: number): Promise<(TeamMember & { team: Team })[]>;
  
  // Donation methods
  getDonations(): Promise<Donation[]>;
  getDonation(id: number): Promise<Donation | undefined>;
  getTeamDonations(teamId: number): Promise<Donation[]>;
  getUserDonations(userId: number): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;
  updateDonationStatus(id: number, status: string): Promise<Donation | undefined>;
  
  // Sponsor methods
  getSponsors(): Promise<Sponsor[]>;
  getSponsor(id: number): Promise<Sponsor | undefined>;
  createSponsor(sponsor: InsertSponsor): Promise<Sponsor>;
  updateSponsor(id: number, sponsorData: Partial<Sponsor>): Promise<Sponsor | undefined>;
  
  // Event settings methods
  getEventSettings(): Promise<EventSetting | undefined>;
  updateEventSettings(data: Partial<EventSetting>): Promise<EventSetting | undefined>;
  getEventStats(): Promise<{ teams: number, participants: number, donations: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private teams: Map<number, Team>;
  private teamMembers: Map<number, TeamMember>;
  private donations: Map<number, Donation>;
  private sponsors: Map<number, Sponsor>;
  private eventSettings: EventSetting | undefined;
  
  private currentUserId: number;
  private currentTeamId: number;
  private currentTeamMemberId: number;
  private currentDonationId: number;
  private currentSponsorId: number;

  constructor() {
    this.users = new Map();
    this.teams = new Map();
    this.teamMembers = new Map();
    this.donations = new Map();
    this.sponsors = new Map();
    
    this.currentUserId = 1;
    this.currentTeamId = 1;
    this.currentTeamMemberId = 1;
    this.currentDonationId = 1;
    this.currentSponsorId = 1;
    
    // Initialize with sample event settings
    this.eventSettings = {
      id: 1,
      eventName: "Walk for Friendship 2025",
      eventDate: new Date("2025-08-30"),
      eventDescription: "Join us for a day of fun, friendship, and fundraising!",
      goalAmount: 1000000,
      raisedAmount: 78000,
      registrationOpen: true,
      lastUpdated: new Date()
    };
    
    // Initialize with some sample data
    this.initializeSampleData();
  }
  
  private initializeSampleData() {
    // Add sample teams with captains and members
    const team1: Team = {
      id: this.currentTeamId++,
      name: "Team Sunshine",
      description: "We're walking for friendship and inclusion!",
      captainId: 1, // Will be created below
      goalAmount: 15000,
      raisedAmount: 12450,
      teamImage: "/images/team-image.jpeg",
      createdAt: new Date()
    };
    
    const team2: Team = {
      id: this.currentTeamId++,
      name: "Friendship Force",
      description: "Join our force for good!",
      captainId: 2, // Will be created below
      goalAmount: 12500,
      raisedAmount: 8975,
      teamImage: "/images/team-image.jpeg",
      createdAt: new Date()
    };
    
    const team3: Team = {
      id: this.currentTeamId++,
      name: "Walking Wonders",
      description: "Let's make a difference together!",
      captainId: 3, // Will be created below
      goalAmount: 10000,
      raisedAmount: 7340,
      teamImage: "",
      createdAt: new Date()
    };
    
    const team4: Team = {
      id: this.currentTeamId++,
      name: "Community Champions",
      description: "Champions for our community!",
      captainId: 4, // Will be created below
      goalAmount: 10000,
      raisedAmount: 6210,
      teamImage: "",
      createdAt: new Date()
    };
    
    // Add the teams to the map
    this.teams.set(team1.id, team1);
    this.teams.set(team2.id, team2);
    this.teams.set(team3.id, team3);
    this.teams.set(team4.id, team4);
    
    // Create sample users
    const user1: User = {
      id: this.currentUserId++,
      username: "sarahj",
      password: "hashedpassword", // In a real app, this would be properly hashed
      email: "sarah@example.com",
      firstName: "Sarah",
      lastName: "Johnson",
      profileImage: "",
      bio: "Team captain and community volunteer",
      phone: "555-123-4567",
      isAdmin: false,
      stripeCustomerId: ""
    };
    
    const user2: User = {
      id: this.currentUserId++,
      username: "miket",
      password: "hashedpassword",
      email: "mike@example.com",
      firstName: "Mike",
      lastName: "Thompson",
      profileImage: "",
      bio: "Passionate about helping others",
      phone: "555-234-5678",
      isAdmin: false,
      stripeCustomerId: ""
    };
    
    const user3: User = {
      id: this.currentUserId++,
      username: "lisar",
      password: "hashedpassword",
      email: "lisa@example.com",
      firstName: "Lisa",
      lastName: "Roberts",
      profileImage: "",
      bio: "Walking for a better tomorrow",
      phone: "555-345-6789",
      isAdmin: false,
      stripeCustomerId: ""
    };
    
    const user4: User = {
      id: this.currentUserId++,
      username: "davidl",
      password: "hashedpassword",
      email: "david@example.com",
      firstName: "David",
      lastName: "Lewis",
      profileImage: "",
      bio: "Community advocate and volunteer",
      phone: "555-456-7890",
      isAdmin: false,
      stripeCustomerId: ""
    };
    
    const adminUser: User = {
      id: this.currentUserId++,
      username: "admin",
      password: "adminpassword",
      email: "admin@friendshipcircle.org",
      firstName: "Admin",
      lastName: "User",
      profileImage: "",
      bio: "Walk for Friendship Administrator",
      phone: "555-987-6543",
      isAdmin: true,
      stripeCustomerId: ""
    };
    
    // Add users to the map
    this.users.set(user1.id, user1);
    this.users.set(user2.id, user2);
    this.users.set(user3.id, user3);
    this.users.set(user4.id, user4);
    this.users.set(adminUser.id, adminUser);
    
    // Add team members
    this.teamMembers.set(this.currentTeamMemberId++, {
      id: this.currentTeamMemberId,
      teamId: team1.id,
      userId: user1.id,
      isActive: true,
      joinedAt: new Date()
    });
    
    this.teamMembers.set(this.currentTeamMemberId++, {
      id: this.currentTeamMemberId,
      teamId: team2.id,
      userId: user2.id,
      isActive: true,
      joinedAt: new Date()
    });
    
    this.teamMembers.set(this.currentTeamMemberId++, {
      id: this.currentTeamMemberId,
      teamId: team3.id,
      userId: user3.id,
      isActive: true,
      joinedAt: new Date()
    });
    
    this.teamMembers.set(this.currentTeamMemberId++, {
      id: this.currentTeamMemberId,
      teamId: team4.id,
      userId: user4.id,
      isActive: true,
      joinedAt: new Date()
    });
    
    // Add sample sponsors
    const sponsor1: Sponsor = {
      id: this.currentSponsorId++,
      name: "ABC Corporation",
      tier: "gold",
      logo: "",
      websiteUrl: "https://example.com",
      description: "Proud sponsor of Walk for Friendship",
      contactName: "John Smith",
      contactEmail: "john@example.com",
      contactPhone: "555-111-2222",
      donationAmount: 5000,
      isActive: true,
      createdAt: new Date()
    };
    
    const sponsor2: Sponsor = {
      id: this.currentSponsorId++,
      name: "XYZ Foundation",
      tier: "silver",
      logo: "",
      websiteUrl: "https://example.org",
      description: "Supporting community inclusion",
      contactName: "Jane Doe",
      contactEmail: "jane@example.org",
      contactPhone: "555-333-4444",
      donationAmount: 2500,
      isActive: true,
      createdAt: new Date()
    };
    
    // Add sponsors to the map
    this.sponsors.set(sponsor1.id, sponsor1);
    this.sponsors.set(sponsor2.id, sponsor2);
    
    // Add some sample donations
    this.donations.set(this.currentDonationId++, {
      id: this.currentDonationId,
      amount: 100,
      donorName: "Anonymous Donor",
      donorEmail: "anonymous@example.com",
      message: "Great cause!",
      teamId: team1.id,
      userId: null,
      isAnonymous: true,
      isInHonorOf: false,
      honoreeInfo: "",
      stripePaymentId: "pi_12345",
      paymentStatus: "completed",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    });
    
    this.donations.set(this.currentDonationId++, {
      id: this.currentDonationId,
      amount: 250,
      donorName: "John Smith",
      donorEmail: "john@example.com",
      message: "Happy to support!",
      teamId: team2.id,
      userId: null,
      isAnonymous: false,
      isInHonorOf: true,
      honoreeInfo: "In honor of my mother",
      stripePaymentId: "pi_23456",
      paymentStatus: "completed",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    });
    
    this.donations.set(this.currentDonationId++, {
      id: this.currentDonationId,
      amount: 75,
      donorName: "Maria Garcia",
      donorEmail: "maria@example.com",
      message: "Keep up the great work!",
      teamId: team3.id,
      userId: null,
      isAnonymous: false,
      isInHonorOf: false,
      honoreeInfo: "",
      stripePaymentId: "pi_34567",
      paymentStatus: "completed",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      stripeCustomerId: "",
      profileImage: insertUser.profileImage || null,
      bio: insertUser.bio || null,
      phone: insertUser.phone || null,
      isAdmin: insertUser.isAdmin || false
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateStripeCustomerId(id: number, stripeCustomerId: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, stripeCustomerId };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Team methods
  async getTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }
  
  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }
  
  async getTeamsByCaptain(captainId: number): Promise<Team[]> {
    return Array.from(this.teams.values()).filter(
      (team) => team.captainId === captainId
    );
  }
  
  async createTeam(team: InsertTeam): Promise<Team> {
    const id = this.currentTeamId++;
    const newTeam: Team = { 
      id,
      name: team.name,
      description: team.description || null,
      captainId: team.captainId || null,
      goalAmount: team.goalAmount || 0,
      raisedAmount: 0,
      teamImage: team.teamImage || null,
      createdAt: new Date() 
    };
    
    this.teams.set(id, newTeam);
    
    // Automatically add captain as a team member
    if (team.captainId) {
      await this.addTeamMember({
        teamId: id,
        userId: team.captainId,
        isActive: true
      });
    }
    
    return newTeam;
  }
  
  async updateTeam(id: number, teamData: Partial<Team>): Promise<Team | undefined> {
    const team = this.teams.get(id);
    if (!team) return undefined;
    
    const updatedTeam = { ...team, ...teamData };
    this.teams.set(id, updatedTeam);
    return updatedTeam;
  }
  
  async getTopTeams(limit: number): Promise<Team[]> {
    return Array.from(this.teams.values())
      .sort((a, b) => b.raisedAmount - a.raisedAmount)
      .slice(0, limit);
  }
  
  // Team members methods
  async getTeamMembers(teamId: number): Promise<(TeamMember & { user: User })[]> {
    const members = Array.from(this.teamMembers.values()).filter(
      (member) => member.teamId === teamId
    );
    
    return members.map(member => {
      const user = this.users.get(member.userId);
      if (!user) throw new Error(`User not found for team member: ${member.id}`);
      return { ...member, user };
    });
  }
  
  async addTeamMember(teamMember: InsertTeamMember): Promise<TeamMember> {
    const id = this.currentTeamMemberId++;
    const newMember: TeamMember = { 
      id,
      teamId: teamMember.teamId,
      userId: teamMember.userId,
      isActive: teamMember.isActive ?? true,
      joinedAt: new Date() 
    };
    
    this.teamMembers.set(id, newMember);
    return newMember;
  }
  
  async removeTeamMember(teamId: number, userId: number): Promise<boolean> {
    const memberEntry = Array.from(this.teamMembers.entries()).find(
      ([_, member]) => member.teamId === teamId && member.userId === userId
    );
    
    if (memberEntry) {
      this.teamMembers.delete(memberEntry[0]);
      return true;
    }
    
    return false;
  }
  
  async getUserTeams(userId: number): Promise<(TeamMember & { team: Team })[]> {
    const memberships = Array.from(this.teamMembers.values()).filter(
      (member) => member.userId === userId
    );
    
    return memberships.map(membership => {
      const team = this.teams.get(membership.teamId);
      if (!team) throw new Error(`Team not found for membership: ${membership.id}`);
      return { ...membership, team };
    });
  }
  
  // Donation methods
  async getDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values());
  }
  
  async getDonation(id: number): Promise<Donation | undefined> {
    return this.donations.get(id);
  }
  
  async getTeamDonations(teamId: number): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(
      (donation) => donation.teamId === teamId
    );
  }
  
  async getUserDonations(userId: number): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(
      (donation) => donation.userId === userId
    );
  }
  
  async createDonation(donation: InsertDonation): Promise<Donation> {
    const id = this.currentDonationId++;
    const newDonation: Donation = { 
      id,
      amount: donation.amount,
      donorName: donation.donorName,
      donorEmail: donation.donorEmail || null,
      message: donation.message || null,
      teamId: donation.teamId || null,
      userId: donation.userId || null,
      isAnonymous: donation.isAnonymous || false,
      isInHonorOf: donation.isInHonorOf || false,
      honoreeInfo: donation.honoreeInfo || null,
      stripePaymentId: donation.stripePaymentId || null,
      paymentStatus: donation.paymentStatus || "pending",
      createdAt: new Date() 
    };
    
    this.donations.set(id, newDonation);
    
    // Update team's raised amount if donation is for a team
    if (newDonation.teamId && newDonation.paymentStatus === "completed") {
      const team = this.teams.get(newDonation.teamId);
      if (team) {
        team.raisedAmount += newDonation.amount;
        this.teams.set(team.id, team);
      }
    }
    
    // Update event's raised amount
    if (newDonation.paymentStatus === "completed" && this.eventSettings) {
      this.eventSettings.raisedAmount += newDonation.amount;
    }
    
    return newDonation;
  }
  
  async updateDonationStatus(id: number, status: string): Promise<Donation | undefined> {
    const donation = this.donations.get(id);
    if (!donation) return undefined;
    
    // If changing from non-completed to completed, update raised amounts
    if (donation.paymentStatus !== "completed" && status === "completed") {
      // Update team's raised amount
      if (donation.teamId) {
        const team = this.teams.get(donation.teamId);
        if (team) {
          team.raisedAmount += donation.amount;
          this.teams.set(team.id, team);
        }
      }
      
      // Update event's raised amount
      if (this.eventSettings) {
        this.eventSettings.raisedAmount += donation.amount;
      }
    }
    
    // If changing from completed to non-completed, reduce raised amounts
    if (donation.paymentStatus === "completed" && status !== "completed") {
      // Update team's raised amount
      if (donation.teamId) {
        const team = this.teams.get(donation.teamId);
        if (team) {
          team.raisedAmount -= donation.amount;
          this.teams.set(team.id, team);
        }
      }
      
      // Update event's raised amount
      if (this.eventSettings) {
        this.eventSettings.raisedAmount -= donation.amount;
      }
    }
    
    const updatedDonation = { ...donation, paymentStatus: status };
    this.donations.set(id, updatedDonation);
    return updatedDonation;
  }
  
  // Sponsor methods
  async getSponsors(): Promise<Sponsor[]> {
    return Array.from(this.sponsors.values()).filter(sponsor => sponsor.isActive);
  }
  
  async getSponsor(id: number): Promise<Sponsor | undefined> {
    return this.sponsors.get(id);
  }
  
  async createSponsor(sponsor: InsertSponsor): Promise<Sponsor> {
    const id = this.currentSponsorId++;
    const newSponsor: Sponsor = { 
      id,
      name: sponsor.name,
      tier: sponsor.tier,
      description: sponsor.description || null,
      isActive: sponsor.isActive || true,
      logo: sponsor.logo || null,
      websiteUrl: sponsor.websiteUrl || null,
      contactName: sponsor.contactName || null,
      contactEmail: sponsor.contactEmail || null,
      contactPhone: sponsor.contactPhone || null,
      donationAmount: sponsor.donationAmount || null,
      createdAt: new Date() 
    };
    
    this.sponsors.set(id, newSponsor);
    return newSponsor;
  }
  
  async updateSponsor(id: number, sponsorData: Partial<Sponsor>): Promise<Sponsor | undefined> {
    const sponsor = this.sponsors.get(id);
    if (!sponsor) return undefined;
    
    const updatedSponsor = { ...sponsor, ...sponsorData };
    this.sponsors.set(id, updatedSponsor);
    return updatedSponsor;
  }
  
  // Event settings methods
  async getEventSettings(): Promise<EventSetting | undefined> {
    return this.eventSettings;
  }
  
  async updateEventSettings(data: Partial<EventSetting>): Promise<EventSetting | undefined> {
    if (!this.eventSettings) return undefined;
    
    this.eventSettings = { 
      ...this.eventSettings, 
      ...data, 
      lastUpdated: new Date() 
    };
    
    return this.eventSettings;
  }
  
  async getEventStats(): Promise<{ teams: number, participants: number, donations: number }> {
    // Using fixed counts as requested
    const teamsCount = 1280; // Fixed teams count
    const participantsCount = 2714;
    const donationsCount = 78000; // Fixed donations count
    
    return {
      teams: teamsCount,
      participants: participantsCount,
      donations: donationsCount
    };
  }
}

export const storage = new MemStorage();
