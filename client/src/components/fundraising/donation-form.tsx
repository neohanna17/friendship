import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, Heart, Sparkles, Star, Award, Gift, ChevronsRight } from "lucide-react";

const donationSchema = z.object({
  amount: z.number().min(5, "Minimum donation is $5"),
  donorName: z.string().min(2, "Please enter your name"),
  donorEmail: z.string().email("Please enter a valid email"),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  isInHonorOf: z.boolean().default(false),
  honoreeInfo: z.string().optional(),
});

type DonationFormValues = z.infer<typeof donationSchema>;

interface DonationFormProps {
  teamId?: number;
  userId?: number;
}

const DonationForm = ({ teamId, userId }: DonationFormProps) => {
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment'>('details');
  const [impactLevel, setImpactLevel] = useState<string>('Supporter');
  const [showImpactBadge, setShowImpactBadge] = useState<boolean>(false);
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 25,
      donorName: "",
      donorEmail: "",
      message: "",
      isAnonymous: false,
      isInHonorOf: false,
      honoreeInfo: "",
    },
  });
  
  const presetAmounts = [10, 25, 50, 100, 250];
  const [customAmount, setCustomAmount] = useState<boolean>(false);
  
  // Impact levels based on donation amount
  const impactLevels = [
    { level: 'Supporter', minAmount: 5, icon: <Heart className="h-4 w-4" />, color: 'bg-pink-100 text-pink-700' },
    { level: 'Friend', minAmount: 25, icon: <Star className="h-4 w-4" />, color: 'bg-purple-100 text-purple-700' },
    { level: 'Champion', minAmount: 50, icon: <Sparkles className="h-4 w-4" />, color: 'bg-indigo-100 text-indigo-700' },
    { level: 'Hero', minAmount: 100, icon: <Award className="h-4 w-4" />, color: 'bg-secondary/20 text-secondary' },
    { level: 'Legend', minAmount: 250, icon: <Gift className="h-4 w-4" />, color: 'rainbow-border bg-white text-primary' }
  ];
  
  // Create donation and get Stripe payment intent
  const createDonation = useMutation({
    mutationFn: async (data: DonationFormValues) => {
      const response = await apiRequest("POST", "/api/donations", {
        ...data,
        teamId: teamId || null,
        userId: userId || null,
      });
      return response.json();
    },
  });
  
  // Process Stripe payment
  const processPayment = useMutation({
    mutationFn: async ({ clientSecret }: { clientSecret: string }) => {
      if (!stripe || !elements) {
        throw new Error("Stripe has not been initialized");
      }
      
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return paymentIntent;
    },
  });
  
  const onSubmit = async (data: DonationFormValues) => {
    if (paymentStep === 'details') {
      try {
        const result = await createDonation.mutateAsync(data);
        if (result.clientSecret) {
          setPaymentStep('payment');
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process donation. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      try {
        if (!createDonation.data?.clientSecret) {
          throw new Error("Payment information not found");
        }
        
        await processPayment.mutateAsync({ 
          clientSecret: createDonation.data.clientSecret 
        });
        
        // Success toast with a simpler format to avoid type errors
        toast({
          title: "Thank you for your donation!",
          description: `Your ${impactLevel} level support makes a difference! You've earned a ${impactLevel} badge!`,
          className: "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200",
        });
        
        // Reset form and go back to first step
        form.reset();
        setPaymentStep('details');
        setCustomAmount(false);
      } catch (error) {
        toast({
          title: "Payment Failed",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive",
        });
      }
    }
  };
  
  // Update impact level when amount changes
  useEffect(() => {
    const amount = form.getValues("amount");
    const newLevel = impactLevels.reduceRight((prev, current) => {
      return amount >= current.minAmount ? current : prev;
    }, impactLevels[0]);
    
    setImpactLevel(newLevel.level);
  }, [form.watch("amount")]);

  const handleAmountClick = (amount: number) => {
    setCustomAmount(false);
    form.setValue("amount", amount);
    setShowImpactBadge(true);
  };
  
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      form.setValue("amount", value);
      setShowImpactBadge(true);
    }
  };
  
  // Get the current impact level badge
  const getCurrentImpactBadge = () => {
    return impactLevels.find(level => level.level === impactLevel) || impactLevels[0];
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <h2 className="font-heading font-bold text-2xl mb-4 text-center text-gray-900">
          {paymentStep === 'details' ? 'Make a Donation' : 'Payment Information'}
        </h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {paymentStep === 'details' ? (
              <>
                {/* Amount Section */}
                <div className="space-y-4">
                  <FormLabel>Select Amount</FormLabel>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {presetAmounts.map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant={form.getValues("amount") === amount && !customAmount ? "default" : "outline"}
                        onClick={() => handleAmountClick(amount)}
                        className="h-10 hover:scale-105 transition-transform"
                      >
                        ${amount}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      variant={customAmount ? "default" : "outline"}
                      onClick={() => setCustomAmount(true)}
                      className="h-10 hover:scale-105 transition-transform"
                    >
                      Other
                    </Button>
                  </div>
                  
                  {customAmount && (
                    <div>
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                                <Input
                                  type="number"
                                  min="5"
                                  step="1"
                                  placeholder="Amount"
                                  className="pl-7"
                                  onChange={handleCustomAmountChange}
                                  defaultValue={field.value}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  {/* Impact Badge */}
                  {showImpactBadge && (
                    <div className="animate-fadeIn mt-4">
                      <div className="text-center mb-2">
                        <p className="text-sm font-medium text-gray-500">Your Impact Level</p>
                      </div>
                      <div className="flex justify-center">
                        <Badge 
                          className={`px-3 py-1.5 flex items-center gap-1.5 text-sm font-medium ${getCurrentImpactBadge().color} transition-all duration-300 animate-pulse-once`}
                        >
                          {getCurrentImpactBadge().icon}
                          {impactLevel} Level
                        </Badge>
                      </div>
                      <p className="text-center text-xs mt-2 text-gray-500">
                        {impactLevel === 'Supporter' && 'Thank you for your support!'}
                        {impactLevel === 'Friend' && 'You\'re making a real difference!'}
                        {impactLevel === 'Champion' && 'Incredible impact! Your donation helps many.'}
                        {impactLevel === 'Hero' && 'You\'re a true hero! Amazing generosity.'}
                        {impactLevel === 'Legend' && 'Legendary! Your support transforms lives.'}
                      </p>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                {/* Donor Information */}
                <FormField
                  control={form.control}
                  name="donorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="donorEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Your Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Leave a message of support" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="isAnonymous"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Make donation anonymous</FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isInHonorOf"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">Donate in honor or memory of someone</FormLabel>
                        </div>
                        
                        {field.value && (
                          <FormField
                            control={form.control}
                            name="honoreeInfo"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="In honor/memory of..." {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-center mb-4">
                    Donation Amount: <strong>${form.getValues("amount")}</strong>
                  </p>
                  <Separator />
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <Sparkles className="h-4 w-4 text-secondary mr-2" />
                    <FormLabel className="text-lg">Card Information</FormLabel>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-5 mt-1 shadow-sm transition-all hover:shadow-md hover:shadow-purple-100">
                    <div className="mb-4 flex justify-between items-center">
                      <div className="text-sm text-gray-500">Secure Payment</div>
                      <div className="flex gap-1">
                        <div className="h-6 w-10 rounded bg-blue-500"></div>
                        <div className="h-6 w-10 rounded bg-red-500"></div>
                        <div className="h-6 w-10 rounded bg-yellow-500"></div>
                      </div>
                    </div>
                    <CardElement options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          fontFamily: "'Montserrat', sans-serif",
                          color: '#424770',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                          iconColor: '#bf83ff',
                        },
                        invalid: {
                          color: '#9e2146',
                          iconColor: '#fa586a',
                        },
                      }
                    }} />
                  </div>
                  <div className="mt-2 flex items-center text-xs text-gray-500 justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Secured by Stripe
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPaymentStep('details')}
                  className="mr-2"
                >
                  Back
                </Button>
              </>
            )}
            
            <Button
              type="submit"
              className="w-full group relative overflow-hidden transition-all duration-300 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/20"
              disabled={
                (paymentStep === 'details' && createDonation.isPending) || 
                (paymentStep === 'payment' && (processPayment.isPending || !stripe || !elements))
              }
            >
              <div className="absolute inset-0 w-1/3 bg-white/20 skew-x-12 group-hover:animate-shimmer" />
              
              <div className="flex items-center justify-center">
                {(paymentStep === 'details' && createDonation.isPending) || 
                 (paymentStep === 'payment' && processPayment.isPending) ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  paymentStep === 'details' ? 
                    <ChevronsRight className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /> : 
                    <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                )}
                
                <span>
                  {paymentStep === 'details' ? 'Continue to Payment' : 'Complete Donation'}
                </span>
              </div>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DonationForm;
