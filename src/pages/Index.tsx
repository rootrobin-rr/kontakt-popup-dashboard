
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SearchStatusPopup, StatusType, CompanyStatusProps } from "@/components/SearchStatusPopup";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for demonstration
const mockCompanies = [
  "Acme Inc",
  "Globex Corporation", 
  "Stark Industries",
  "Wayne Enterprises",
  "Umbrella Corporation",
  "Cyberdyne Systems",
  "Soylent Corp",
  "Massive Dynamic",
  "Aperture Science",
  "Oscorp Industries",
  "Weyland-Yutani Corp",
  "Tyrell Corporation",
  "InGen",
  "Rekall Inc",
  "Omni Consumer Products",
  "Buy n Large",
  "Blue Sun Corporation",
  "Monarch Sciences",
  "Abstergo Industries",
  "Hanso Foundation"
];

const Index = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<CompanyStatusProps[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(mockCompanies);
  
  const simulateSearch = () => {
    // Filter selected companies
    const companiesToSearch = mockCompanies.filter((_, index) => {
      const checkbox = document.getElementById(`company-${index}`) as HTMLInputElement;
      return checkbox?.checked;
    });
    
    const total = companiesToSearch.length;
    
    if (total === 0) {
      toast.error("Please select at least one company to search");
      return;
    }
    
    setSearchResults([]);
    setProgress({ current: 0, total });
    setIsSearching(true);
    
    // Process one company at a time
    let current = 0;
    
    const processCompany = (index: number) => {
      if (index >= companiesToSearch.length) {
        toast.success("Search completed!");
        return;
      }
      
      const company = companiesToSearch[index];
      
      // Add the company with loading status
      setSearchResults(prev => [
        ...prev,
        {
          companyName: company,
          contactStatus: "loading",
          personStatus: "loading"
        }
      ]);
      
      // First simulate finding contact info after a delay
      setTimeout(() => {
        const contactFound = Math.random() > 0.3;
        
        setSearchResults(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = {
            ...updated[lastIndex],
            contactStatus: contactFound ? "success" : "error",
          };
          return updated;
        });
        
        // Then simulate finding person info after another delay
        setTimeout(() => {
          const personFound = Math.random() > 0.3;
          
          setSearchResults(prev => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            updated[lastIndex] = {
              ...updated[lastIndex],
              personStatus: personFound ? "success" : "error",
            };
            return updated;
          });
          
          // Update progress and process next company after a delay
          current += 1;
          setProgress({ current, total });
          
          setTimeout(() => {
            processCompany(index + 1);
          }, 1000);
        }, 800); // Delay for finding person info
      }, 1200); // Delay for finding contact info
    };
    
    // Start processing with the first company
    processCompany(0);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Company Contact Finder</h1>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Search for contact information and personnel details for selected companies.
          </p>
          
          <ScrollArea className="h-60 border rounded-md p-4">
            {mockCompanies.map((company, index) => (
              <div key={index} className="flex items-center mb-2 last:mb-0">
                <input 
                  type="checkbox" 
                  id={`company-${index}`} 
                  className="mr-2"
                  defaultChecked
                />
                <label htmlFor={`company-${index}`}>{company}</label>
              </div>
            ))}
          </ScrollArea>
          
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
