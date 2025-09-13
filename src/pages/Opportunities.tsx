import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, ExternalLink, Star, Filter, SortAsc, Mic, Search, Briefcase } from 'lucide-react';
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

interface Job {
  job_id: string;
  employer_name: string;
  job_title: string;
  job_description: string;
  job_employment_type: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_apply_link: string;
  job_posted_at_datetime_utc: string;
  job_salary_min?: number;
  job_salary_max?: number;
  job_salary_currency?: string;
  job_salary_period?: string;
  job_required_skills?: string[];
  job_required_experience?: string;
  job_required_education?: string;
  job_benefits?: string[];
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
  };
}

interface JobSearchResponse {
  status: string;
  request_id: string;
  parameters: {
    query: string;
    page: number;
    num_pages: number;
    country: string;
    date_posted: string;
  };
  data: Job[];
}

// API service for fetching jobs from RapidAPI
const fetchJobsFromAPI = async (query: string = 'developer jobs', location: string = 'us', page: number = 1): Promise<Job[]> => {
  try {
    const encodedQuery = encodeURIComponent(query);
    
    // Use proxy in development to avoid CORS issues
    const isDev = import.meta.env.DEV;
    const baseUrl = isDev ? '/api' : 'https://jsearch.p.rapidapi.com';
    const url = `${baseUrl}/search?query=${encodedQuery}&page=${page}&num_pages=1&country=${location}&date_posted=all`;
    
    // Use environment variable or fallback to the provided key
    const apiKey = import.meta.env.VITE_RAPIDAPI_KEY || 'dd0a88006dmsh80cfa50b1b5bc60p15e5e7jsn0cc002b17d9c';
    const apiHost = import.meta.env.VITE_RAPIDAPI_HOST || 'jsearch.p.rapidapi.com';
    
    console.log('Making API request to:', url);
    console.log('Using API key:', apiKey.substring(0, 10) + '...');
    console.log('Development mode:', isDev);
    
    const headers: Record<string, string> = {};
    
    // Only add headers if not using proxy (proxy adds them automatically)
    if (!isDev) {
      headers['x-rapidapi-key'] = apiKey;
      headers['x-rapidapi-host'] = apiHost;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      if (response.status === 403) {
        throw new Error('API access denied. Please check your RapidAPI key and subscription status.');
      } else if (response.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
    }

    const data: JobSearchResponse = await response.json();
    console.log('API Response data:', data);
    
    if (!data.data || !Array.isArray(data.data)) {
      console.warn('Unexpected API response format:', data);
      return [];
    }
    
    console.log('Successfully fetched', data.data.length, 'jobs');
    return data.data;
  } catch (error) {
    console.error('Error fetching jobs from API:', error);
    
    // Check if it's a network/CORS error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('This might be a CORS issue. RapidAPI might not allow browser requests.');
    }
    
    // Return mock data as fallback for development
    return getMockJobs();
  }
};

