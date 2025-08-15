import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Compass, Target, TrendingUp, Users, CheckCircle, Sparkles, ArrowRight, Star } from "lucide-react";
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
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-95"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Career Guidance</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Perfect Career
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              India's most trusted AI career counselor. Get personalized recommendations 
              based on your academics, interests, and personality - tailored for the Indian job market.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => navigate('/profile')}
                className="bg-white text-primary hover:bg-white/90 hover:scale-105 min-w-[250px]"
              >
                <Compass className="w-5 h-5 mr-2" />
                Start Your Career Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span className="text-sm">100% Free • No Registration Required</span>
              </div>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-sm text-white/70">Students Guided</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">95%</div>
                <div className="text-sm text-white/70">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-white/70">Career Paths</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose <span className="bg-gradient-hero bg-clip-text text-transparent">CareerJyoti</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI technology meets deep understanding of the Indian education and job market
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300 border-0 bg-gradient-card animate-fade-in">
                <CardHeader>
                  <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Everything You Need for 
                <span className="bg-gradient-secondary bg-clip-text text-transparent block">
                  Career Success
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our comprehensive analysis covers every aspect of your profile to provide 
                the most accurate and actionable career guidance.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
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
            
            <div className="relative">
              <div className="bg-gradient-card rounded-2xl p-8 shadow-elegant">
                <h3 className="text-2xl font-semibold mb-6 text-center">Sample Career Match</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Match Score</span>
                    <Badge className="bg-secondary text-secondary-foreground">96%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Career</span>
                    <span className="font-medium">Software Engineer</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Salary Range</span>
                    <span className="font-medium text-secondary">₹8L - ₹15L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Growth</span>
                    <span className="font-medium text-accent">Excellent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Success Stories from <span className="bg-gradient-hero bg-clip-text text-transparent">Students</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              See how CareerJyoti has helped thousands of students find their perfect career path
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300 bg-gradient-card border-0">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <Badge variant="outline" className="w-fit">{testimonial.stream}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Discover Your Future?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have found their perfect career path with CareerJyoti's AI-powered guidance.
          </p>
          
          <Button 
            variant="hero" 
            size="xl"
            onClick={() => navigate('/profile')}
            className="bg-white text-primary hover:bg-white/90 hover:scale-105 min-w-[280px]"
          >
            <Compass className="w-5 h-5 mr-2" />
            Start Your Analysis Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <p className="text-white/70 text-sm mt-4">
            Takes only 5 minutes • Get instant results • Completely free
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;