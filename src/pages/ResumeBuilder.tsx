import React, { useState, useCallback, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, Download, Lightbulb, ArrowLeft, ArrowRight, Eye, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { toast } from "sonner";

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
import { useLanguage } from "@/contexts/LanguageContext";

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

// Resume template types
type ResumeTemplate = "modern" | "professional" | "creative";

interface TemplateConfig {
  name: string;
  description: string;
  primaryColor: [number, number, number];
  accentColor: [number, number, number];
  headerStyle: "centered" | "left" | "banner";
}

const templates: Record<ResumeTemplate, TemplateConfig> = {
  modern: {
    name: "Modern",
    description: "Clean and contemporary design",
    primaryColor: [33, 150, 243], // Blue
    accentColor: [69, 90, 100], // Dark blue-grey
    headerStyle: "centered"
  },
  professional: {
    name: "Professional",
    description: "Traditional business style",
    primaryColor: [76, 175, 80], // Green
    accentColor: [55, 71, 79], // Dark grey
    headerStyle: "left"
  },
  creative: {
    name: "Creative",
    description: "Modern with accent colors",
    primaryColor: [156, 39, 176], // Purple
    accentColor: [103, 58, 183], // Deep purple
    headerStyle: "banner"
  }
};

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
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCareer, setSelectedCareer] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>("modern");

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
    { id: "personal", title: translate('resume.builder.personal.title', 'Personal Info'), description: translate('resume.builder.personal.description', 'Basic contact information') },
    { id: "career", title: translate('resume.builder.career.title', 'Career Path'), description: translate('resume.builder.career.description', 'Select your target role') },
    { id: "summary", title: translate('resume.builder.summary.title', 'Summary'), description: translate('resume.builder.summary.description', 'Professional summary') },
    { id: "education", title: translate('resume.builder.education.title', 'Education'), description: translate('resume.builder.education.description', 'Academic background') },
    { id: "skills", title: translate('resume.builder.skills.title', 'Skills'), description: translate('resume.builder.skills.description', 'Technical and soft skills') },
    { id: "experience", title: translate('resume.builder.experience.title', 'Experience'), description: translate('resume.builder.experience.description', 'Work experience') },
    { id: "projects", title: translate('resume.builder.projects.title', 'Projects'), description: translate('resume.builder.projects.description', 'Notable projects') },
    { id: "achievements", title: translate('resume.builder.achievements.title', 'Achievements'), description: translate('resume.builder.achievements.description', 'Awards and recognitions') },
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

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Add custom font loading
  const loadCustomFont = (pdf: jsPDF) => {
    // Use system fonts that are widely available and ATS-friendly
    pdf.setFont("helvetica"); // Default to Helvetica (similar to Arial)
  };

  const generatePDF = async () => {
    try {
      console.log("GeneratePDF function called");
      setIsGeneratingPdf(true);
      setPdfError(null);
      
      const data = form.getValues();
      console.log("Form data retrieved:", !!data.personalInfo.fullName);
      
      // Validate required data
      if (!data.personalInfo.fullName || !data.personalInfo.email) {
        throw new Error("Please fill in all required personal information fields");
      }
      
      console.log("Starting PDF generation...");
      toast.loading("Generating your professional resume...");
      
      // Get template configuration
      const template = templates[selectedTemplate];
      console.log("Using template:", selectedTemplate);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        compress: true
      });
      
      // Load custom fonts
      loadCustomFont(pdf);
      
      // Set margins and page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = template.headerStyle === "banner" ? 12 : 15;
      const contentWidth = pageWidth - (margin * 2);
      
      // Helper function to check if we need a new page
      const checkPageBreak = (yPos: number, spaceNeeded: number = 15) => {
        if (yPos + spaceNeeded > pageHeight - margin) {
          pdf.addPage();
          return margin + 10;
        }
        return yPos;
      };

      // Helper function to add section header with template-specific styling
      const addSectionHeader = (title: string, yPos: number) => {
        yPos = checkPageBreak(yPos, 20);
        
        // Template-specific header styling
        if (selectedTemplate === "creative") {
          // Background bar for creative template
          pdf.setFillColor(...template.accentColor);
          pdf.rect(margin, yPos - 4, contentWidth, 8, 'F');
          pdf.setTextColor(255, 255, 255); // White text on colored background
        } else {
          pdf.setTextColor(...template.primaryColor);
        }
        
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(title.toUpperCase(), margin + (selectedTemplate === "creative" ? 2 : 0), yPos);
        
        // Add line under header (except for creative template)
        if (selectedTemplate !== "creative") {
          pdf.setLineWidth(0.5);
          pdf.setDrawColor(...template.primaryColor);
          pdf.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
        }
        
        return yPos + (selectedTemplate === "creative" ? 10 : 8);
      };

      // Header Section - Template-specific styling
      let yPosition = 20;
      
      if (template.headerStyle === "banner") {
        // Banner style header with background
        pdf.setFillColor(...template.primaryColor);
        pdf.rect(0, 0, pageWidth, 40, 'F');
        
        pdf.setFontSize(20);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(255, 255, 255);
        
        const nameWidth = pdf.getTextWidth(data.personalInfo.fullName.toUpperCase());
        const nameX = (pageWidth - nameWidth) / 2;
        pdf.text(data.personalInfo.fullName.toUpperCase(), nameX, 18);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        
        const contactInfo = [
          data.personalInfo.email,
          data.personalInfo.phone,
          data.personalInfo.location
        ].filter(Boolean);
        
        if (data.personalInfo.linkedin) contactInfo.push(data.personalInfo.linkedin);
        if (data.personalInfo.github) contactInfo.push(data.personalInfo.github);
        
        const contactLine = contactInfo.join(" | ");
        const contactWidth = pdf.getTextWidth(contactLine);
        const contactX = (pageWidth - contactWidth) / 2;
        pdf.text(contactLine, contactX, 28);
        
        yPosition = 50;
      } else if (template.headerStyle === "centered") {
        // Centered header
        pdf.setFontSize(20);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(...template.primaryColor);
        
        const nameWidth = pdf.getTextWidth(data.personalInfo.fullName.toUpperCase());
        const nameX = (pageWidth - nameWidth) / 2;
        pdf.text(data.personalInfo.fullName.toUpperCase(), nameX, 25);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(0, 0, 0);
        
        const contactInfo = [
          data.personalInfo.email,
          data.personalInfo.phone,
          data.personalInfo.location
        ].filter(Boolean);
        
        if (data.personalInfo.linkedin) contactInfo.push(data.personalInfo.linkedin);
        if (data.personalInfo.github) contactInfo.push(data.personalInfo.github);
        
        const contactLine = contactInfo.join(" | ");
        const contactWidth = pdf.getTextWidth(contactLine);
        const contactX = (pageWidth - contactWidth) / 2;
        pdf.text(contactLine, contactX, 35);
        
        yPosition = 50;
      } else {
        // Left-aligned header
        pdf.setFontSize(20);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(...template.primaryColor);
        pdf.text(data.personalInfo.fullName.toUpperCase(), margin, 25);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(0, 0, 0);
        
        const contactInfo = [
          data.personalInfo.email,
          data.personalInfo.phone,
          data.personalInfo.location
        ];
        
        contactInfo.forEach((info, index) => {
          pdf.text(info, margin, 35 + (index * 4));
        });
        
        if (data.personalInfo.linkedin) {
          pdf.text(data.personalInfo.linkedin, margin, 35 + (contactInfo.length * 4));
        }
        if (data.personalInfo.github) {
          pdf.text(data.personalInfo.github, margin, 35 + ((contactInfo.length + 1) * 4));
        }
        
        yPosition = 55 + (contactInfo.length * 4);
      }
      
      // Career Objective - ATS-Friendly Section
      yPosition = addSectionHeader("Career Objective", yPosition);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      
      const objectiveText = `Seeking a ${data.careerPath} position to leverage my skills and experience in ${data.skills.slice(0, 3).join(', ')} to contribute to organizational growth and career advancement.`;
      const objectiveLines = pdf.splitTextToSize(objectiveText, contentWidth);
      pdf.text(objectiveLines, margin, yPosition);
      yPosition += objectiveLines.length * 4 + 8;
      
      // Professional Summary
      yPosition = addSectionHeader("Professional Summary", yPosition);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      const summaryLines = pdf.splitTextToSize(data.summary, contentWidth);
      pdf.text(summaryLines, margin, yPosition);
      yPosition += summaryLines.length * 4 + 8;
      
      // Skills Section - ATS-Optimized with categories
      yPosition = addSectionHeader("Technical Skills", yPosition);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      
      // Group skills into categories for better ATS parsing
      const suggestions = getSuggestions();
      const technicalSkills = data.skills.filter(skill => 
        suggestions?.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      );
      const otherSkills = data.skills.filter(skill => !technicalSkills.includes(skill));
      
      if (technicalSkills.length > 0) {
        const techSkillsText = `Technical: ${technicalSkills.join(', ')}`;
        const techLines = pdf.splitTextToSize(techSkillsText, contentWidth);
        pdf.text(techLines, margin, yPosition);
        yPosition += techLines.length * 4 + 3;
      }
      
      if (otherSkills.length > 0) {
        const otherSkillsText = `Additional: ${otherSkills.join(', ')}`;
        const otherLines = pdf.splitTextToSize(otherSkillsText, contentWidth);
        pdf.text(otherLines, margin, yPosition);
        yPosition += otherLines.length * 4 + 8;
      }
      
      // Professional Experience - ATS Format
      yPosition = addSectionHeader("Professional Experience", yPosition);
      
      data.experience.forEach((exp, index) => {
        yPosition = checkPageBreak(yPosition, 25);
        
        // Job Title - Bold and prominent
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(exp.title, margin, yPosition);
        yPosition += 5;
        
        // Company and Duration
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(`${exp.company} | ${exp.duration}`, margin, yPosition);
        yPosition += 6;
        
        // Job Description with bullet points
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(0, 0, 0);
        const descLines = pdf.splitTextToSize(`• ${exp.description}`, contentWidth - 5);
        pdf.text(descLines, margin + 3, yPosition);
        yPosition += descLines.length * 4 + 6;
      });
      
      // Education Section
      yPosition = addSectionHeader("Education", yPosition);
      
      data.education.forEach((edu) => {
        yPosition = checkPageBreak(yPosition, 15);
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(edu.degree, margin, yPosition);
        yPosition += 5;
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        const eduInfo = `${edu.institution} | ${edu.year}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}`;
        pdf.text(eduInfo, margin, yPosition);
        yPosition += 8;
      });
      
      // Projects Section
      if (data.projects && data.projects.length > 0) {
        yPosition = addSectionHeader("Key Projects", yPosition);
        
        data.projects.forEach((project) => {
          yPosition = checkPageBreak(yPosition, 20);
          
          // Project Name
          pdf.setFontSize(11);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(0, 0, 0);
          pdf.text(project.name, margin, yPosition);
          yPosition += 5;
          
          // Technologies
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "italic");
          pdf.setTextColor(0, 0, 0);
          pdf.text(`Technologies: ${project.technologies}`, margin, yPosition);
          yPosition += 4;
          
          // Project Description
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          const projDescLines = pdf.splitTextToSize(`• ${project.description}`, contentWidth - 5);
          pdf.text(projDescLines, margin + 3, yPosition);
          yPosition += projDescLines.length * 4;
          
          // Project Link if available
          if (project.link) {
            pdf.setFontSize(9);
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(0, 0, 200); // Blue for links
            pdf.text(`Link: ${project.link}`, margin, yPosition);
            yPosition += 4;
          }
          yPosition += 4;
        });
      }
      
      // Achievements Section
      if (data.achievements && data.achievements.length > 0) {
        yPosition = addSectionHeader("Achievements & Recognition", yPosition);
        
        data.achievements.forEach((achievement) => {
          yPosition = checkPageBreak(yPosition, 10);
          
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(0, 0, 0);
          const achLines = pdf.splitTextToSize(`• ${achievement}`, contentWidth - 5);
          pdf.text(achLines, margin + 3, yPosition);
          yPosition += achLines.length * 4 + 2;
        });
      }
      
      // Career Recommendations Section (if career path is selected)
      if (data.careerPath && suggestions) {
        yPosition = addSectionHeader("Career Alignment", yPosition);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(0, 0, 0);
        
        const alignmentText = `This resume is optimized for ${data.careerPath} positions. Key focus areas include: ${suggestions.keywords.slice(0, 4).join(', ')}.`;
        const alignmentLines = pdf.splitTextToSize(alignmentText, contentWidth);
        pdf.text(alignmentLines, margin, yPosition);
        yPosition += alignmentLines.length * 4 + 4;
        
        // Skills match score (simulated)
        const skillsMatch = Math.round((data.skills.filter(skill => 
          suggestions.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
        ).length / suggestions.skills.length) * 100);
        
        pdf.text(`Skills Alignment Score: ${skillsMatch}% match for ${data.careerPath}`, margin, yPosition);
      }
      
      // Footer - Professional and template-styled
      const pageCount = pdf.internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...template.accentColor);
        
        // Left footer: Generated by skillmap.ai
        pdf.text("Generated by skillmap.ai", margin, pageHeight - 8);
        
        // Center footer: Name and title
        const centerText = `${data.personalInfo.fullName} - ${data.careerPath || 'Professional'} Resume`;
        const centerWidth = pdf.getTextWidth(centerText);
        const centerX = (pageWidth - centerWidth) / 2;
        pdf.text(centerText, centerX, pageHeight - 8);
        
        // Right footer: Page number
        const pageText = `Page ${i} of ${pageCount}`;
        const pageTextWidth = pdf.getTextWidth(pageText);
        pdf.text(pageText, pageWidth - margin - pageTextWidth, pageHeight - 8);
      }
      
      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `SkillMap_Resume_${data.personalInfo.fullName.replace(/\s+/g, '_')}_${timestamp}.pdf`;
      
      // Create blob and open in new tab for preview and download
      console.log("Creating PDF blob and opening in new tab...");
      const pdfOutput = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfOutput);
      
      // Open PDF in new tab
      const newTab = window.open(blobUrl, '_blank');
      if (newTab) {
        newTab.document.title = filename;
        console.log("PDF opened successfully in new tab");
        toast.success("Resume opened in new tab! You can view and download it from there. 🎉");
      } else {
        // Fallback for blocked popups
        console.log("Popup blocked, offering direct download");
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.click();
        toast.success("Resume downloaded successfully! 🎉");
      }
      
      // Clean up the blob URL after a delay to prevent memory leaks
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 100000); // 100 seconds should be enough for the user to view/download
      
      console.log("PDF generated and opened successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate PDF. Please try again.";
      setPdfError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Quick regeneration function
  const quickRegenerate = useCallback(() => {
    console.log("Quick regenerate clicked");
    if (showPreview) {
      const data = form.getValues();
      console.log("Refreshing preview with data:", !!data.personalInfo.fullName);
      toast.success("Preview refreshed!");
      // Force re-render by setting showPreview false then true
      setShowPreview(false);
      setTimeout(() => setShowPreview(true), 50);
    }
  }, [showPreview, form]);

  const onSubmit = useCallback(async (data: ResumeData) => {
    console.log("Form submitted:", data);
    // Directly generate and open PDF in a new tab for preview + download
    await generatePDF();
  }, [generatePDF]);

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

  // Memoize getSuggestions to prevent infinite re-renders
  const getSuggestions = useCallback(() => {
    const watchedCareer = form.watch("careerPath");
    return aiSuggestions[watchedCareer as keyof typeof aiSuggestions];
  }, [form.watch("careerPath")]);

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
                     <FormLabel>{translate('resume.builder.personal.fullName', 'Full Name')}</FormLabel>
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
                     <FormLabel>{translate('resume.builder.personal.email', 'Email')}</FormLabel>
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
                      <Input placeholder="City, State" {...field} />
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
                  <FormLabel>Target Career Path</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedCareer(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your target career" />
                      </SelectTrigger>
                      <SelectContent>
                        {careerPaths.map((path) => (
                          <SelectItem key={path} value={path}>
                            {path}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      placeholder="Write a compelling professional summary..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case "education":
        const educationFields = form.watch("education");
        return (
          <div className="space-y-6">
            {educationFields.map((_, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Education {index + 1}</h3>
                  {educationFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeEducation(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`education.${index}.degree`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree</FormLabel>
                        <FormControl>
                          <Input placeholder="Bachelor of Computer Science" {...field} />
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
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name={`education.${index}.year`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input placeholder="2020-2024" {...field} />
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
                          <Input placeholder="3.8/4.0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addEducation}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Education
            </Button>
          </div>
        );

      case "skills":
        const suggestions = getSuggestions();
        const currentSkills = form.watch("skills");
        
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Your Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {currentSkills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-xs"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        addSkill(input.value.trim());
                        input.value = "";
                      }
                    }
                  }}
                />
              </div>
            </div>

            {suggestions && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-medium">AI Suggestions for {selectedCareer}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.skills
                    .filter(skill => !currentSkills.includes(skill))
                    .map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => addSkill(skill)}
                      >
                        + {skill}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </div>
        );

      case "experience":
        const experienceFields = form.watch("experience");
        return (
          <div className="space-y-6">
            {experienceFields.map((_, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Experience {index + 1}</h3>
                  {experienceFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeExperience(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`experience.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Software Developer" {...field} />
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
                          <Input placeholder="Tech Company Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-4">
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
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name={`experience.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your responsibilities and achievements..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addExperience}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Experience
            </Button>
          </div>
        );

      case "projects":
        const projectFields = form.watch("projects");
        return (
          <div className="space-y-6">
            {projectFields.map((_, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Project {index + 1}</h3>
                  {projectFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeProject(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`projects.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My Awesome Project" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <FormField
                    control={form.control}
                    name={`projects.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your project and its impact..."
                            {...field}
                          />
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
                          <Input placeholder="https://github.com/username/project" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addProject}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </Button>
          </div>
        );

      case "achievements":
        const currentAchievements = form.watch("achievements");
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Achievements & Awards</h3>
              <div className="space-y-2 mb-4">
                {currentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span>{achievement}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAchievement(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add an achievement..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        addAchievement(input.value.trim());
                        input.value = "";
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Memoized Resume Preview Component to prevent unnecessary re-renders
  const ResumePreview = useMemo(() => {
    console.log("ResumePreview: Creating memoized component");
    
    return function ResumePreviewComponent({ data, template = "modern" }: { data: ResumeData; template?: ResumeTemplate }) {
      console.log("ResumePreview: Rendering with data:", !!data.personalInfo.fullName);
      
      const templateConfig = templates[template];
      const primaryColor = `rgb(${templateConfig.primaryColor.join(',')})`;
      const accentColor = `rgb(${templateConfig.accentColor.join(',')})`;

      if (!data.personalInfo.fullName) {
        return (
          <div className="text-center text-muted-foreground py-8">
            Fill in the form to see your resume preview
          </div>
        );
      }

    return (
      <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto overflow-hidden" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        {/* Header - Template specific */}
        {templateConfig.headerStyle === "banner" ? (
          <div className="text-center p-6 text-white mb-6" style={{ backgroundColor: primaryColor }}>
            <h1 className="text-3xl font-bold mb-2">{data.personalInfo.fullName}</h1>
            <div className="text-sm space-y-1">
              <div>{data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.location}</div>
              {(data.personalInfo.linkedin || data.personalInfo.github) && (
                <div>
                  {[data.personalInfo.linkedin, data.personalInfo.github].filter(Boolean).join(" | ")}
                </div>
              )}
            </div>
          </div>
        ) : templateConfig.headerStyle === "centered" ? (
          <div className="text-center mb-8 p-6 border-b">
            <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>{data.personalInfo.fullName}</h1>
            <div className="text-sm text-gray-600 space-y-1">
              <div>{data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.location}</div>
              {(data.personalInfo.linkedin || data.personalInfo.github) && (
                <div>
                  {[data.personalInfo.linkedin, data.personalInfo.github].filter(Boolean).join(" | ")}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-8 p-6 border-b">
            <h1 className="text-3xl font-bold mb-3" style={{ color: primaryColor }}>{data.personalInfo.fullName}</h1>
            <div className="text-sm text-gray-600 space-y-1">
              <div>{data.personalInfo.email}</div>
              <div>{data.personalInfo.phone}</div>
              <div>{data.personalInfo.location}</div>
              {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
              {data.personalInfo.github && <div>{data.personalInfo.github}</div>}
            </div>
          </div>
        )}

        {/* Professional Summary */}
        {data.summary && (
          <div className="mb-6 px-6">
            <h2 
              className="text-lg font-bold mb-2 border-b pb-1" 
              style={{ 
                color: primaryColor,
                borderColor: template === "creative" ? primaryColor : '#ccc'
              }}
            >
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="mb-6 px-6">
            <h2 
              className="text-lg font-bold mb-2 border-b pb-1" 
              style={{ 
                color: primaryColor,
                borderColor: template === "creative" ? primaryColor : '#ccc'
              }}
            >
              TECHNICAL SKILLS
            </h2>
            <div className="text-sm text-gray-700">
              <p>{data.skills.join(" • ")}</p>
            </div>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div className="mb-6 px-6">
            <h2 
              className="text-lg font-bold mb-2 border-b pb-1" 
              style={{ 
                color: primaryColor,
                borderColor: template === "creative" ? primaryColor : '#ccc'
              }}
            >
              PROFESSIONAL EXPERIENCE
            </h2>
            {data.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-sm" style={{ color: accentColor }}>{exp.title}</h3>
                  <span className="text-xs text-gray-600">{exp.duration}</span>
                </div>
                <div className="text-sm text-gray-700 mb-1">{exp.company}</div>
                <p className="text-sm leading-relaxed text-gray-700">• {exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div className="mb-6 px-6">
            <h2 
              className="text-lg font-bold mb-2 border-b pb-1" 
              style={{ 
                color: primaryColor,
                borderColor: template === "creative" ? primaryColor : '#ccc'
              }}
            >
              EDUCATION
            </h2>
            {data.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: accentColor }}>{edu.degree}</h3>
                    <div className="text-sm text-gray-700">{edu.institution}</div>
                    {edu.gpa && <div className="text-sm text-gray-600">GPA: {edu.gpa}</div>}
                  </div>
                  <span className="text-xs text-gray-600">{edu.year}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div className="mb-6 px-6">
            <h2 
              className="text-lg font-bold mb-2 border-b pb-1" 
              style={{ 
                color: primaryColor,
                borderColor: template === "creative" ? primaryColor : '#ccc'
              }}
            >
              KEY PROJECTS
            </h2>
            {data.projects.map((project, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold text-sm" style={{ color: accentColor }}>{project.name}</h3>
                <div className="text-xs text-gray-600 mb-1">Technologies: {project.technologies}</div>
                <p className="text-sm leading-relaxed text-gray-700">• {project.description}</p>
                {project.link && (
                  <div className="text-xs mt-1" style={{ color: primaryColor }}>Link: {project.link}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {data.achievements && data.achievements.length > 0 && (
          <div className="mb-6 px-6">
            <h2 
              className="text-lg font-bold mb-2 border-b pb-1" 
              style={{ 
                color: primaryColor,
                borderColor: template === "creative" ? primaryColor : '#ccc'
              }}
            >
              ACHIEVEMENTS & RECOGNITION
            </h2>
            <ul className="text-sm space-y-1 text-gray-700">
              {data.achievements.map((achievement, index) => (
                <li key={index} className="leading-relaxed">• {achievement}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t text-center text-xs text-gray-500 px-6">
          Generated by skillmap.ai - Professional Resume Builder
        </div>
      </div>
    );
    };
  }, []);

  if (showPreview) {
    const data = form.getValues();
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Resume Preview - {templates[selectedTemplate].name} Template</h1>
              <p className="text-muted-foreground">Professional, ATS-friendly resume ready for download</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Edit Resume
              </Button>
              <Button
                onClick={quickRegenerate}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Refresh Preview
              </Button>
              <Button 
                onClick={generatePDF}
                disabled={isGeneratingPdf}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
              </Button>
            </div>
          </div>
          
          {/* Error handling for PDF generation */}
          {pdfError && (
            <Alert className="mb-4 border-destructive">
              <AlertDescription className="text-destructive flex items-center justify-between">
                <span>{pdfError}</span>
                <Button
                  onClick={() => setPdfError(null)}
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Template Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Choose Template
              </CardTitle>
              <CardDescription>
                Select a professional template for your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(templates).map(([key, template]) => (
                  <div
                    key={key}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate === key ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedTemplate(key as ResumeTemplate)}
                  >
                    <div className="h-24 rounded mb-3 border" style={{
                      background: `linear-gradient(135deg, rgb(${template.primaryColor.join(',')}), rgb(${template.accentColor.join(',')}))`
                    }} />
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="border rounded-lg p-4 bg-muted/20">
            <ResumePreview data={data} template={selectedTemplate} />
          </div>
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
              {translate('resume.builder.back', 'Back to Home')}
            </Button>
          <h1 className="text-3xl font-bold mb-2">{translate('resume.builder.title', 'AI-Powered Resume Builder')}</h1>
          <p className="text-muted-foreground">
            {translate('resume.builder.subtitle', 'Create a professional resume tailored to your career path with AI suggestions')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Step Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{translate('resume.builder.progress', 'Progress')}</CardTitle>
                <CardDescription>
                  {translate('resume.builder.step', 'Step')} {currentStep + 1} {translate('resume.builder.of', 'of')} {steps.length}
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

                {/* Template Selection */}
                {currentStep === 0 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Choose Template
                      </CardTitle>
                      <CardDescription>
                        Select a professional template for your resume
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(templates).map(([key, template]) => (
                          <div
                            key={key}
                            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                              selectedTemplate === key ? "ring-2 ring-primary" : ""
                            }`}
                            onClick={() => setSelectedTemplate(key as ResumeTemplate)}
                          >
                            <div className="h-24 rounded mb-3 border" style={{
                              background: `linear-gradient(135deg, rgb(${template.primaryColor.join(',')}), rgb(${template.accentColor.join(',')}))`
                            }} />
                            <h3 className="font-semibold">{template.name}</h3>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

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
                    <Button type="submit" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Preview Resume
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