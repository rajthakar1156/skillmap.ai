import React, { useState } from 'react';
import { ClerkProvider, SignIn, SignUp, SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Results from "./pages/Results";
import Opportunities from "./pages/Opportunities";
import ResumeBuilder from "./pages/ResumeBuilder";
import NotFound from "./pages/NotFound";

// Clerk Frontend API Key - Provided API key for authentication
const CLERK_FRONTEND_API = "pk_test_bGlrZWQta2l3aS0xMC5jbGVyay5hY2NvdW50cy5kZXYk";

const queryClient = new QueryClient();

// Authentication Component - Handles login and signup UI
const AuthComponent = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back!'}
          </h1>
          <p className="text-gray-600">
            {isSignUp 
              ? 'Sign up to get started with your account' 
              : 'Sign in to your account to continue'
            }
          </p>
        </div>

        {/* Toggle between Sign In and Sign Up */}
        <div className="flex justify-center">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setIsSignUp(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !isSignUp 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isSignUp 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Clerk Authentication Component */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl">
          {isSignUp ? (
            <SignUp 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
                  card: 'shadow-none',
                  headerTitle: 'text-2xl font-bold text-gray-900',
                  headerSubtitle: 'text-gray-600',
                  socialButtonsBlockButton: 'border-gray-300 hover:bg-gray-50',
                  formFieldInput: 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
                  footerActionLink: 'text-indigo-600 hover:text-indigo-700',
                }
              }}
              signInUrl="/"
            />
          ) : (
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
                  card: 'shadow-none',
                  headerTitle: 'text-2xl font-bold text-gray-900',
                  headerSubtitle: 'text-gray-600',
                  socialButtonsBlockButton: 'border-gray-300 hover:bg-gray-50',
                  formFieldInput: 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
                  footerActionLink: 'text-indigo-600 hover:text-indigo-700',
                }
              }}
              signUpUrl="/"
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Secure authentication powered by Clerk</p>
        </div>
      </div>
    </div>
  );
};

// Main Website Content - All existing functionality
const MainWebsite = () => {
  const { user } = useUser();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
              }}
            >
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/results" element={<Results />} />
                <Route path="/opportunities" element={<Opportunities />} />
                <Route path="/resume-builder" element={<ResumeBuilder />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

// Main App Component with Clerk Provider and Conditional Rendering
const App = () => {
  return (
    <ClerkProvider publishableKey={CLERK_FRONTEND_API}>
      {/* Show authentication form when user is signed out */}
      <SignedOut>
        <AuthComponent />
      </SignedOut>
      
      {/* Show main website when user is signed in */}
      <SignedIn>
        <MainWebsite />
      </SignedIn>
    </ClerkProvider>
  );
};

export default App;
