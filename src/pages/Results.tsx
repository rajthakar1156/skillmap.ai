import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, TrendingUp, MapPin, Users, Star, Briefcase, DollarSign } from "lucide-react";

interface CareerRecommendation {
  career_title: string;
  career_description: string;
  day_in_the_life: string;
  market_relevance_india: {
    demand: string;
    salary_range_lpa: string;
    future_scope: string;
  };
  top_sectors_india: string[];
  alignment_justification: string;
}

interface ProfileData {
  academics: {
    class_12_stream: string;
    key_subjects_score: { [key: string]: number };
  };
  interests: string[];
  personality: {
    type: string;
    strong_traits: string[];
  };
  extracurriculars: string[];
  values: string[];
}

const Results = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem('profileData');
    if (!storedData) {
      navigate('/profile');
      return;
    }

    const data: ProfileData = JSON.parse(storedData);
    setProfileData(data);
    
    // Simulate AI processing and generate recommendations
    generateRecommendations(data);
  }, [navigate]);

  const generateRecommendations = (data: ProfileData) => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const recommendations = analyzeProfile(data);
      setRecommendations(recommendations);
      setLoading(false);
    }, 2000);
  };

  const analyzeProfile = (data: ProfileData): CareerRecommendation[] => {
    const { academics, interests, personality, values } = data;
    
    // Simple recommendation logic based on the profile
    const recs: CareerRecommendation[] = [];
    
    if (academics.class_12_stream === "Science (PCM)") {
      if (interests.some(i => ["technology", "video games", "solving puzzles"].includes(i))) {
        recs.push({
          career_title: "Software Engineer",
          career_description: "Design, develop, and maintain software applications and systems that power our digital world.",
          day_in_the_life: "Start your day reviewing code from teammates, attend a brief standup meeting, spend focused time coding new features, collaborate on architecture decisions, debug issues, and wrap up with planning tomorrow's sprint goals.",
          market_relevance_india: {
            demand: "Extremely high with continuous growth in IT sector",
            salary_range_lpa: "₹6L - ₹12L (Entry Level), ₹20L+ (Experienced)",
            future_scope: "Excellent, with increasing digitalization across all industries"
          },
          top_sectors_india: ["IT Services", "Product Companies", "FinTech", "E-commerce"],
          alignment_justification: `Your strong performance in Math (${academics.key_subjects_score.Math || 'N/A'}%) and Physics, combined with interests in technology and problem-solving, make you ideal for software engineering.`
        });
      }
      
      if (values.includes("innovation") || interests.includes("sci-fi movies")) {
        recs.push({
          career_title: "Data Scientist",
          career_description: "Extract insights from data to drive business decisions and create intelligent systems.",
          day_in_the_life: "Analyze large datasets, build predictive models, create visualizations, collaborate with business teams to understand requirements, and present findings to stakeholders.",
          market_relevance_india: {
            demand: "Very high across all sectors",
            salary_range_lpa: "₹8L - ₹15L (Entry Level), ₹25L+ (Experienced)",
            future_scope: "Exceptional growth with AI/ML revolution"
          },
          top_sectors_india: ["Tech Companies", "Banking", "Healthcare", "Retail"],
          alignment_justification: `Your analytical nature and strong math skills align perfectly with data science. Your interest in technology and innovation matches the field's cutting-edge nature.`
        });
      }
    }
    
    if (academics.class_12_stream === "Science (PCB)") {
      recs.push({
        career_title: "Biomedical Engineer",
        career_description: "Combine engineering principles with biological sciences to develop medical devices and solutions.",
        day_in_the_life: "Design medical equipment, run tests on prototypes, collaborate with doctors and researchers, analyze biological data, and ensure compliance with medical regulations.",
        market_relevance_india: {
          demand: "Growing rapidly with healthcare expansion",
          salary_range_lpa: "₹5L - ₹10L (Entry Level), ₹18L+ (Experienced)",
          future_scope: "Strong growth with medical technology advancement"
        },
        top_sectors_india: ["Healthcare", "Medical Devices", "Pharmaceuticals", "Research"],
        alignment_justification: `Your science background with PCB stream and analytical traits make you well-suited for biomedical engineering.`
      });
    }
    
    if (academics.class_12_stream === "Commerce") {
      recs.push({
        career_title: "Financial Analyst",
        career_description: "Analyze financial data to help organizations make informed investment and business decisions.",
        day_in_the_life: "Review market trends, create financial models, prepare reports, analyze company performance, and advise on investment opportunities.",
        market_relevance_india: {
          demand: "High demand in growing financial sector",
          salary_range_lpa: "₹4L - ₹8L (Entry Level), ₹15L+ (Experienced)",
          future_scope: "Stable growth with expanding financial markets"
        },
        top_sectors_india: ["Banking", "Investment Firms", "Corporate Finance", "Consulting"],
        alignment_justification: `Your commerce background and analytical personality are perfect for financial analysis roles.`
      });
    }
    
    // Add a third recommendation based on personality and values
    if (personality.strong_traits.includes("creative") || values.includes("creativity")) {
      recs.push({
        career_title: "UX/UI Designer",
        career_description: "Create intuitive and beautiful digital experiences that users love to interact with.",
        day_in_the_life: "Research user needs, create wireframes and prototypes, design interfaces, collaborate with developers, conduct user testing, and iterate on designs based on feedback.",
        market_relevance_india: {
          demand: "Very high with digital transformation boom",
          salary_range_lpa: "₹5L - ₹10L (Entry Level), ₹20L+ (Experienced)",
          future_scope: "Excellent with growing focus on user experience"
        },
        top_sectors_india: ["Tech Companies", "Digital Agencies", "E-commerce", "Startups"],
        alignment_justification: `Your creative traits and interest in technology combine perfectly for UX/UI design, where you can solve problems through beautiful, functional design.`
      });
    } else if (values.includes("helping others") || personality.strong_traits.includes("empathetic")) {
      recs.push({
        career_title: "Product Manager",
        career_description: "Bridge the gap between business needs and technical solutions to create products that users love.",
        day_in_the_life: "Define product roadmaps, gather requirements from stakeholders, work with engineering teams, analyze user feedback, and make strategic decisions about product features.",
        market_relevance_india: {
          demand: "Very high across all tech companies",
          salary_range_lpa: "₹10L - ₹18L (Entry Level), ₹30L+ (Experienced)",
          future_scope: "Exceptional growth in product-focused companies"
        },
        top_sectors_india: ["Technology", "Startups", "E-commerce", "SaaS"],
        alignment_justification: `Your empathetic nature and analytical skills make you ideal for understanding user needs and translating them into successful products.`
      });
    }
    
    // Ensure we have at least 3 recommendations
    if (recs.length < 3) {
      recs.push({
        career_title: "Management Consultant",
        career_description: "Help organizations solve complex business problems and improve their performance.",
        day_in_the_life: "Analyze business challenges, develop strategic solutions, present recommendations to clients, lead implementation projects, and build strong client relationships.",
        market_relevance_india: {
          demand: "High demand from growing businesses",
          salary_range_lpa: "₹8L - ₹15L (Entry Level), ₹25L+ (Experienced)",
          future_scope: "Strong growth with business expansion needs"
        },
        top_sectors_india: ["Consulting Firms", "Corporate Strategy", "Technology", "Healthcare"],
        alignment_justification: `Your analytical and problem-solving abilities align well with consulting, where you can help businesses overcome challenges and grow.`
      });
    }
    
    return recs.slice(0, 3);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold mb-2">Analyzing Your Profile</h2>
          <p className="text-muted-foreground">Our AI is crafting personalized career recommendations for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/profile')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Your Career Recommendations
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Based on your profile analysis, here are the top career paths perfectly suited for you
          </p>
        </div>

        {profileData && (
          <Card className="mb-8 shadow-card">
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">STREAM</h4>
                  <Badge variant="outline">{profileData.academics.class_12_stream}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">PERSONALITY</h4>
                  <Badge variant="outline">{profileData.personality.type}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">TOP INTERESTS</h4>
                  <div className="flex flex-wrap gap-1">
                    {profileData.interests.slice(0, 2).map(interest => (
                      <Badge key={interest} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">VALUES</h4>
                  <div className="flex flex-wrap gap-1">
                    {profileData.values.slice(0, 2).map(value => (
                      <Badge key={value} variant="secondary" className="text-xs">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-8">
          {recommendations.map((rec, index) => (
            <Card key={index} className="shadow-elegant hover:shadow-glow transition-all duration-300 animate-fade-in">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Star className="w-6 h-6 text-accent" />
                      {rec.career_title}
                      <Badge className="ml-2">#{index + 1} Match</Badge>
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                      {rec.career_description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <Briefcase className="w-4 h-4 text-primary" />
                    A Day in Your Life
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {rec.day_in_the_life}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-secondary" />
                      Market Relevance in India
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Demand:</span>
                        <p className="text-sm">{rec.market_relevance_india.demand}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          Salary Range:
                        </span>
                        <p className="text-sm font-medium text-secondary">{rec.market_relevance_india.salary_range_lpa}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Future Scope:</span>
                        <p className="text-sm">{rec.market_relevance_india.future_scope}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-accent" />
                      Top Sectors in India
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.top_sectors_india.map(sector => (
                        <Badge key={sector} variant="outline" className="text-xs">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    Why This Matches You
                  </h4>
                  <p className="text-muted-foreground leading-relaxed bg-muted/50 p-4 rounded-lg">
                    {rec.alignment_justification}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="premium" 
            size="lg"
            onClick={() => navigate('/')}
          >
            Explore More Career Paths
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;