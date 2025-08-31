import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Briefcase, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  ExternalLink,
  Star,
  Users,
  Calendar,
  Loader2,
  AlertCircle
} from "lucide-react";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Course {
  id: string;
  title: string;
  description: string;
  platform: string;
  platformLogo: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  price: number;
  isFree: boolean;
  rating: number;
  studentsCount: number;
  instructorName: string;
  courseUrl: string;
  aiRecommended: boolean;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel: "Entry Level" | "Mid Level" | "Senior Level";
  jobType: "Remote" | "Onsite" | "Hybrid";
  description: string;
  postedDate: string;
  applyUrl: string;
  aiRecommended: boolean;
}

// Mock data for demonstration
const mockCourses: Course[] = [
  {
    id: "1",
    title: "Complete Python Bootcamp: Go from Zero to Hero in Python",
    description: "Learn Python programming from basics to advanced concepts including data structures, OOP, and web development.",
    platform: "Udemy",
    platformLogo: "/api/placeholder/40/40",
    difficulty: "Beginner",
    duration: "22 hours",
    price: 3499,
    isFree: false,
    rating: 4.6,
    studentsCount: 150000,
    instructorName: "Jose Portilla",
    courseUrl: "https://udemy.com/course/complete-python-bootcamp",
    aiRecommended: true
  },
  {
    id: "2",
    title: "Machine Learning Specialization",
    description: "Learn the fundamentals of machine learning with Andrew Ng in this comprehensive specialization.",
    platform: "Coursera",
    platformLogo: "/api/placeholder/40/40",
    difficulty: "Intermediate",
    duration: "3 months",
    price: 0,
    isFree: true,
    rating: 4.9,
    studentsCount: 500000,
    instructorName: "Andrew Ng",
    courseUrl: "https://coursera.org/specializations/machine-learning",
    aiRecommended: true
  },
  {
    id: "3",
    title: "React - The Complete Guide",
    description: "Learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!",
    platform: "Udemy",
    platformLogo: "/api/placeholder/40/40",
    difficulty: "Intermediate",
    duration: "48 hours",
    price: 3999,
    isFree: false,
    rating: 4.7,
    studentsCount: 180000,
    instructorName: "Maximilian Schwarzmüller",
    courseUrl: "https://udemy.com/course/react-the-complete-guide",
    aiRecommended: false
  }
];

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Junior Data Scientist",
    company: "TechCorp India",
    location: "Bangalore, India",
    salaryMin: 600000,
    salaryMax: 1000000,
    experienceLevel: "Entry Level",
    jobType: "Hybrid",
    description: "We are looking for a passionate Junior Data Scientist to join our growing analytics team...",
    postedDate: "2024-01-15",
    applyUrl: "https://techcorp.careers/data-scientist-jr",
    aiRecommended: true
  },
  {
    id: "2",
    title: "Frontend Developer (React)",
    company: "StartupXYZ",
    location: "Mumbai, India",
    salaryMin: 500000,
    salaryMax: 800000,
    experienceLevel: "Mid Level",
    jobType: "Remote",
    description: "Join our dynamic team as a Frontend Developer working with React, TypeScript, and modern web technologies...",
    postedDate: "2024-01-14",
    applyUrl: "https://startupxyz.com/careers/frontend-dev",
    aiRecommended: true
  },
  {
    id: "3",
    title: "Product Manager",
    company: "InnovateTech",
    location: "Delhi, India",
    salaryMin: 1200000,
    salaryMax: 2000000,
    experienceLevel: "Senior Level",
    jobType: "Onsite",
    description: "We're seeking an experienced Product Manager to lead our mobile app product strategy...",
    postedDate: "2024-01-13",
    applyUrl: "https://innovatetech.in/jobs/product-manager",
    aiRecommended: false
  }
];

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get career path from navigation state or URL params
  const careerPath = location.state?.careerPath || "Data Scientist";
  
  // Course filters
  const [courseFilters, setCourseFilters] = useState({
    priceType: "all", // all, free, paid
    difficulty: "all", // all, beginner, intermediate, advanced
    duration: "all" // all, short, medium, long
  });
  
  // Job filters
  const [jobFilters, setJobFilters] = useState({
    location: "all",
    experienceLevel: "all",
    jobType: "all"
  });
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  // Simulate API calls
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In a real implementation, you would fetch data from APIs here
        setCourses(mockCourses);
        setJobs(mockJobs);
        setFilteredCourses(mockCourses);
        setFilteredJobs(mockJobs);
      } catch (err) {
        setError("Failed to load recommendations. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [careerPath]);

  // Filter courses
  useEffect(() => {
    let filtered = courses;
    
    if (courseFilters.priceType === "free") {
      filtered = filtered.filter(course => course.isFree);
    } else if (courseFilters.priceType === "paid") {
      filtered = filtered.filter(course => !course.isFree);
    }
    
    if (courseFilters.difficulty !== "all") {
      filtered = filtered.filter(course => 
        course.difficulty.toLowerCase() === courseFilters.difficulty
      );
    }
    
    setFilteredCourses(filtered);
  }, [courses, courseFilters]);

  // Filter jobs
  useEffect(() => {
    let filtered = jobs;
    
    if (jobFilters.experienceLevel !== "all") {
      filtered = filtered.filter(job => 
        job.experienceLevel.toLowerCase().replace(" ", "-") === jobFilters.experienceLevel
      );
    }
    
    if (jobFilters.jobType !== "all") {
      filtered = filtered.filter(job => 
        job.jobType.toLowerCase() === jobFilters.jobType
      );
    }
    
    setFilteredJobs(filtered);
  }, [jobs, jobFilters]);

  const CourseCard = ({ course }: { course: Course }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <Badge variant="secondary" className="text-xs">
                {course.platform}
              </Badge>
              {course.aiRecommended && (
                <Badge variant="default" className="ml-2 text-xs bg-gradient-to-r from-primary to-primary/80">
                  AI Recommended
                </Badge>
              )}
            </div>
          </div>
          <Badge 
            variant={course.difficulty === "Beginner" ? "default" : 
                   course.difficulty === "Intermediate" ? "secondary" : "destructive"}
          >
            {course.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.studentsCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {course.isFree ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                Free
              </Badge>
            ) : (
              <span className="font-semibold text-lg">₹{course.price.toLocaleString()}</span>
            )}
          </div>
          <Button size="sm" className="group-hover:scale-105 transition-transform">
            View Course
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const JobCard = ({ job }: { job: Job }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div>
              {job.aiRecommended && (
                <Badge variant="default" className="text-xs bg-gradient-to-r from-primary to-primary/80">
                  AI Recommended
                </Badge>
              )}
            </div>
          </div>
          <Badge variant="outline">{job.jobType}</Badge>
        </div>
        <CardTitle className="text-lg group-hover:text-primary transition-colors">
          {job.title}
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <span className="font-medium">{job.company}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {job.location}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {job.salaryMin && job.salaryMax && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>₹{(job.salaryMin/100000).toFixed(0)}-{(job.salaryMax/100000).toFixed(0)}L</span>
              </div>
            )}
            <Badge variant="secondary" className="text-xs">
              {job.experienceLevel}
            </Badge>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(job.postedDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>
          
          <Button className="w-full group-hover:scale-105 transition-transform">
            Apply Now
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const LoadingSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (!careerPath) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No career path selected. Please complete the career assessment first.
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate("/")} className="mt-4">
            Take Assessment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Career Resources for <span className="text-primary">{careerPath}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover AI-curated courses and job opportunities tailored to your career path. 
            Start learning today and take the next step in your professional journey.
          </p>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Jobs
            </TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            {/* Course Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price</label>
                    <Select 
                      value={courseFilters.priceType} 
                      onValueChange={(value) => setCourseFilters(prev => ({ ...prev, priceType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Courses</SelectItem>
                        <SelectItem value="free">Free Only</SelectItem>
                        <SelectItem value="paid">Paid Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Difficulty</label>
                    <Select 
                      value={courseFilters.difficulty} 
                      onValueChange={(value) => setCourseFilters(prev => ({ ...prev, difficulty: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Duration</label>
                    <Select 
                      value={courseFilters.duration} 
                      onValueChange={(value) => setCourseFilters(prev => ({ ...prev, duration: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Duration</SelectItem>
                        <SelectItem value="short">Short (0-10 hours)</SelectItem>
                        <SelectItem value="medium">Medium (10-50 hours)</SelectItem>
                        <SelectItem value="long">Long (50+ hours)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Results */}
            {isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            {/* Job Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Experience Level</label>
                    <Select 
                      value={jobFilters.experienceLevel} 
                      onValueChange={(value) => setJobFilters(prev => ({ ...prev, experienceLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="entry-level">Entry Level</SelectItem>
                        <SelectItem value="mid-level">Mid Level</SelectItem>
                        <SelectItem value="senior-level">Senior Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Job Type</label>
                    <Select 
                      value={jobFilters.jobType} 
                      onValueChange={(value) => setJobFilters(prev => ({ ...prev, jobType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="onsite">Onsite</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Select 
                      value={jobFilters.location} 
                      onValueChange={(value) => setJobFilters(prev => ({ ...prev, location: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="bangalore">Bangalore</SelectItem>
                        <SelectItem value="mumbai">Mumbai</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="hyderabad">Hyderabad</SelectItem>
                        <SelectItem value="pune">Pune</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Results */}
            {isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}