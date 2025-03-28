import { motion } from "framer-motion";
import { Building2, Users, Heart, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-purple-800/90" />
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl text-white font-bold mb-4">
              About Friendship Circle
            </h1>
            <p className="text-white/90 text-lg md:text-xl">
              Creating friendships and support for individuals with special needs and their families
            </p>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-6">
              Welcome to Friendship Circle
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Friendship Circle of Michigan is a non-profit organization affiliated with Lubavitch of Michigan. 
              Our goal is to provide every individual with special needs the support, friendship, and inclusion they deserve.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardContent className="space-y-4">
                <h3 className="font-heading text-2xl font-bold text-gray-900">Our Mission</h3>
                <p className="text-gray-600">
                  Friendship Circle creates friendship in the lives of individuals with special needs and those facing isolation 
                  while providing an opportunity to become a contributing member of the community.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="space-y-4">
                <h3 className="font-heading text-2xl font-bold text-gray-900">Our Values</h3>
                <p className="text-gray-600">
                  Friendship Circle is founded upon the idea that within each person is a soul; and that soul is equal 
                  and worthy of boundless love.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <Building2 className="h-12 w-12 text-primary mb-4" />
              <h4 className="font-heading text-xl font-bold text-gray-900 mb-2">Open To All</h4>
              <p className="text-gray-600">
                We welcome families and individuals of all ages & religious backgrounds
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <Users className="h-12 w-12 text-primary mb-4" />
              <h4 className="font-heading text-xl font-bold text-gray-900 mb-2">Volunteer Based</h4>
              <p className="text-gray-600">
                Our community of volunteers helps make all programs and friendships possible
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <Heart className="h-12 w-12 text-primary mb-4" />
              <h4 className="font-heading text-xl font-bold text-gray-900 mb-2">Non-Profit</h4>
              <p className="text-gray-600">
                Thanks to our donors we support thousands of families and individuals
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-6">Our Impact</h2>
            <p className="text-gray-600 text-lg">
              Through our programming, Friendship Circle aims to promote an inclusive community 
              that values all individuals regardless of the challenges they face.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">3,000+</div>
              <div className="text-gray-600">Individuals Supported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">30+</div>
              <div className="text-gray-600">Dedicated Staff Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24+</div>
              <div className="text-gray-600">Board Members</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;