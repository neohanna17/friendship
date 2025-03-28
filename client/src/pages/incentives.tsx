
import { IncentiveTiers } from "@/components/incentives/incentive-tiers";

export default function IncentivesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl text-gray-900 mb-4">
            Power Walker Incentives
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Raise funds and earn exclusive rewards! The more you raise, the more amazing perks you'll receive.
          </p>
        </div>
        
        <IncentiveTiers />
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            *Click each tier to learn more about program discounts and other benefits
          </p>
        </div>
      </div>
    </div>
  );
}
