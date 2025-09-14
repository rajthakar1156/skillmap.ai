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

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  benefits: string[];
  duration: string;
  stipend?: string;
  application_deadline: string;
  application_link: string;
  posted_date: string;
  type: 'internship';
  tags: string[];
  is_remote: boolean;
  experience_level: string;
}

interface InternshipResponse {
  internships: Internship[];
  total: number;
  page: number;
  limit: number;
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

// API service for fetching internships from RapidAPI
const fetchInternshipsFromAPI = async (): Promise<Internship[]> => {
  try {
    // For now, let's try direct API call to debug the issue
    const url = 'https://internships-api.p.rapidapi.com/active-ats-7d';
    const apiKey = 'dd0a88006dmsh80cfa50b1b5bc60p15e5e7jsn0cc002b17d9c';
    const apiHost = 'internships-api.p.rapidapi.com';
    
    console.log('Making Internships API request to:', url);
    console.log('Using API key:', apiKey.substring(0, 10) + '...');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost
      },
      mode: 'cors'
    });

    console.log('Internships Response status:', response.status);
    console.log('Internships Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Internships API Error Response:', errorText);
      
      if (response.status === 403) {
        throw new Error('Internships API access denied. Please check your RapidAPI key and subscription status.');
      } else if (response.status === 429) {
        throw new Error('Internships API rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`Internships API HTTP error! status: ${response.status} - ${errorText}`);
      }
    }

    const data = await response.json();
    console.log('Internships API Response data:', data);
    
    // Handle different response formats
    let internships: Internship[] = [];
    
    if (Array.isArray(data)) {
      // If response is directly an array
      internships = data.map((item: any, index: number) => transformInternshipData(item, index));
    } else if (data.internships && Array.isArray(data.internships)) {
      // If response has internships property
      internships = data.internships.map((item: any, index: number) => transformInternshipData(item, index));
    } else if (data.data && Array.isArray(data.data)) {
      // If response has data property
      internships = data.data.map((item: any, index: number) => transformInternshipData(item, index));
    } else {
      console.warn('Unexpected internships API response format:', data);
      return [];
    }
    
    console.log('Successfully fetched', internships.length, 'internships');
    return internships;
  } catch (error) {
    console.error('Error fetching internships from API:', error);
    
    // Check if it's a network/CORS error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('This might be a CORS issue. RapidAPI might not allow browser requests.');
    }
    
    // Return mock data as fallback for development
    return getMockInternships();
  }
};

