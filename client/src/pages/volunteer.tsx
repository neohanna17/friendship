import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar, CheckCircle2, Clock, MapPin, Users, CalendarDays } from "lucide-react";
import { createConfetti } from "@/lib/confetti";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  tshirtSize: z.string().optional(),
  attendMeeting: z.enum(["yes", "no"]),
  volunteerShift: z.array(z.string()).min(1, "Please select at least one shift"),
  preferredStation: z.string().optional(),
  groupName: z.string().optional(),
  comments: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const VolunteerPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      tshirtSize: "",
      attendMeeting: "yes",
      volunteerShift: [],
      preferredStation: "",
      groupName: "",
      comments: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    
    // Show toast notification
    toast({
      title: "Volunteer Registration Submitted!",
      description: "Thank you for volunteering. We will be in touch soon!",
    });
    
    // Show confetti effect
    createConfetti();
    
    // Set submitted state
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Walk4Friendship Volunteer Registration
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Thank you for your interest in volunteering for the Walk4Friendship on September 1st, 2024.
            </p>
          </div>

          {isSubmitted ? (
            <Card className="border-green-200 shadow-lg bg-green-50">
              <CardContent className="pt-6 px-6 pb-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-800 mb-4">Thank You for Volunteering!</h2>
                <p className="text-green-700 mb-6">
                  Your registration has been submitted successfully. We appreciate your commitment to making Walk4Friendship a success!
                </p>
                <p className="text-green-700 mb-2">
                  We will be in touch soon with additional details.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="space-y-6 sticky top-24">
                  <Card className="shadow-md border-none">
                    <CardHeader>
                      <CardTitle>Event Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Calendar className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-medium">Walk Date</h3>
                          <p className="text-gray-500">Sunday, September 1, 2024</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-medium">Volunteer Shifts</h3>
                          <p className="text-gray-500">9:30am - 11:30am (Opening)</p>
                          <p className="text-gray-500">11:30am - 1:30pm (First Shift)</p>
                          <p className="text-gray-500">1:30pm - 3:30pm (Second Shift)</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-medium">Locations</h3>
                          <p className="text-gray-500">Farber Center: 5586 Drake Rd.</p>
                          <p className="text-gray-500">Meer Center Carnival</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <CalendarDays className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-medium">Prep Meeting</h3>
                          <p className="text-gray-500">Wednesday, August 14th, 6pm</p>
                          <p className="text-gray-500">Fetter Hall</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Users className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-medium">Contact</h3>
                          <p className="text-gray-500">Rabbi Mendel</p>
                          <p className="text-gray-500">248-489-6376</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Card className="shadow-md border-none">
                  <CardHeader className="px-8">
                    <CardTitle>Volunteer Registration Form</CardTitle>
                    <CardDescription>
                      In addition to the joy you will feel from the excitement of community and friendship, you will also receive a Walk4Friendship volunteer t-shirt!
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-8">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="First name" {...field} className="w-full" />
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
                                <FormLabel>Last Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Last name" {...field} className="w-full" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input placeholder="your@email.com" type="email" {...field} className="w-full" />
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
                                <FormLabel>Phone Number *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your phone number" {...field} className="w-full" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="tshirtSize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>T-shirt Size</FormLabel>
                              <p className="text-sm text-gray-500 mb-2">
                                Keep in mind that our volunteer shirts are the same from year to year
                              </p>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your t-shirt size" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="no-new">I already have a Walk4Friendship volunteer shirt</SelectItem>
                                  <SelectItem value="XS">XS</SelectItem>
                                  <SelectItem value="S">S</SelectItem>
                                  <SelectItem value="M">M</SelectItem>
                                  <SelectItem value="L">L</SelectItem>
                                  <SelectItem value="XL">XL</SelectItem>
                                  <SelectItem value="XXL">XXL</SelectItem>
                                  <SelectItem value="XXXL">XXXL</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="attendMeeting"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>
                                Will you attend the volunteer prep and information session on Wednesday, August 14th, 6pm at Fetter Hall? *
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id="meeting-yes" />
                                    <Label htmlFor="meeting-yes">Yes, I will be there!</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id="meeting-no" />
                                    <Label htmlFor="meeting-no">
                                      I would like to be there but cannot attend at this date and time - please get in touch with me
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="volunteerShift"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>
                                Where would you like to volunteer during the Walk? *
                              </FormLabel>
                              <p className="text-sm text-gray-500 mt-0">
                                We will try to accommodate all requests as best we are able
                              </p>
                              <FormControl>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  {[
                                    {
                                      value: "opening",
                                      label: "Walk Preparation and Opening at Farber - 9:30-11:30am"
                                    },
                                    {
                                      value: "first-shift",
                                      label: "First Shift at Meer Center Carnival - 11:30am-1:30pm"
                                    },
                                    {
                                      value: "second-shift",
                                      label: "Second Shift at Meer Center Carnival - 1:30-3:30pm"
                                    }
                                  ].map((option) => (
                                    <div
                                      key={option.value}
                                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                        field.value?.includes(option.value)
                                          ? "border-primary bg-primary/10"
                                          : "border-gray-200 hover:border-primary/50"
                                      }`}
                                      onClick={() => {
                                        const currentValues = [...(field.value || [])];
                                        const index = currentValues.indexOf(option.value);
                                        
                                        if (index === -1) {
                                          field.onChange([...currentValues, option.value]);
                                        } else {
                                          currentValues.splice(index, 1);
                                          field.onChange(currentValues);
                                        }
                                      }}
                                    >
                                      <div className="flex items-center space-x-2">
                                        <div
                                          className={`w-5 h-5 rounded-md border ${
                                            field.value?.includes(option.value)
                                              ? "bg-primary border-primary text-white"
                                              : "border-gray-300"
                                          } flex items-center justify-center`}
                                        >
                                          {field.value?.includes(option.value) && (
                                            <CheckCircle2 className="h-4 w-4 text-white" />
                                          )}
                                        </div>
                                        <span>{option.label}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="preferredStation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Station</FormLabel>
                              <p className="text-sm text-gray-500 mb-2">
                                If you have a preference for what station you would like to work during the Walk (food, entertainment, etc.), please enter it here - we will try to accommodate all requests as best we are able
                              </p>
                              <FormControl>
                                <Input placeholder="Your preferred station" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="groupName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Volunteer Group</FormLabel>
                              <p className="text-sm text-gray-500 mb-2">
                                If you are volunteering with a group, please say which group you are volunteering with
                              </p>
                              <FormControl>
                                <Input placeholder="Your group name (if applicable)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="comments"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Comments or Questions</FormLabel>
                              <p className="text-sm text-gray-500 mb-2">
                                Thank you for your involvement in Walk4Friendship 2024! Please let us know if you have any comments or questions!
                              </p>
                              <FormControl>
                                <Textarea
                                  placeholder="Your comments or questions"
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" size="lg" className="w-full">
                          Submit Volunteer Registration
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerPage;