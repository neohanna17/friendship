import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const RegisterCTA = () => {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
          Join Us for Walk for Friendship 2025!
        </h2>
        <p className="text-xl max-w-3xl mx-auto mb-8">
          Register today and become part of a movement that changes lives through friendship and inclusion.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register?type=individual">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full">
              Register as Individual
            </Button>
          </Link>
          <Link href="/register?type=team">
            <Button size="lg" variant="secondary" className="rounded-full">
              Create a Team
            </Button>
          </Link>
          <Link href="/teams">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white rounded-full">
              Join a Team
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RegisterCTA;
