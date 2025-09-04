import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Compass, Target, TrendingUp, Users, CheckCircle, Sparkles, ArrowRight, Star, Award, BookOpen, BrainCircuit, Zap, Globe, Play } from "lucide-react";
import Header from "@/components/Header";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { GridBackground } from "@/components/ui/grid-background";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import VoiceInterface from "@/components/VoiceInterface";

const Index = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);

  // Mock career recommendation function
  const handleVoiceQuery = async (query: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple keyword-based response (in a real app, this would call your AI API)
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('ai') || queryLower.includes('artificial intelligence')) {
      return translate('ai.recommendation', 
        'Based on your interest in AI, I recommend exploring careers as a Machine Learning Engineer, Data Scientist, or AI Research Scientist. These fields offer excellent growth prospects with average salaries ranging from ₹8-25 lakhs per year in India.'
      );
    } else if (queryLower.includes('math') || queryLower.includes('mathematics')) {
      return translate('math.recommendation',
        'With strong mathematics skills, you could excel as a Data Analyst, Quantitative Analyst, or Operations Research Analyst. The finance and tech sectors highly value mathematical expertise.'
      );
    } else if (queryLower.includes('programming') || queryLower.includes('coding')) {
      return translate('programming.recommendation',
        'Programming skills open doors to Software Engineering, Web Development, and Mobile App Development. With India\'s booming tech industry, these careers offer great opportunities.'
      );
    } else {
      return translate('general.recommendation',
        'I\'d be happy to help you explore career options! Could you tell me more about your interests, subjects you enjoy, or skills you have? This will help me provide more personalized recommendations.'
      );
    }
  };

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
      quote: "SkillMap.ai helped me discover my passion for AI and machine learning. Now I'm working at a top tech company!",
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
      quote: "Found my calling in biomedical engineering through SkillMap.ai's personalized analysis.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background">
        <GridBackground />
        <BackgroundBeams />
        
        <div className="relative container mx-auto px-4 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-foreground">{translate('hero.discover', 'Discover Your')}</span>{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">{translate('hero.perfect', 'Perfect Career')}</span>{" "}
              <span className="text-foreground">{translate('hero.with_ai', 'with AI')}</span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <TextGenerateEffect 
                words={translate('hero.subtitle', 'Get personalized career recommendations powered by advanced AI. Designed specifically for Indian students to navigate the modern job market with confidence.')}
                className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Button 
                variant="default"
                size="xl" 
                onClick={() => navigate('/profile')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[200px] h-12 text-lg font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Compass className="w-5 h-5 mr-2" />
                {translate('hero.cta.analysis', 'Start Free Analysis')}
              </Button>
              
              <Button 
                variant="outline" 
                size="xl"
                onClick={() => setShowVoiceInterface(!showVoiceInterface)}
                className="min-w-[200px] h-12 text-lg font-medium rounded-lg border-2 hover:bg-secondary transition-all duration-300"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                {translate('voice.startListening', 'Voice Assistant')}
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent" />
                <span>{translate('hero.stats.students', '50,000+ Students Guided')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent" />
                <span>{translate('hero.stats.careers', '500+ Career Paths')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent" />
                <span>{translate('hero.stats.accuracy', '98% Accuracy Rate')}</span>
              </div>
            </motion.div>
            
            {/* Voice Interface */}
            {showVoiceInterface && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="mt-8 flex justify-center"
              >
                <VoiceInterface 
                  onVoiceQuery={handleVoiceQuery}
                  className="w-full max-w-lg"
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Why Choose <span className="text-primary">SkillMap.ai</span>?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Advanced AI technology meets deep understanding of the Indian education and job market
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Card className="h-full border-0 shadow-card hover:shadow-elegant transition-all duration-300 bg-card/80 backdrop-blur-sm group-hover:bg-card">
                  <CardHeader className="pb-4 text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="mx-auto mb-6"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
                        <feature.icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                    </motion.div>
                    <CardTitle className="text-xl sm:text-2xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base leading-relaxed text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 sm:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                Everything You Need for 
                <span className="text-primary block">Career Success</span>
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
                Our comprehensive analysis covers every aspect of your profile to provide 
                the most accurate and actionable career guidance.
              </p>
              
              <div className="space-y-4 mb-10">
                {benefits.map((benefit, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-base sm:text-lg text-foreground leading-relaxed">{benefit}</span>
                  </motion.div>
                ))}
              </div>
              
              <Button 
                variant="default" 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 text-lg font-medium rounded-lg"
                onClick={() => navigate('/profile')}
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            <div className="relative lg:order-1">
              <div className="bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-card hover:shadow-elegant transition-all duration-300">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-foreground">Sample Career Match</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-base text-muted-foreground">Match Score</span>
                    <Badge className="bg-accent/20 text-accent border-accent/30 font-semibold text-base px-3 py-1">96%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base text-muted-foreground">Career</span>
                    <span className="text-base font-semibold text-foreground">Software Engineer</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base text-muted-foreground">Salary Range</span>
                    <span className="text-base font-semibold text-accent">₹8L - ₹15L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base text-muted-foreground">Growth</span>
                    <span className="text-base font-semibold text-primary">Excellent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 sm:py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Success Stories from <span className="text-primary">Students</span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
              See how SkillMap.ai has helped thousands of students find their perfect career path
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full shadow-card hover:shadow-elegant transition-all duration-300 bg-card border-0 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors">{testimonial.name}</CardTitle>
                    <Badge variant="outline" className="w-fit text-sm border-border/50">{testimonial.stream}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 dark:from-primary/20 dark:via-secondary/10 dark:to-accent/20"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-background/80 to-background/60 dark:from-background/90 dark:to-background/70 backdrop-blur-lg border border-border/50 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-elegant max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-6">
              Ready to Discover Your Future?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students who have found their perfect career path with SkillMap.ai's AI-powered guidance.
            </p>
            
            <Button 
              variant="default" 
              size="xl"
              onClick={() => navigate('/profile')}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105 w-full sm:w-auto sm:min-w-[280px] text-white"
            >
              <Compass className="w-5 h-5 mr-2" />
              Start Your Analysis Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <p className="text-muted-foreground text-xs sm:text-sm mt-4">
              Takes only 5 minutes • Get instant results • Completely free
            </p>
          </div>
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
                  SkillMap.ai
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
              © 2025 SkillMap.ai. All rights reserved. Built with ❤️ for Indian students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;