// Mock jobs data as fallback
const getMockJobs = (): Job[] => [
  {
    job_id: 'mock-1',
    employer_name: 'Tech Corp',
    job_title: 'Software Engineer',
    job_description: 'We are looking for a talented software engineer to join our team. You will work on cutting-edge projects and collaborate with a dynamic team.',
    job_employment_type: 'FULLTIME',
    job_city: 'San Francisco',
    job_state: 'CA',
    job_country: 'US',
    job_apply_link: 'https://example.com/apply',
    job_posted_at_datetime_utc: new Date().toISOString(),
    job_salary_min: 80000,
    job_salary_max: 120000,
    job_salary_currency: 'USD',
    job_salary_period: 'year',
    job_required_skills: ['JavaScript', 'React', 'Node.js'],
    job_required_experience: '2-4 years',
    job_required_education: 'Bachelor\'s degree',
    job_benefits: ['Health Insurance', '401k', 'Remote Work'],
    job_highlights: {
      Qualifications: ['Strong programming skills', 'Team player'],
      Responsibilities: ['Develop web applications', 'Code reviews']
    }
  },
  {
    job_id: 'mock-2',
    employer_name: 'StartupXYZ',
    job_title: 'Frontend Developer',
    job_description: 'Join our fast-growing startup as a frontend developer. Work with modern technologies and make a real impact.',
    job_employment_type: 'FULLTIME',
    job_city: 'New York',
    job_state: 'NY',
    job_country: 'US',
    job_apply_link: 'https://example.com/apply',
    job_posted_at_datetime_utc: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    job_salary_min: 70000,
    job_salary_max: 100000,
    job_salary_currency: 'USD',
    job_salary_period: 'year',
    job_required_skills: ['React', 'TypeScript', 'CSS'],
    job_required_experience: '1-3 years',
    job_required_education: 'Bachelor\'s degree',
    job_benefits: ['Equity', 'Flexible hours'],
    job_highlights: {
      Qualifications: ['Passion for UI/UX', 'Creative thinking'],
      Responsibilities: ['Build user interfaces', 'Optimize performance']
    }
  }
];

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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [jobSearchQuery, setJobSearchQuery] = useState('developer jobs');
  const [jobLocation, setJobLocation] = useState('us');
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch jobs from API
  const fetchJobs = async (query: string = jobSearchQuery, location: string = jobLocation) => {
    setIsLoadingJobs(true);
    setApiError(null);
    try {
      const jobData = await fetchJobsFromAPI(query, location);
      setJobs(jobData);
      setFilteredJobs(jobData);
      
      // Check if we got mock data (API failed)
      if (jobData.length > 0 && jobData[0].job_id.startsWith('mock-')) {
        setApiError('Using sample data. Please check your RapidAPI configuration for live job data.');
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to fetch jobs. Please try again.');
      // Set mock data as fallback
      const mockData = getMockJobs();
      setJobs(mockData);
      setFilteredJobs(mockData);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Load jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

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

  // Filter and sort opportunities and jobs
  useEffect(() => {
    let filteredOpps = [...opportunities];
    let filteredJobsData = [...jobs];

    // Filter opportunities by type
    if (activeTab !== 'all' && activeTab !== 'jobs') {
      filteredOpps = filteredOpps.filter(opp => opp.type === activeTab);
    }

    // Sort opportunities
    if (sortBy === 'deadline') {
      filteredOpps.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else if (sortBy === 'relevance') {
      filteredOpps.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    // Sort jobs by date posted
    filteredJobsData.sort((a, b) => new Date(b.job_posted_at_datetime_utc).getTime() - new Date(a.job_posted_at_datetime_utc).getTime());

    setFilteredOpportunities(filteredOpps);
    setFilteredJobs(filteredJobsData);
  }, [opportunities, jobs, activeTab, sortBy]);

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

  const formatJobDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatSalary = (job: Job) => {
    if (!job.job_salary_min || !job.job_salary_max) return null;
    
    const currency = job.job_salary_currency || 'USD';
    const period = job.job_salary_period || 'year';
    
    return `${currency} ${job.job_salary_min.toLocaleString()} - ${job.job_salary_max.toLocaleString()} per ${period}`;
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

        {/* Job Search Interface */}
        {activeTab === 'jobs' && (
          <motion.div 
            className="bg-card p-6 rounded-lg border mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              {translate('opportunities.jobSearch', 'Search for Jobs')}
            </h3>
            
            {/* API Error Display */}
            {apiError && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> {apiError}
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  To use live job data, ensure your RapidAPI key is valid and you have an active subscription.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    console.log('Testing API connection...');
                    fetchJobs('developer jobs in chicago', 'us');
                  }}
                >
                  Test API Connection
                </Button>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder={translate('opportunities.jobSearchPlaceholder', 'Search for jobs (e.g., "software engineer", "data scientist")')}
                  value={jobSearchQuery}
                  onChange={(e) => setJobSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="sm:w-32">
                <Select value={jobLocation} onValueChange={setJobLocation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">US</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="gb">UK</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="in">India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => fetchJobs(jobSearchQuery, jobLocation)}
                disabled={isLoadingJobs}
                className="sm:w-auto"
              >
                <Search className="w-4 h-4 mr-2" />
                {isLoadingJobs ? translate('opportunities.searching', 'Searching...') : translate('opportunities.search', 'Search')}
              </Button>
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
            <TabsList className="grid w-full grid-cols-5 mb-8">
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
              <TabsTrigger value="jobs">
                {translate('opportunities.filter.jobs', 'Jobs')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {activeTab === 'jobs' ? (
                // Jobs Tab Content
                <>
                  {isLoadingJobs ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">
                        {translate('opportunities.loadingJobs', 'Loading jobs...')}
                      </p>
                    </div>
                  ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        {translate('opportunities.noJobs', 'No jobs found. Try adjusting your search criteria.')}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredJobs.map((job, index) => (
                        <motion.div
                          key={job.job_id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.05 }}
                        >
                          <Card className="h-full hover:shadow-lg transition-all duration-300">
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start mb-2">
                                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 capitalize">
                                  {job.job_employment_type || 'Full-time'}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {formatJobDate(job.job_posted_at_datetime_utc)}
                                </Badge>
                              </div>
                              <CardTitle className="text-lg">{job.job_title}</CardTitle>
                              <p className="text-sm text-muted-foreground">{job.employer_name}</p>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm mb-4 line-clamp-3">{job.job_description}</p>
                              
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm">
                                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                                  {job.job_city}, {job.job_state}, {job.job_country}
                                </div>
                                {formatSalary(job) && (
                                  <div className="text-sm font-medium text-green-600">
                                    {formatSalary(job)}
                                  </div>
                                )}
                                {job.job_required_experience && (
                                  <div className="text-sm text-muted-foreground">
                                    Experience: {job.job_required_experience}
                                  </div>
                                )}
                              </div>

                              {job.job_required_skills && job.job_required_skills.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-4">
                                  {job.job_required_skills.slice(0, 3).map((skill, skillIndex) => (
                                    <Badge key={skillIndex} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              <Button 
                                className="w-full" 
                                onClick={() => window.open(job.job_apply_link, '_blank')}
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
                </>
              ) : (
                // Opportunities Tab Content
                <>
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
                </>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Opportunities;