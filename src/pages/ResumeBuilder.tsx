import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, Download, Lightbulb, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";

const resumeSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(1, "Phone number is required"),
    location: z.string().min(1, "Location is required"),
    linkedin: z.string().optional(),
    github: z.string().optional(),
  }),
  careerPath: z.string().min(1, "Please select a career path"),
  summary: z.string().min(50, "Professional summary should be at least 50 characters"),
  education: z.array(z.object({
    degree: z.string().min(1, "Degree is required"),
    institution: z.string().min(1, "Institution is required"),
    year: z.string().min(1, "Year is required"),
    gpa: z.string().optional(),
  })).min(1, "At least one education entry is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  experience: z.array(z.object({
    title: z.string().min(1, "Job title is required"),
    company: z.string().min(1, "Company is required"),
    duration: z.string().min(1, "Duration is required"),
    description: z.string().min(1, "Description is required"),
  })).min(1, "At least one work experience is required"),
  projects: z.array(z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().min(1, "Description is required"),
    technologies: z.string().min(1, "Technologies used is required"),
    link: z.string().optional(),
  })).min(1, "At least one project is required"),
  achievements: z.array(z.string()).min(1, "At least one achievement is required"),
});

type ResumeData = z.infer<typeof resumeSchema>;

const careerPaths = [
  "Data Scientist",
  "Web Developer",
  "Product Manager",
  "Software Engineer",
  "UX/UI Designer",
  "DevOps Engineer",
  "Marketing Manager",
  "Business Analyst",
  "Project Manager",
  "Sales Representative"
];

