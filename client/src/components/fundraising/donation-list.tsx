import { formatCurrency } from "@/lib/utils";
import { Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Donation {
  id: number;
  amount: number;
  donorName: string;
  message?: string;
  isAnonymous: boolean;
  createdAt: string;
}

interface DonationListProps {
  donations: Donation[];
}

const DonationList = ({ donations }: DonationListProps) => {
  if (!donations || donations.length === 0) {
    return (
      <div className="text-center py-8">
        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
        <p className="text-muted-foreground">No donations yet.</p>
        <p className="text-sm text-muted-foreground mt-1">Be the first to support this fundraiser!</p>
      </div>
    );
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Recent";
    }
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      {donations.map((donation, index) => (
        <div key={donation.id}>
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10 bg-primary/10">
              <AvatarFallback className="text-primary">
                {donation.isAnonymous ? 
                  "A" : 
                  donation.donorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                }
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">
                  {donation.isAnonymous ? "Anonymous" : donation.donorName}
                </h4>
                <span className="text-primary font-semibold">
                  {formatCurrency(donation.amount)}
                </span>
              </div>
              
              {donation.message && (
                <p className="mt-1 text-muted-foreground italic">
                  "{donation.message}"
                </p>
              )}
              
              <div className="text-xs text-muted-foreground mt-1">
                {formatDate(donation.createdAt)}
              </div>
            </div>
          </div>
          
          {index < donations.length - 1 && (
            <Separator className="my-4" />
          )}
        </div>
      ))}
    </div>
  );
};

export default DonationList;