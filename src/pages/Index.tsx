import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Compass, Target, TrendingUp, Users, CheckCircle, Sparkles, ArrowRight, Star, Award, BookOpen, BrainCircuit } from "lucide-react";
import Header from "@/components/Header";
import heroImage from "@/assets/hero-students.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: "Personalized Analysis",
      description: "AI-powered career matching based on your unique academic profile, interests, and personality traits.",
      color: "text-primary"
    },
    {
      icon: TrendingUp,
      title: "India-Focused Insights",
      description: "Salary ranges, job demand, and growth prospects specifically relevant to the Indian job market.",
      color: "text-secondary"
    },
    {
      icon: Users,
      title: "Industry Connections",
      description: "Connect your skills with top sectors and companies actively hiring in India.",
      color: "text-accent"
    }
  ];

  const benefits = [
    "Detailed career path analysis tailored for Indian students",
    "Real-time job market data and salary insights",
    "Personality-based career matching algorithm",
    "Industry-specific guidance and recommendations",
    "Future growth and scope predictions",
    "Top sector identification for your profile"
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      stream: "Science PCM",
      quote: "CareerJyoti helped me discover my passion for AI and machine learning. Now I'm working at a top tech company!",
      rating: 5
    },
    {
      name: "Arjun Patel",
      stream: "Commerce",
      quote: "The financial analyst recommendation was spot-on. The salary insights helped me negotiate better offers.",
      rating: 5
    },
    {
      name: "Sneha Reddy",
      stream: "Science PCB",
      quote: "Found my calling in biomedical engineering through CareerJyoti's personalized analysis.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-95"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        
        <div className="relative container mx-auto px-4 py-16 sm:py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 mb-6 border border-white/20">
              <BrainCircuit className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">AI-Powered Career Guidance</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Perfect Career
              </span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
              India's most trusted AI career counselor. Get personalized recommendations 
              based on your academics, interests, and personality - tailored for the Indian job market.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => navigate('/profile')}
                className="bg-white text-primary hover:bg-white/90 hover:scale-105 w-full sm:w-auto sm:min-w-[250px]"
              >
                <Compass className="w-5 h-5 mr-2" />
                Start Your Career Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span className="text-xs sm:text-sm">100% Free • No Registration Required</span>
              </div>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto px-4">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">50K+</div>
                <div className="text-xs sm:text-sm text-white/70">Students Guided</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">95%</div>
                <div className="text-xs sm:text-sm text-white/70">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">500+</div>
                <div className="text-xs sm:text-sm text-white/70">Career Paths</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Why Choose <span className="bg-gradient-hero bg-clip-text text-transparent">CareerJyoti</span>?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI technology meets deep understanding of the Indian education and job market
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300 border-0 bg-gradient-card animate-fade-in group">
                <CardHeader className="pb-4">
                  <feature.icon className={`w-10 sm:w-12 h-10 sm:h-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`} />
                  <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
                Everything You Need for 
                <span className="bg-gradient-secondary bg-clip-text text-transparent block">
                  Career Success
                </span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
                Our comprehensive analysis covers every aspect of your profile to provide 
                the most accurate and actionable career guidance.
              </p>
              
              <div className="space-y-3 sm:space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="secondary" 
                size="lg" 
                className="mt-8"
                onClick={() => navigate('/profile')}
              >
                Get Started Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            <div className="relative lg:order-1">
              <div className="bg-gradient-card rounded-2xl p-6 sm:p-8 shadow-elegant hover:shadow-glow transition-all duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="w-6 h-6 text-primary" />
                  <h3 className="text-lg sm:text-2xl font-semibold">Sample Career Match</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-muted-foreground">Match Score</span>
                    <Badge className="bg-secondary text-secondary-foreground font-semibold">96%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-muted-foreground">Career</span>
                    <span className="text-sm sm:text-base font-medium">Software Engineer</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-muted-foreground">Salary Range</span>
                    <span className="text-sm sm:text-base font-medium text-secondary">₹8L - ₹15L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-muted-foreground">Growth</span>
                    <span className="text-sm sm:text-base font-medium text-accent">Excellent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Success Stories from <span className="bg-gradient-hero bg-clip-text text-transparent">Students</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
              See how CareerJyoti has helped thousands of students find their perfect career path
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300 bg-gradient-card border-0 group">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <CardTitle className="text-base sm:text-lg group-hover:text-primary transition-colors">{testimonial.name}</CardTitle>
                  <Badge variant="outline" className="w-fit text-xs">{testimonial.stream}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base text-muted-foreground italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6">
            Ready to Discover Your Future?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have found their perfect career path with CareerJyoti's AI-powered guidance.
          </p>
          
          <Button 
            variant="hero" 
            size="xl"
            onClick={() => navigate('/profile')}
            className="bg-white text-primary hover:bg-white/90 hover:scale-105 w-full sm:w-auto sm:min-w-[280px]"
          >
            <Compass className="w-5 h-5 mr-2" />
            Start Your Analysis Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <p className="text-white/70 text-xs sm:text-sm mt-4">
            Takes only 5 minutes • Get instant results • Completely free
          </p>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-background border-t border-border/40 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-lg">
                  <Compass className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  CareerJyoti
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                Empowering Indian students with AI-powered career guidance. 
                Make informed decisions about your future with personalized recommendations.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
                <li><a href="/profile" className="text-muted-foreground hover:text-primary transition-colors">Start Assessment</a></li>
                <li><a href="/results" className="text-muted-foreground hover:text-primary transition-colors">View Results</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/40 mt-8 pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              © 2025 CareerJyoti. All rights reserved. Built with ❤️ for Indian students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;