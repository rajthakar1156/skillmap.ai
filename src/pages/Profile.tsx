import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, User, BookOpen, Heart, Target, Trophy } from "lucide-react";

interface ProfileData {
  academics: {
    class_12_stream: string;
    key_subjects_score: {
      [key: string]: number;
    };
  };
  interests: string[];
  personality: {
    type: string;
    strong_traits: string[];
  };
  extracurriculars: string[];
  values: string[];
}

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProfileData>({
    academics: {
      class_12_stream: "",
      key_subjects_score: {}
    },
    interests: [],
    personality: {
      type: "",
      strong_traits: []
    },
    extracurriculars: [],
    values: []
  });

  const streams = ["Science (PCM)", "Science (PCB)", "Commerce", "Arts/Humanities"];
  const personalityTypes = ["Extroverted", "Introverted", "Balanced"];
  const traits = ["analytical", "creative", "detail-oriented", "logical", "empathetic", "leadership-oriented", "collaborative", "independent"];
  const interestOptions = ["technology", "video games", "solving puzzles", "sci-fi movies", "reading tech blogs", "art", "music", "sports", "writing", "mathematics", "science experiments"];
  const valueOptions = ["innovation", "problem-solving", "stable career", "work-life balance", "social impact", "financial growth", "creativity", "helping others"];

  const handleSubjectScoreChange = (subject: string, score: string) => {
    setFormData(prev => ({
      ...prev,
      academics: {
        ...prev.academics,
        key_subjects_score: {
          ...prev.academics.key_subjects_score,
          [subject]: parseInt(score) || 0
        }
      }
    }));
  };

  const handleCheckboxChange = (value: string, field: keyof Pick<ProfileData, 'interests' | 'extracurriculars' | 'values'>) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const handleTraitChange = (trait: string) => {
    setFormData(prev => {
      const currentTraits = prev.personality.strong_traits;
      const newTraits = currentTraits.includes(trait)
        ? currentTraits.filter(t => t !== trait)
        : [...currentTraits, trait];
      
      return {
        ...prev,
        personality: {
          ...prev.personality,
          strong_traits: newTraits
        }
      };
    });
  };

  const getSubjectsForStream = (stream: string) => {
    switch (stream) {
      case "Science (PCM)":
        return ["Math", "Physics", "Chemistry"];
      case "Science (PCB)":
        return ["Biology", "Physics", "Chemistry"];
      case "Commerce":
        return ["Accountancy", "Business Studies", "Economics"];
      case "Arts/Humanities":
        return ["History", "Political Science", "English"];
      default:
        return [];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store form data and navigate to results
    localStorage.setItem('profileData', JSON.stringify(formData));
    navigate('/results');
  };

  const isFormValid = () => {
    return formData.academics.class_12_stream &&
           Object.keys(formData.academics.key_subjects_score).length > 0 &&
           formData.personality.type &&
           formData.interests.length > 0 &&
           formData.personality.strong_traits.length > 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Tell us about yourself
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help us understand your profile to provide personalized career recommendations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Academic Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Academic Background
              </CardTitle>
              <CardDescription>
                Tell us about your educational stream and performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="stream">Class 12 Stream</Label>
                <Select 
                  value={formData.academics.class_12_stream} 
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    academics: { ...prev.academics, class_12_stream: value, key_subjects_score: {} }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your stream" />
                  </SelectTrigger>
                  <SelectContent>
                    {streams.map(stream => (
                      <SelectItem key={stream} value={stream}>{stream}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.academics.class_12_stream && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getSubjectsForStream(formData.academics.class_12_stream).map(subject => (
                    <div key={subject}>
                      <Label htmlFor={subject}>{subject} Score (%)</Label>
                      <Input
                        id={subject}
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Enter score"
                        value={formData.academics.key_subjects_score[subject] || ''}
                        onChange={(e) => handleSubjectScoreChange(subject, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Personality */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-secondary" />
                Personality Profile
              </CardTitle>
              <CardDescription>
                Help us understand your personality and working style
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Personality Type</Label>
                <Select 
                  value={formData.personality.type} 
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    personality: { ...prev.personality, type: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your personality type" />
                  </SelectTrigger>
                  <SelectContent>
                    {personalityTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">Strong Traits (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  {traits.map(trait => (
                    <div key={trait} className="flex items-center space-x-2">
                      <Checkbox
                        id={trait}
                        checked={formData.personality.strong_traits.includes(trait)}
                        onCheckedChange={() => handleTraitChange(trait)}
                      />
                      <Label htmlFor={trait} className="text-sm capitalize">
                        {trait.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interests */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-accent" />
                Interests & Hobbies
              </CardTitle>
              <CardDescription>
                What do you enjoy doing in your free time?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interestOptions.map(interest => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest}
                      checked={formData.interests.includes(interest)}
                      onCheckedChange={() => handleCheckboxChange(interest, 'interests')}
                    />
                    <Label htmlFor={interest} className="text-sm capitalize">
                      {interest.replace('-', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Values */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Values & Priorities
              </CardTitle>
              <CardDescription>
                What matters most to you in your career?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {valueOptions.map(value => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={value}
                      checked={formData.values.includes(value)}
                      onCheckedChange={() => handleCheckboxChange(value, 'values')}
                    />
                    <Label htmlFor={value} className="text-sm capitalize">
                      {value.replace('-', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button 
              type="submit" 
              variant="hero" 
              size="xl"
              disabled={!isFormValid()}
              className="min-w-[200px]"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Get My Career Recommendations
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;