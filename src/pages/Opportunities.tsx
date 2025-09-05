import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, ExternalLink, Star, Filter, SortAsc, Mic } from 'lucide-react';
import Header from '@/components/Header';
import VoiceInterface from '@/components/VoiceInterface';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Opportunity {
  id: string;
  title: string;
  type: 'scholarship' | 'internship' | 'hackathon';
  organization: string;
  location: string;
  deadline: string;
  amount?: string;
  duration?: string;
  description: string;
  requirements: string[];
  applyLink: string;
  relevanceScore: number;
  tags: string[];
  isRecommended: boolean;
}

// Mock data for opportunities
const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Google Summer of Code 2024',
    type: 'internship',
    organization: 'Google',
    location: 'Remote',
    deadline: '2024-04-02',
    amount: '$6,000',
    duration: '12 weeks',
    description: 'Work on open source projects with mentorship from experienced developers.',
    requirements: ['Programming experience', 'Open source contributions', 'University student'],
    applyLink: 'https://summerofcode.withgoogle.com',
    relevanceScore: 95,
    tags: ['Programming', 'Open Source', 'Mentorship'],
    isRecommended: true
  },
  {
    id: '2',
    title: 'KVPY Fellowship',
    type: 'scholarship',
    organization: 'IISc Bangalore',
    location: 'India',
    deadline: '2024-10-15',
    amount: '₹7,000/month',
    duration: '5 years',
    description: 'Fellowship for students pursuing research in basic sciences.',
    requirements: ['Mathematics/Science student', 'Class 11/12 or B.Sc', 'Indian citizen'],
    applyLink: 'http://kvpy.iisc.ernet.in',
    relevanceScore: 88,
    tags: ['Science', 'Research', 'Fellowship'],
    isRecommended: true
  },
  {
    id: '3',
    title: 'Smart India Hackathon',
    type: 'hackathon',
    organization: 'Government of India',
    location: 'Multiple Cities',
    deadline: '2024-12-01',
    amount: '₹1,00,000',
    duration: '36 hours',
    description: 'Solve real-world problems faced by various ministries and departments.',
    requirements: ['Team of 6 students', 'Valid student ID', 'Innovative solution'],
    applyLink: 'https://sih.gov.in',
    relevanceScore: 92,
    tags: ['Innovation', 'Problem Solving', 'Government'],
    isRecommended: true
  },
  {
    id: '4',
    title: 'Microsoft Imagine Cup',
    type: 'hackathon',
    organization: 'Microsoft',
    location: 'Global/Remote',
    deadline: '2024-11-30',
    amount: '$100,000',
    duration: '3 months',
    description: 'Global student technology competition to solve world problems.',
    requirements: ['Student team', 'Innovative technology solution', 'Business plan'],
    applyLink: 'https://imaginecup.microsoft.com',
    relevanceScore: 85,
    tags: ['Technology', 'Innovation', 'Global'],
    isRecommended: false
  },
  {
    id: '5',
    title: 'JN Tata Endowment Scholarship',
    type: 'scholarship',
    organization: 'Tata Trusts',
    location: 'International',
    deadline: '2024-09-30',
    amount: '₹4,00,000/year',
    duration: '2 years',
    description: 'For higher education abroad in engineering, technology, and applied sciences.',
    requirements: ['First class degree', 'Admission to foreign university', 'Indian citizen'],
    applyLink: 'https://www.tatatrusts.org',
    relevanceScore: 78,
    tags: ['International', 'Higher Education', 'Engineering'],
    isRecommended: false
  },
  {
    id: '6',
    title: 'Flipkart GRiD Challenge',
    type: 'hackathon',
    organization: 'Flipkart',
    location: 'India',
    deadline: '2024-08-15',
    amount: '₹1,50,000',
    duration: '2 days',
    description: 'E-commerce and technology innovation challenge.',
    requirements: ['Engineering students', 'Team of 2-4', 'Coding skills'],
    applyLink: 'https://dare2compete.com/o/flipkart-grid',
    relevanceScore: 82,
    tags: ['E-commerce', 'Technology', 'Innovation'],
    isRecommended: false
  }
];

