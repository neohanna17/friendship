import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";

interface NewsletterForm {
  email: string;
}

const Footer = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewsletterForm>();
  const { toast } = useToast();
  
  const onSubmit = (data: NewsletterForm) => {
    // In a real implementation, this would send the email to a newsletter API
    toast({
      title: "Thank you for subscribing!",
      description: "You've been added to our newsletter list.",
    });
    reset();
  };
  
  return (
    <footer className="bg-[#333] text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">About Friendship Circle</h3>
            <p className="text-gray-300 mb-4">
              Friendship Circle provides programs and support to individuals with special needs and their families.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-secondary transition">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-secondary transition">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-secondary transition">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-secondary transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-secondary transition">Home</Link></li>
              <li><Link href="/register" className="text-gray-300 hover:text-secondary transition">Register</Link></li>
              <li><Link href="/donate" className="text-gray-300 hover:text-secondary transition">Donate</Link></li>
              <li><Link href="/teams" className="text-gray-300 hover:text-secondary transition">Teams</Link></li>
              <li><Link href="/sponsors" className="text-gray-300 hover:text-secondary transition">Sponsors</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-secondary shrink-0 mt-1" />
                <span className="text-gray-300">6892 W Maple Rd, West Bloomfield, MI 48322</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-secondary shrink-0" />
                <span className="text-gray-300">(248) 788-7878</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-secondary shrink-0" />
                <span className="text-gray-300">info@friendshipcircle.org</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">Stay updated with our latest news and events.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-md focus:outline-none text-dark"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
              <Button type="submit" className="bg-secondary hover:bg-opacity-80 py-2 rounded-md font-semibold transition">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 mt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Friendship Circle of Michigan. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-secondary transition">Privacy Policy</a>
            <a href="#" className="hover:text-secondary transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
