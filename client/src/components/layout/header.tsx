import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlignJustify, X } from "lucide-react";

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
}

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  
  const { data } = useQuery<{ user: User | null }>({ 
    queryKey: ['/api/auth/user'],
    retry: false,
    onError: () => {}
  });
  
  const user = data?.user;
  
  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <Link href="/" className="mr-3">
              <div className="text-primary font-heading font-extrabold text-xl">
                Walk for Friendship
              </div>
            </Link>
            <div className="hidden md:flex space-x-6 ml-6">
              <NavItem href="/" label="Home" />
              <NavItem href="/register" label="Register" />
              <NavItem href="/teams" label="Teams" />
              <NavItem href="/sponsors" label="Sponsors" />
              <NavItem href="/about" label="About" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/donate">
              <Button variant="secondary" className="hidden md:block rounded-full">
                Donate Now
              </Button>
            </Link>
            {user ? (
              <Link href="/dashboard">
                <Button variant="default" className="rounded-full">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/register">
                <Button variant="default" className="rounded-full">
                  Register
                </Button>
              </Link>
            )}
            <button 
              className="md:hidden text-dark" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <AlignJustify className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white w-full py-4 px-6 shadow-md animate-fade-in">
          <div className="flex flex-col space-y-4">
            <NavItem href="/" label="Home" mobile />
            <NavItem href="/register" label="Register" mobile />
            <NavItem href="/teams" label="Teams" mobile />
            <NavItem href="/sponsors" label="Sponsors" mobile />
            <NavItem href="/about" label="About" mobile />
            <Separator />
            <Link href="/donate">
              <Button variant="secondary" className="w-full rounded-full">
                Donate Now
              </Button>
            </Link>
            {user && (
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

interface NavItemProps {
  href: string;
  label: string;
  mobile?: boolean;
}

const NavItem = ({ href, label, mobile = false }: NavItemProps) => {
  const [location] = useLocation();
  const isActive = location === href;
  
  return (
    <Link href={href}>
      <span 
        className={`${
          mobile ? 'block py-2' : 'nav-item'
        } text-dark hover:text-primary font-heading font-semibold transition ${
          isActive ? 'text-primary' : ''
        }`}
      >
        {label}
      </span>
    </Link>
  );
};

export default Header;