// Transform raw API data to our Internship interface
const transformInternshipData = (item: any, index: number): Internship => {
  return {
    id: item.id || `internship-${index}`,
    title: item.title || item.job_title || item.position || 'Internship Position',
    company: item.company || item.employer_name || item.company_name || 'Company',
    location: item.location || item.job_location || item.city || 'Location TBD',
    description: item.description || item.job_description || item.summary || 'Internship opportunity',
    requirements: Array.isArray(item.requirements) ? item.requirements : 
                 Array.isArray(item.qualifications) ? item.qualifications :
                 Array.isArray(item.skills) ? item.skills : [],
    benefits: Array.isArray(item.benefits) ? item.benefits : 
             Array.isArray(item.perks) ? item.perks : [],
    duration: item.duration || item.period || item.length || '3-6 months',
    stipend: item.stipend || item.salary || item.compensation,
    application_deadline: item.application_deadline || item.deadline || item.end_date || 
                        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    application_link: item.application_link || item.apply_url || item.url || '#',
    posted_date: item.posted_date || item.created_at || item.date_posted || new Date().toISOString(),
    type: 'internship' as const,
    tags: Array.isArray(item.tags) ? item.tags : 
          Array.isArray(item.categories) ? item.categories : [],
    is_remote: item.is_remote || item.remote || item.work_from_home || false,
    experience_level: item.experience_level || item.level || item.seniority || 'Entry Level'
  };
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

// Mock internships data as fallback
const getMockInternships = (): Internship[] => [
  {
    id: 'mock-internship-1',
    title: 'Software Development Intern',
    company: 'TechStart Inc.',
    location: 'San Francisco, CA',
    description: 'Join our engineering team as a software development intern. Work on real projects, learn from experienced developers, and contribute to our growing platform.',
    requirements: ['Python', 'JavaScript', 'Git', 'Problem Solving'],
    benefits: ['Mentorship', 'Networking', 'Portfolio Projects', 'Stipend'],
    duration: '3 months',
    stipend: '$3,000/month',
    application_deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    application_link: 'https://example.com/apply',
    posted_date: new Date().toISOString(),
    type: 'internship',
    tags: ['Software Development', 'Python', 'JavaScript'],
    is_remote: false,
    experience_level: 'Entry Level'
  },
  {
    id: 'mock-internship-2',
    title: 'Data Science Intern',
    company: 'DataCorp',
    location: 'Remote',
    description: 'Work with our data science team to analyze large datasets, build machine learning models, and create data visualizations for business insights.',
    requirements: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics'],
    benefits: ['Flexible Hours', 'Learning Budget', 'Certificate', 'Job Offer Potential'],
    duration: '6 months',
    stipend: '$2,500/month',
    application_deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
    application_link: 'https://example.com/apply',
    posted_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    type: 'internship',
    tags: ['Data Science', 'Machine Learning', 'Python'],
    is_remote: true,
    experience_level: 'Entry Level'
  },
  {
    id: 'mock-internship-3',
    title: 'Marketing Intern',
    company: 'GrowthCo',
    location: 'New York, NY',
    description: 'Support our marketing team with social media management, content creation, campaign analysis, and brand development initiatives.',
    requirements: ['Social Media', 'Content Creation', 'Analytics', 'Communication'],
    benefits: ['Portfolio Building', 'Industry Connections', 'Skill Development'],
    duration: '4 months',
    stipend: '$2,000/month',
    application_deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    application_link: 'https://example.com/apply',
    posted_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    type: 'internship',
    tags: ['Marketing', 'Social Media', 'Content Creation'],
    is_remote: false,
    experience_level: 'Entry Level'
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
  const [internships, setInternships] = useState<Internship[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingInternships, setIsLoadingInternships] = useState(false);
  const [jobSearchQuery, setJobSearchQuery] = useState('developer jobs');
  const [jobLocation, setJobLocation] = useState('us');
  const [apiError, setApiError] = useState<string | null>(null);
  const [internshipsApiError, setInternshipsApiError] = useState<string | null>(null);

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

  // Fetch internships from API
  const fetchInternships = async () => {
    setIsLoadingInternships(true);
    setInternshipsApiError(null);
    try {
      const internshipData = await fetchInternshipsFromAPI();
      setInternships(internshipData);
      setFilteredInternships(internshipData);
      
      // Check if we got mock data (API failed)
      if (internshipData.length > 0 && internshipData[0].id.startsWith('mock-internship-')) {
        setInternshipsApiError('Using sample internship data. Please check your RapidAPI configuration for live internship data.');
      }
    } catch (error) {
      console.error('Failed to fetch internships:', error);
      setInternshipsApiError(error instanceof Error ? error.message : 'Failed to fetch internships. Please try again.');
      // Set mock data as fallback
      const mockData = getMockInternships();
      setInternships(mockData);
      setFilteredInternships(mockData);
    } finally {
      setIsLoadingInternships(false);
    }
  };

  // Load jobs and internships on component mount
  useEffect(() => {
    fetchJobs();
    fetchInternships();
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

  // Filter and sort opportunities, jobs, and internships
  useEffect(() => {
    let filteredOpps = [...opportunities];
    let filteredJobsData = [...jobs];
    let filteredInternshipsData = [...internships];

    // Filter opportunities by type
    if (activeTab !== 'all' && activeTab !== 'jobs' && activeTab !== 'internships') {
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

    // Sort internships by application deadline
    filteredInternshipsData.sort((a, b) => new Date(a.application_deadline).getTime() - new Date(b.application_deadline).getTime());

    setFilteredOpportunities(filteredOpps);
    setFilteredJobs(filteredJobsData);
    setFilteredInternships(filteredInternshipsData);
  }, [opportunities, jobs, internships, activeTab, sortBy]);

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
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <motion.div 
          className="text-center mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
            {translate('opportunities.title', 'Opportunities for You')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 sm:mb-6 px-2">
            {translate('opportunities.subtitle', 'Discover scholarships, internships, and hackathons tailored to your profile')}
          </p>
          
          {/* Voice Assistant Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVoiceInterface(!showVoiceInterface)}
            className="mb-4 bg-primary/5 hover:bg-primary/10 border-primary/20 text-sm sm:text-base"
          >
            <Mic className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{translate('voice.askAboutOpportunities', 'Ask About Opportunities')}</span>
            <span className="sm:hidden">{translate('voice.ask', 'Ask')}</span>
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
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center justify-center sm:justify-start">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mr-2" />
              {translate('opportunities.recommended', 'Recommended for You')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
            className="bg-card p-4 sm:p-6 rounded-lg border mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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
            
            <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:gap-4">
              <div className="flex-1">
                <Input
                  placeholder={translate('opportunities.jobSearchPlaceholder', 'Search for jobs (e.g., "software engineer", "data scientist")')}
                  value={jobSearchQuery}
                  onChange={(e) => setJobSearchQuery(e.target.value)}
                  className="w-full text-sm sm:text-base"
                />
              </div>
              <div className="flex gap-2 sm:block sm:w-32">
                <Select value={jobLocation} onValueChange={setJobLocation}>
                  <SelectTrigger className="flex-1 sm:w-full">
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
                <Button 
                  onClick={() => fetchJobs(jobSearchQuery, jobLocation)}
                  disabled={isLoadingJobs}
                  className="sm:w-auto px-3 sm:px-4"
                  size="sm"
                >
                  <Search className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {isLoadingJobs ? translate('opportunities.searching', 'Searching...') : translate('opportunities.search', 'Search')}
                  </span>
                  <span className="sm:hidden">
                    {isLoadingJobs ? '...' : 'Go'}
                  </span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters and Sort */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48 text-sm sm:text-base">
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
            <div className="overflow-x-auto mb-6 sm:mb-8">
              <TabsList className="grid w-full grid-cols-6 min-w-max sm:min-w-0">
                <TabsTrigger value="all" className="text-xs sm:text-sm px-2 sm:px-3">
                  <span className="hidden sm:inline">{translate('opportunities.filter.all', 'All Types')}</span>
                  <span className="sm:hidden">All</span>
                </TabsTrigger>
                <TabsTrigger value="scholarship" className="text-xs sm:text-sm px-2 sm:px-3">
                  <span className="hidden sm:inline">{translate('opportunities.filter.scholarship', 'Scholarships')}</span>
                  <span className="sm:hidden">Scholarships</span>
                </TabsTrigger>
                <TabsTrigger value="internship" className="text-xs sm:text-sm px-2 sm:px-3">
                  <span className="hidden sm:inline">{translate('opportunities.filter.internship', 'Internships')}</span>
                  <span className="sm:hidden">Internships</span>
                </TabsTrigger>
                <TabsTrigger value="hackathon" className="text-xs sm:text-sm px-2 sm:px-3">
                  <span className="hidden sm:inline">{translate('opportunities.filter.hackathon', 'Hackathons')}</span>
                  <span className="sm:hidden">Hackathons</span>
                </TabsTrigger>
                <TabsTrigger value="jobs" className="text-xs sm:text-sm px-2 sm:px-3">
                  {translate('opportunities.filter.jobs', 'Jobs')}
                </TabsTrigger>
                <TabsTrigger value="live-internships" className="text-xs sm:text-sm px-2 sm:px-3">
                  <span className="hidden sm:inline">{translate('opportunities.filter.liveInternships', 'Live Internships')}</span>
                  <span className="sm:hidden">Live</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab}>
              {activeTab === 'live-internships' ? (
                // Live Internships Tab Content
                <>
                  {/* Internships API Error Display */}
                  {internshipsApiError && (
                    <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> {internshipsApiError}
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        To use live internship data, ensure your RapidAPI key is valid and you have an active subscription.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            console.log('Testing Internships API connection...');
                            fetchInternships();
                          }}
                        >
                          Test Internships API Connection
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={async () => {
                            console.log('Testing direct API call...');
                            try {
                              const response = await fetch('https://internships-api.p.rapidapi.com/active-ats-7d', {
                                method: 'GET',
                                headers: {
                                  'x-rapidapi-key': 'dd0a88006dmsh80cfa50b1b5bc60p15e5e7jsn0cc002b17d9c',
                                  'x-rapidapi-host': 'internships-api.p.rapidapi.com'
                                }
                              });
                              console.log('Direct API Response:', response.status);
                              const data = await response.text();
                              console.log('Direct API Data:', data);
                            } catch (error) {
                              console.error('Direct API Error:', error);
                            }
                          }}
                        >
                          Test Direct API
                        </Button>
                      </div>
                    </div>
                  )}

                  {isLoadingInternships ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">
                        {translate('opportunities.loadingInternships', 'Loading internships...')}
                      </p>
                    </div>
                  ) : filteredInternships.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        {translate('opportunities.noInternships', 'No internships found. Try refreshing the page.')}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {filteredInternships.map((internship, index) => (
                        <motion.div
                          key={internship.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.05 }}
                        >
                          <Card className="h-full hover:shadow-lg transition-all duration-300">
                            <CardHeader className="pb-2 sm:pb-3">
                              <div className="flex justify-between items-start mb-2">
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 capitalize text-xs">
                                  {internship.experience_level}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {formatJobDate(internship.posted_date)}
                                </Badge>
                              </div>
                              <CardTitle className="text-base sm:text-lg leading-tight">{internship.title}</CardTitle>
                              <p className="text-xs sm:text-sm text-muted-foreground">{internship.company}</p>
                            </CardHeader>
                            <CardContent className="p-3 sm:p-6">
                              <p className="text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">{internship.description}</p>
                              
                              <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                                <div className="flex items-center text-xs sm:text-sm">
                                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-muted-foreground flex-shrink-0" />
                                  <span className="truncate">{internship.location} {internship.is_remote && '(Remote)'}</span>
                                </div>
                                <div className="flex items-center text-xs sm:text-sm">
                                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-muted-foreground flex-shrink-0" />
                                  Duration: {internship.duration}
                                </div>
                                {internship.stipend && (
                                  <div className="text-xs sm:text-sm font-medium text-green-600">
                                    {internship.stipend}
                                  </div>
                                )}
                                <div className="flex items-center text-xs sm:text-sm">
                                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-muted-foreground flex-shrink-0" />
                                  Deadline: {formatDeadline(internship.application_deadline)}
                                </div>
                              </div>

                              {internship.requirements && internship.requirements.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                                  {internship.requirements.slice(0, 3).map((req, reqIndex) => (
                                    <Badge key={reqIndex} variant="secondary" className="text-xs px-1 py-0">
                                      {req}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              <Button 
                                className="w-full text-xs sm:text-sm py-2 sm:py-3" 
                                size="sm"
                                onClick={() => window.open(internship.application_link, '_blank')}
                              >
                                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                {translate('opportunities.apply', 'Apply Now')}
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              ) : activeTab === 'jobs' ? (
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