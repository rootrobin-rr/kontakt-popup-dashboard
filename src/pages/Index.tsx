
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchStatusPopup, StatusType, CompanyStatusProps } from "@/components/SearchStatusPopup";
import { toast } from "sonner";

// Mock data for demonstration
const mockCompanies = [
  "Acme Inc",
  "Globex Corporation", 
  "Stark Industries",
  "Wayne Enterprises",
  "Umbrella Corporation",
  "Cyberdyne Systems",
  "Soylent Corp",
  "Massive Dynamic"
];

const Index = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<CompanyStatusProps[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  
  const simulateSearch = () => {
    const selectedCompanies = mockCompanies.slice(0, 5); // For demo we'll just use 5 companies
    const total = selectedCompanies.length;
    
    setSearchResults([]);
    setProgress({ current: 0, total });
    setIsSearching(true);
    
    // Initialize all companies as loading
    const initialResults = selectedCompanies.map(name => ({
      companyName: name,
      contactStatus: "loading" as StatusType,
      personStatus: "loading" as StatusType
    }));
    
    setSearchResults(initialResults);
    
    // Simulate search progress with delays
    let current = 0;
    
    selectedCompanies.forEach((company, index) => {
      setTimeout(() => {
        current += 1;
        setProgress({ current, total });
        
        // Randomly determine if we found contact info and person info
        const contactFound = Math.random() > 0.3;
        const personFound = Math.random() > 0.3;
        
        setSearchResults(prev => {
          const updated = [...prev];
          updated[index] = {
            companyName: company,
            contactStatus: contactFound ? "success" : "error",
            personStatus: personFound ? "success" : "error"
          };
          return updated;
        });
        
        // When search is complete
        if (current === total) {
          toast.success("Search completed!");
        }
      }, (index + 1) * 1200); // Stagger the updates
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Company Contact Finder</h1>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Search for contact information and personnel details for selected companies.
          </p>
          
          <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
            {mockCompanies.map((company, index) => (
              <div key={index} className="flex items-center mb-2 last:mb-0">
                <input 
                  type="checkbox" 
                  id={`company-${index}`} 
                  className="mr-2"
                  defaultChecked={index < 5}
                />
                <label htmlFor={`company-${index}`}>{company}</label>
              </div>
            ))}
          </div>
          
          <Button 
            className="w-full" 
            onClick={simulateSearch}
          >
            Search Selected Companies
          </Button>
        </div>
      </div>
      
      <SearchStatusPopup 
        isOpen={isSearching}
        onClose={() => setIsSearching(false)}
        companies={searchResults}
        totalAmount={progress.total}
        currentAmount={progress.current}
      />
    </div>
  );
};

export default Index;
