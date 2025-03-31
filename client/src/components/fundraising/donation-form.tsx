import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatCurrency } from '@/lib/utils';

// Define form schema using zod
const donationSchema = z.object({
  amount: z.coerce.number().min(5, { message: 'Minimum donation is $5' }).max(100000, { message: 'Maximum donation is $100,000' }),
  donorName: z.string().min(2, { message: 'Please enter your name' }),
  donorEmail: z.string().email({ message: 'Please enter a valid email' }),
  isAnonymous: z.boolean().default(false),
  message: z.string().optional(),
  isInHonorOf: z.boolean().default(false),
  honoreeInfo: z.string().optional(),
});

export interface DonationFormProps {
  entityType: 'team' | 'user' | 'event';
  entityId?: number;
  defaultAmount?: number;
}

const DonationForm: React.FC<DonationFormProps> = ({ 
  entityType, 
  entityId,
  defaultAmount = 25 
}) => {
  const { toast } = useToast();
  const [donationStep, setDonationStep] = useState<'donation' | 'payment'>('donation');
  
  // Preset donation amounts
  const presetAmounts = [25, 50, 100, 250, 500];
  const [selectedAmount, setSelectedAmount] = useState<number | null>(defaultAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  
  // Initialize the form
  const form = useForm<z.infer<typeof donationSchema>>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: defaultAmount,
      donorName: '',
      donorEmail: '',
      isAnonymous: false,
      message: '',
      isInHonorOf: false,
      honoreeInfo: '',
    },
  });
  
  // Handle amount selection
  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    form.setValue('amount', amount);
  };
  
  // Handle custom amount input
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setCustomAmount(value);
    setSelectedAmount(null);
    form.setValue('amount', value ? parseFloat(value) : 0);
  };
  
  // Handle donation mutation
  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof donationSchema>) => {
      // Add entity info to donation data
      const donationData = {
        ...data,
        ...(entityType === 'team' && { teamId: entityId }),
        ...(entityType === 'user' && { userId: entityId }),
      };
      
      return apiRequest('POST', '/api/donations', donationData);
    },
    onSuccess: () => {
      // Reset form and show success message
      form.reset();
      setDonationStep('donation');
      setSelectedAmount(defaultAmount);
      setCustomAmount('');
      
      // Invalidate relevant queries to refresh data
      if (entityType === 'team' && entityId) {
        queryClient.invalidateQueries({ queryKey: ['/api/teams', entityId] });
      } else if (entityType === 'user' && entityId) {
        queryClient.invalidateQueries({ queryKey: ['/api/fundraisers', entityId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['/api/event'] });
      }
      
      toast({
        title: 'Donation successful!',
        description: 'Thank you for your generous donation.',
      });
    },
    onError: (error) => {
      console.error('Donation error:', error);
      toast({
        title: 'Donation failed',
        description: 'There was an error processing your donation. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (data: z.infer<typeof donationSchema>) => {
    if (donationStep === 'donation') {
      // Move to payment step
      setDonationStep('payment');
    } else {
      // Submit payment
      mutation.mutate(data);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {donationStep === 'donation' ? (
          <>
            {/* Donation Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Donation Amount</FormLabel>
                  <div>
                    <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {presetAmounts.map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant={selectedAmount === amount ? 'default' : 'outline'}
                          onClick={() => handleAmountSelect(amount)}
                          className="h-10 text-center"
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          className="pl-7"
                          placeholder="Custom amount"
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Minimum donation is $5
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            {/* Donor Name */}
            <FormField
              control={form.control}
              name="donorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Donor Email */}
            <FormField
              control={form.control}
              name="donorEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email" type="email" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your receipt will be sent to this email
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Anonymous Donation */}
            <FormField
              control={form.control}
              name="isAnonymous"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Make my donation anonymous</FormLabel>
                    <FormDescription>
                      Your name will not be displayed publicly
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            {/* Donation Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Leave a message with your donation"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Tribute Donation */}
            <FormField
              control={form.control}
              name="isInHonorOf"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tribute Information (Optional)</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(value === 'true')}
                      defaultValue={field.value ? 'true' : 'false'}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="false" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Regular donation
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="true" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          In honor/memory of someone
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Honor Info */}
            {form.watch('isInHonorOf') && (
              <FormField
                control={form.control}
                name="honoreeInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Honoree Information</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., In memory of John Smith"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </>
        ) : (
          <>
            {/* Payment Summary */}
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-lg font-semibold">Donation Summary</h3>
              <div className="flex justify-between border-b pb-2">
                <span>Donation Amount:</span>
                <span className="font-medium">{formatCurrency(form.getValues('amount'))}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span>Total:</span>
                <span className="text-lg font-bold">{formatCurrency(form.getValues('amount'))}</span>
              </div>
            </div>
            
            {/* Payment Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payment Information</h3>
              <p className="text-sm text-muted-foreground">
                This is a demo application. No payment will be processed. 
                <br />In a real application, Stripe or another payment provider would be integrated here.
              </p>
              
              <div className="rounded-lg border p-4">
                <div className="mb-3">
                  <label className="mb-1 block text-sm" htmlFor="card-number">Card Number</label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm" htmlFor="expiry">Expiry Date</label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm" htmlFor="cvc">CVC</label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                By completing this donation, you agree to our terms of service and privacy policy.
              </p>
            </div>
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDonationStep('donation')}
              >
                Back
              </Button>
            </div>
          </>
        )}
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={mutation.isPending}
        >
          {mutation.isPending 
            ? 'Processing...' 
            : donationStep === 'donation' 
              ? 'Continue to Payment' 
              : 'Complete Donation'
          }
        </Button>
      </form>
    </Form>
  );
};

export default DonationForm;