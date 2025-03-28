import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Loader2, Check } from "lucide-react";

// Define schemas for user registration
const baseUserSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  bio: z.string().optional(),
  profileImage: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Add team-specific fields for team registration
const teamSchema = z.object({
  ...baseUserSchema.shape,
  teamName: z.string().min(2, "Team name is required"),
  teamDescription: z.string().optional(),
  teamGoalAmount: z.number().min(100, "Goal must be at least $100").default(1000),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Define types for form values
type IndividualRegistrationFormValues = z.infer<typeof baseUserSchema>;
type TeamRegistrationFormValues = z.infer<typeof teamSchema>;

interface RegistrationFormProps {
  type: "individual" | "team";
}

const RegistrationForm = ({ type }: RegistrationFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  
  // Initialize forms based on registration type
  const individualForm = useForm<IndividualRegistrationFormValues>({
    resolver: zodResolver(baseUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      confirmPassword: "",
      bio: "",
      profileImage: "",
      agreeToTerms: false
    }
  });
  
  const teamForm = useForm<TeamRegistrationFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      confirmPassword: "",
      bio: "",
      profileImage: "",
      agreeToTerms: false,
      teamName: "",
      teamDescription: "",
      teamGoalAmount: 1000
    }
  });
  
  const form = type === "individual" ? individualForm : teamForm;
  
  // Register individual
  const registerIndividual = useMutation({
    mutationFn: async (data: IndividualRegistrationFormValues) => {
      const { confirmPassword, agreeToTerms, ...userData } = data;
      const response = await apiRequest("POST", "/api/auth/register", userData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Your account has been created. You are now logged in.",
      });
      setRegistrationComplete(true);
      
      // Redirect after showing success message
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      setSubmitting(false);
    }
  });
  
  // Register team and captain
  const registerTeam = useMutation({
    mutationFn: async (data: TeamRegistrationFormValues) => {
      // First register the user
      const { confirmPassword, agreeToTerms, teamName, teamDescription, teamGoalAmount, ...userData } = data;
      
      const userResponse = await apiRequest("POST", "/api/auth/register", userData);
      const userResult = await userResponse.json();
      
      // Then create the team with the new user as captain
      if (userResult.user) {
        const teamResponse = await apiRequest("POST", "/api/teams", {
          name: teamName,
          description: teamDescription || "",
          goalAmount: teamGoalAmount,
          captainId: userResult.user.id
        });
        
        return teamResponse.json();
      }
      
      throw new Error("User registration failed");
    },
    onSuccess: () => {
      toast({
        title: "Team Registration Successful",
        description: "Your team has been created and you are now the team captain.",
      });
      setRegistrationComplete(true);
      
      // Redirect after showing success message
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Team Registration Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      setSubmitting(false);
    }
  });
  
  // Handle form submission
  const onSubmit = async (data: IndividualRegistrationFormValues | TeamRegistrationFormValues) => {
    setSubmitting(true);
    
    if (type === "individual") {
      registerIndividual.mutate(data as IndividualRegistrationFormValues);
    } else {
      registerTeam.mutate(data as TeamRegistrationFormValues);
    }
  };
  
  if (registrationComplete) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8" />
          </div>
          <h3 className="font-heading font-bold text-xl mb-2 text-gray-900">Registration Complete!</h3>
          <p className="text-gray-600 mb-4">
            {type === "individual"
              ? "Your account has been created successfully."
              : "Your team has been created and you're now the team captain."}
          </p>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="font-heading font-bold text-xl mb-4 text-gray-900">
          {type === "individual" ? "Individual Registration" : "Team Registration"}
        </h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Bio (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us a little about yourself..." 
                          className="resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        This will be displayed on your fundraising page.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Separator />
            
            {/* Team Information Section (Only for team registration) */}
            {type === "team" && (
              <>
                <div>
                  <h3 className="text-lg font-medium mb-4">Team Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="teamName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Awesome Team" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="teamDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What makes your team special?" 
                              className="resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            This will be displayed on your team's fundraising page.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="teamGoalAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fundraising Goal</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                              <Input 
                                type="number" 
                                min="100" 
                                step="100"
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Set a realistic goal for your team to achieve.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
              </>
            )}
            
            {/* Account Information Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormDescription>
                        Choose a unique username for your account.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="md:col-span-2"></div>
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the terms and conditions
                    </FormLabel>
                    <FormDescription>
                      By checking this box, you agree to our{" "}
                      <a href="#" className="text-primary underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-primary underline">
                        Privacy Policy
                      </a>
                      .
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full rounded-full"
              disabled={submitting}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitting ? "Registering..." : "Complete Registration"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