const Opportunities = () => {
  const { translate } = useLanguage();
  const [opportunities] = useState<Opportunity[]>(mockOpportunities);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);

  // Voice query handler for opportunities
  const handleVoiceQuery = async (query: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('scholarship') || queryLower.includes('financial aid')) {
      const scholarships = opportunities.filter(opp => opp.type === 'scholarship');
      return translate('opportunities.voice.scholarship', 
        `I found ${scholarships.length} scholarships for you! The top ones include KVPY Fellowship and JN Tata Endowment. These offer financial support for your education and research pursuits.`
      );
    } else if (queryLower.includes('internship') || queryLower.includes('work experience')) {
      const internships = opportunities.filter(opp => opp.type === 'internship');
      return translate('opportunities.voice.internship',
        `There are ${internships.length} internship opportunities available! Google Summer of Code is highly recommended for programming students, offering mentorship and stipend.`
      );
    } else if (queryLower.includes('hackathon') || queryLower.includes('competition')) {
      const hackathons = opportunities.filter(opp => opp.type === 'hackathon');
      return translate('opportunities.voice.hackathon',
        `I found ${hackathons.length} exciting hackathons! Smart India Hackathon and Microsoft Imagine Cup are great for showcasing your innovation skills with substantial prize money.`
      );
    } else {
      const recommended = opportunities.filter(opp => opp.isRecommended);
      return translate('opportunities.voice.general',
        `Based on your profile, I've found ${recommended.length} recommended opportunities across scholarships, internships, and hackathons. Would you like me to tell you about a specific type?`
      );
    }
  };

  // Filter and sort opportunities
  useEffect(() => {
    let filtered = [...opportunities];

    // Filter by type
    if (activeTab !== 'all') {
      filtered = filtered.filter(opp => opp.type === activeTab);
    }

    // Sort opportunities
    if (sortBy === 'deadline') {
      filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else if (sortBy === 'relevance') {
      filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    setFilteredOpportunities(filtered);
  }, [opportunities, activeTab, sortBy]);

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `${diffDays} days left`;
    
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'scholarship': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'internship': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'hackathon': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const recommendedOpportunities = useMemo(() => 
    filteredOpportunities.filter(opp => opp.isRecommended), 
    [filteredOpportunities]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4">
            {translate('opportunities.title', 'Opportunities for You')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            {translate('opportunities.subtitle', 'Discover scholarships, internships, and hackathons tailored to your profile')}
          </p>
          
          {/* Voice Assistant Button */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowVoiceInterface(!showVoiceInterface)}
            className="mb-4 bg-primary/5 hover:bg-primary/10 border-primary/20"
          >
            <Mic className="w-4 h-4 mr-2" />
            {translate('voice.askAboutOpportunities', 'Ask About Opportunities')}
          </Button>
          
          {/* Voice Interface */}
          <AnimatePresence>
            {showVoiceInterface && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center mb-8"
              >
                <VoiceInterface 
                  onVoiceQuery={handleVoiceQuery}
                  className="w-full max-w-lg"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Recommended Section */}
        {recommendedOpportunities.length > 0 && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Star className="w-6 h-6 text-yellow-500 mr-2" />
              {translate('opportunities.recommended', 'Recommended for You')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {recommendedOpportunities.slice(0, 3).map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full border-l-4 border-l-yellow-500 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={`${getTypeColor(opportunity.type)} capitalize`}>
                          {translate(`opportunities.filter.${opportunity.type}`, opportunity.type)}
                        </Badge>
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          {opportunity.relevanceScore}% match
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{opportunity.organization}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4 line-clamp-3">{opportunity.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                          {opportunity.location}
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                          {translate('opportunities.deadline', 'Deadline')}: {formatDeadline(opportunity.deadline)}
                        </div>
                        {opportunity.amount && (
                          <div className="text-sm font-medium text-green-600">
                            {opportunity.amount}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {opportunity.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={() => window.open(opportunity.applyLink, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {translate('opportunities.apply', 'Apply Now')}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters and Sort */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SortAsc className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">
                {translate('opportunities.sort.relevance', 'Sort by Relevance')}
              </SelectItem>
              <SelectItem value="deadline">
                {translate('opportunities.sort.deadline', 'Sort by Deadline')}
              </SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Tabs for filtering */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="all">
                {translate('opportunities.filter.all', 'All Types')}
              </TabsTrigger>
              <TabsTrigger value="scholarship">
                {translate('opportunities.filter.scholarship', 'Scholarships')}
              </TabsTrigger>
              <TabsTrigger value="internship">
                {translate('opportunities.filter.internship', 'Internships')}
              </TabsTrigger>
              <TabsTrigger value="hackathon">
                {translate('opportunities.filter.hackathon', 'Hackathons')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filteredOpportunities.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {translate('opportunities.noResults', 'No opportunities found for the selected filters.')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOpportunities.map((opportunity, index) => (
                    <motion.div
                      key={opportunity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-all duration-300">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start mb-2">
                            <Badge className={`${getTypeColor(opportunity.type)} capitalize`}>
                              {translate(`opportunities.filter.${opportunity.type}`, opportunity.type)}
                            </Badge>
                            <Badge variant="outline">
                              {opportunity.relevanceScore}% match
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{opportunity.organization}</p>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm mb-4 line-clamp-3">{opportunity.description}</p>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm">
                              <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                              {opportunity.location}
                            </div>
                            <div className="flex items-center text-sm">
                              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                              {translate('opportunities.deadline', 'Deadline')}: {formatDeadline(opportunity.deadline)}
                            </div>
                            {opportunity.amount && (
                              <div className="text-sm font-medium text-green-600">
                                {opportunity.amount}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {opportunity.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <Button 
                            className="w-full" 
                            onClick={() => window.open(opportunity.applyLink, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {translate('opportunities.apply', 'Apply Now')}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Opportunities;