const aiSuggestions = {
  "Data Scientist": {
    skills: ["Python", "R", "SQL", "Machine Learning", "TensorFlow", "Pandas", "NumPy", "Tableau", "Power BI"],
    keywords: ["data analysis", "statistical modeling", "predictive analytics", "data visualization", "big data"]
  },
  "Web Developer": {
    skills: ["JavaScript", "React", "Node.js", "HTML", "CSS", "TypeScript", "MongoDB", "PostgreSQL", "Git"],
    keywords: ["responsive design", "API development", "frontend", "backend", "full-stack", "agile development"]
  },
  "Product Manager": {
    skills: ["Product Strategy", "Agile", "Scrum", "User Research", "Analytics", "Roadmapping", "Stakeholder Management"],
    keywords: ["product roadmap", "user experience", "market research", "cross-functional collaboration", "KPIs"]
  }
};

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCareer, setSelectedCareer] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
      },
      careerPath: "",
      summary: "",
      education: [{ degree: "", institution: "", year: "", gpa: "" }],
      skills: [],
      experience: [{ title: "", company: "", duration: "", description: "" }],
      projects: [{ name: "", description: "", technologies: "", link: "" }],
      achievements: [],
    },
  });

  const steps = [
    { id: "personal", title: "Personal Info", description: "Basic contact information" },
    { id: "career", title: "Career Path", description: "Select your target role" },
    { id: "summary", title: "Summary", description: "Professional summary" },
    { id: "education", title: "Education", description: "Academic background" },
    { id: "skills", title: "Skills", description: "Technical and soft skills" },
    { id: "experience", title: "Experience", description: "Work experience" },
    { id: "projects", title: "Projects", description: "Notable projects" },
    { id: "achievements", title: "Achievements", description: "Awards and recognitions" },
  ];

  const addEducation = () => {
    const current = form.getValues("education");
    form.setValue("education", [...current, { degree: "", institution: "", year: "", gpa: "" }]);
  };

  const removeEducation = (index: number) => {
    const current = form.getValues("education");
    form.setValue("education", current.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    const current = form.getValues("experience");
    form.setValue("experience", [...current, { title: "", company: "", duration: "", description: "" }]);
  };

  const removeExperience = (index: number) => {
    const current = form.getValues("experience");
    form.setValue("experience", current.filter((_, i) => i !== index));
  };

  const addProject = () => {
    const current = form.getValues("projects");
    form.setValue("projects", [...current, { name: "", description: "", technologies: "", link: "" }]);
  };

  const removeProject = (index: number) => {
    const current = form.getValues("projects");
    form.setValue("projects", current.filter((_, i) => i !== index));
  };

  const addSkill = (skill: string) => {
    const current = form.getValues("skills");
    if (!current.includes(skill)) {
      form.setValue("skills", [...current, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    const current = form.getValues("skills");
    form.setValue("skills", current.filter(s => s !== skill));
  };

  const addAchievement = (achievement: string) => {
    const current = form.getValues("achievements");
    form.setValue("achievements", [...current, achievement]);
  };

  const removeAchievement = (index: number) => {
    const current = form.getValues("achievements");
    form.setValue("achievements", current.filter((_, i) => i !== index));
  };

  const generatePDF = () => {
    const data = form.getValues();
    const pdf = new jsPDF();
    
    // Helper function to check if we need a new page
    const checkPageBreak = (yPos: number, spaceNeeded: number = 20) => {
      if (yPos + spaceNeeded > 280) {
        pdf.addPage();
        return 20;
      }
      return yPos;
    };

    // Helper function to add section header
    const addSectionHeader = (title: string, yPos: number) => {
      yPos = checkPageBreak(yPos, 30);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(40, 40, 40);
      pdf.text(title.toUpperCase(), 20, yPos);
      
      // Add underline
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(40, 40, 40);
      pdf.line(20, yPos + 2, 190, yPos + 2);
      
      return yPos + 12;
    };

    // Header Section with Professional Layout
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(20, 20, 20);
    pdf.text(data.personalInfo.fullName.toUpperCase(), 20, 25);
    
    // Contact Information
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(60, 60, 60);
    const contactLine1 = `${data.personalInfo.email} • ${data.personalInfo.phone}`;
    const contactLine2 = `${data.personalInfo.location}${data.personalInfo.linkedin ? ' • ' + data.personalInfo.linkedin : ''}${data.personalInfo.github ? ' • ' + data.personalInfo.github : ''}`;
    
    pdf.text(contactLine1, 20, 35);
    pdf.text(contactLine2, 20, 43);
    
    let yPosition = 55;
    
    // Professional Summary
    yPosition = addSectionHeader("Professional Summary", yPosition);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(40, 40, 40);
    const summaryLines = pdf.splitTextToSize(data.summary, 170);
    pdf.text(summaryLines, 20, yPosition);
    yPosition += summaryLines.length * 4.5 + 8;
    
    // Core Competencies (Skills)
    yPosition = addSectionHeader("Core Competencies", yPosition);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(40, 40, 40);
    
    // Format skills in columns for better presentation
    const skillsPerLine = 3;
    const skillsText = data.skills.join(" • ");
    const skillLines = pdf.splitTextToSize(skillsText, 170);
    pdf.text(skillLines, 20, yPosition);
    yPosition += skillLines.length * 4.5 + 8;
    
    // Professional Experience
    yPosition = addSectionHeader("Professional Experience", yPosition);
    
    data.experience.forEach((exp, index) => {
      yPosition = checkPageBreak(yPosition, 40);
      
      // Job Title and Company
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(20, 20, 20);
      pdf.text(`${exp.title}`, 20, yPosition);
      
      // Company and Duration on same line
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(40, 40, 40);
      pdf.text(`${exp.company} | ${exp.duration}`, 120, yPosition);
      yPosition += 7;
      
      // Job Description
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(40, 40, 40);
      const descLines = pdf.splitTextToSize(`• ${exp.description}`, 165);
      pdf.text(descLines, 25, yPosition);
      yPosition += descLines.length * 4.5 + 6;
    });
    
    // Projects
    if (data.projects && data.projects.length > 0) {
      yPosition = addSectionHeader("Key Projects", yPosition);
      
      data.projects.forEach((project) => {
        yPosition = checkPageBreak(yPosition, 30);
        
        // Project Name
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(20, 20, 20);
        pdf.text(project.name, 20, yPosition);
        yPosition += 6;
        
        // Technologies
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(60, 60, 60);
        pdf.text(`Technologies: ${project.technologies}`, 20, yPosition);
        yPosition += 5;
        
        // Project Description
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(40, 40, 40);
        const projDescLines = pdf.splitTextToSize(`• ${project.description}`, 165);
        pdf.text(projDescLines, 25, yPosition);
        yPosition += projDescLines.length * 4.5 + 6;
      });
    }
    
    // Education
    yPosition = addSectionHeader("Education", yPosition);
    
    data.education.forEach((edu) => {
      yPosition = checkPageBreak(yPosition, 20);
      
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(20, 20, 20);
      pdf.text(edu.degree, 20, yPosition);
      
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(40, 40, 40);
      pdf.text(`${edu.institution} | ${edu.year}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}`, 120, yPosition);
      yPosition += 8;
    });
    
    // Achievements
    if (data.achievements && data.achievements.length > 0) {
      yPosition = addSectionHeader("Achievements & Recognition", yPosition);
      
      data.achievements.forEach((achievement) => {
        yPosition = checkPageBreak(yPosition, 15);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(40, 40, 40);
        const achLines = pdf.splitTextToSize(`• ${achievement}`, 165);
        pdf.text(achLines, 25, yPosition);
        yPosition += achLines.length * 4.5 + 3;
      });
    }
    
    // Footer with professional note
    const pageCount = pdf.internal.pages.length - 1; // -1 because pages array includes empty first element
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(100, 100, 100);
      pdf.text(`${data.personalInfo.fullName} - ${data.careerPath} Resume`, 20, 290);
      pdf.text(`Page ${i} of ${pageCount}`, 170, 290);
    }
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume_${timestamp}.pdf`;
    
    pdf.save(filename);
  };

  const onSubmit = (data: ResumeData) => {
    setShowPreview(true);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getSuggestions = () => {
    if (selectedCareer && aiSuggestions[selectedCareer as keyof typeof aiSuggestions]) {
      return aiSuggestions[selectedCareer as keyof typeof aiSuggestions];
    }
    return null;
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.id) {
      case "personal":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="personalInfo.fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalInfo.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="personalInfo.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalInfo.location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="New York, NY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="personalInfo.linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="linkedin.com/in/johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalInfo.github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="github.com/johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case "career":
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="careerPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Your Target Career Path</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedCareer(value);
                  }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a career path" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {careerPaths.map((path) => (
                        <SelectItem key={path} value={path}>
                          {path}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {selectedCareer && getSuggestions() && (
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>AI Suggestion:</strong> For {selectedCareer} roles, consider highlighting these key skills: {getSuggestions()?.skills.slice(0, 5).join(", ")}
                </AlertDescription>
              </Alert>
            )}
          </div>
        );

      case "summary":
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Summary</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {selectedCareer && getSuggestions() && (
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>AI Tip:</strong> Include these keywords in your summary: {getSuggestions()?.keywords.join(", ")}
                </AlertDescription>
              </Alert>
            )}
          </div>
        );

      case "education":
        const educationEntries = form.watch("education");
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Education</h3>
              <Button type="button" onClick={addEducation} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </div>
            
            {educationEntries.map((_, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name={`education.${index}.degree`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Degree</FormLabel>
                          <FormControl>
                            <Input placeholder="Bachelor of Science" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`education.${index}.institution`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institution</FormLabel>
                          <FormControl>
                            <Input placeholder="University Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`education.${index}.year`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Graduation Year</FormLabel>
                          <FormControl>
                            <Input placeholder="2023" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`education.${index}.gpa`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GPA (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="3.8" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {educationEntries.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="mt-4"
                      onClick={() => removeEducation(index)}
                    >
                      Remove
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case "skills":
        const skills = form.watch("skills");
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Skills</h3>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Add a skill and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value) {
                          addSkill(value);
                          e.currentTarget.value = "";
                        }
                      }
                    }}
                  />
                </div>
                
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeSkill(skill)}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {selectedCareer && getSuggestions() && (
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>AI Suggestions:</strong> Consider adding these skills for {selectedCareer}:
                  <div className="mt-2 flex flex-wrap gap-1">
                    {getSuggestions()?.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => addSkill(skill)}
                      >
                        + {skill}
                      </Badge>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        );

      case "experience":
        const experienceEntries = form.watch("experience");
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Work Experience</h3>
              <Button type="button" onClick={addExperience} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </div>
            
            {experienceEntries.map((_, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name={`experience.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Software Engineer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`experience.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Tech Corp" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-4">
                    <FormField
                      control={form.control}
                      name={`experience.${index}.duration`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="Jan 2022 - Present" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`experience.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your key responsibilities and achievements..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {experienceEntries.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="mt-4"
                      onClick={() => removeExperience(index)}
                    >
                      Remove
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case "projects":
        const projectEntries = form.watch("projects");
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Projects</h3>
              <Button type="button" onClick={addProject} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
            
            {projectEntries.map((_, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name={`projects.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input placeholder="E-commerce Platform" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`projects.${index}.link`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Link (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://github.com/user/project" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-4">
                    <FormField
                      control={form.control}
                      name={`projects.${index}.technologies`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Technologies Used</FormLabel>
                          <FormControl>
                            <Input placeholder="React, Node.js, MongoDB" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`projects.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the project and your contributions..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {projectEntries.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="mt-4"
                      onClick={() => removeProject(index)}
                    >
                      Remove
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case "achievements":
        const achievements = form.watch("achievements");
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Achievements</h3>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Add an achievement and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value) {
                          addAchievement(value);
                          e.currentTarget.value = "";
                        }
                      }
                    }}
                  />
                </div>
                
                {achievements.length > 0 && (
                  <div className="space-y-2">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-3 rounded-md">
                        <span>{achievement}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAchievement(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>AI Tip:</strong> Include specific, quantifiable achievements like "Increased sales by 25%" or "Led a team of 5 developers"
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  const ResumePreview = ({ data }: { data: ResumeData }) => (
    <div className="bg-white text-black p-8 max-w-4xl mx-auto shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{data.personalInfo.fullName}</h1>
        <p className="text-gray-600">
          {data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.location}
        </p>
        {(data.personalInfo.linkedin || data.personalInfo.github) && (
          <p className="text-blue-600">
            {data.personalInfo.linkedin && `LinkedIn: ${data.personalInfo.linkedin}`}
            {data.personalInfo.linkedin && data.personalInfo.github && " | "}
            {data.personalInfo.github && `GitHub: ${data.personalInfo.github}`}
          </p>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300">
          Professional Summary
        </h2>
        <p className="text-gray-700">{data.summary}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300">
          Skills
        </h2>
        <p className="text-gray-700">{data.skills.join(", ")}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300">
          Experience
        </h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                <p className="text-gray-700 font-medium">{exp.company}</p>
              </div>
              <p className="text-gray-600 italic">{exp.duration}</p>
            </div>
            <p className="text-gray-700 mt-2">{exp.description}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300">
          Projects
        </h2>
        {data.projects.map((project, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              {project.link && (
                <a href={project.link} className="text-blue-600 underline">
                  View Project
                </a>
              )}
            </div>
            <p className="text-gray-600 italic">{project.technologies}</p>
            <p className="text-gray-700 mt-2">{project.description}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300">
          Education
        </h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-700">{edu.institution}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">{edu.year}</p>
                {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300">
          Achievements
        </h2>
        <ul className="list-disc list-inside text-gray-700">
          {data.achievements.map((achievement, index) => (
            <li key={index}>{achievement}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  if (showPreview) {
    const data = form.getValues();
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Resume Preview</h1>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Edit Resume
              </Button>
              <Button onClick={generatePDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
          <ResumePreview data={data} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold mb-2">AI-Powered Resume Builder</h1>
          <p className="text-muted-foreground">
            Create a professional resume tailored to your career path with AI suggestions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Step Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
                <CardDescription>
                  Step {currentStep + 1} of {steps.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`p-2 rounded-md text-sm ${
                        index === currentStep
                          ? "bg-primary text-primary-foreground"
                          : index < currentStep
                          ? "bg-muted text-muted-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      <div className="font-medium">{step.title}</div>
                      <div className="text-xs">{step.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                  <CardHeader>
                    <CardTitle>{steps[currentStep].title}</CardTitle>
                    <CardDescription>{steps[currentStep].description}</CardDescription>
                  </CardHeader>
                  <CardContent>{renderStepContent()}</CardContent>
                </Card>

                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep === steps.length - 1 ? (
                    <Button type="submit">
                      Generate Resume
                    </Button>
                  ) : (
                    <Button type="button" onClick={nextStep}>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}