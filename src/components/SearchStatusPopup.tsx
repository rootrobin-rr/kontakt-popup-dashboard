
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { BadgeCheck, BadgeX, Phone, User, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export type StatusType = "success" | "error" | "loading" | "idle";

export interface CompanyStatusProps {
  companyName: string;
  contactStatus: StatusType;
  personStatus: StatusType;
}

export interface SearchStatusPopupProps {
  isOpen: boolean;
  onClose: () => void;
  companies: CompanyStatusProps[];
  totalAmount: number;
  currentAmount: number;
}

const StatusIndicator = ({ status }: { status: StatusType }) => {
  // Fixed size container to prevent layout shifts
  return (
    <div className="h-5 w-5 flex items-center justify-center">
      {status === "loading" && (
        <Loader className="h-3 w-3 animate-spin text-gray-400" />
      )}
      
      {status === "success" && (
        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
          <BadgeCheck className="h-3 w-3 text-green-600" />
        </div>
      )}
      
      {status === "error" && (
        <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
          <BadgeX className="h-3 w-3 text-red-600" />
        </div>
      )}
    </div>
  );
};

const CompanyStatusRow = ({ companyName, contactStatus, personStatus }: CompanyStatusProps) => {
  return (
    <Card className="mb-3">
      <div className="flex items-center justify-between py-3 px-4">
        <div className="font-medium text-lg">{companyName}</div>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-gray-600" />
            <StatusIndicator status={contactStatus} />
          </div>
          
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-gray-600" />
            <StatusIndicator status={personStatus} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export const SearchStatusPopup = ({
  isOpen,
  onClose,
  companies,
  totalAmount,
  currentAmount,
}: SearchStatusPopupProps) => {
  const progress = Math.round((currentAmount / totalAmount) * 100);
  const [visibleCompanies, setVisibleCompanies] = useState<CompanyStatusProps[]>([]);
  
  // Update visible companies whenever the companies prop changes
  useEffect(() => {
    if (companies.length === 0) {
      setVisibleCompanies([]);
      return;
    }
    
    // Always show the 5 most recent companies (or fewer if there are less than 5)
    const startIndex = Math.max(0, companies.length - 5);
    const recentCompanies = companies.slice(startIndex);
    setVisibleCompanies(recentCompanies);
  }, [companies]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogTitle className="sr-only">Search Progress</DialogTitle>
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              searched {currentAmount} out of {totalAmount}
            </h2>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="relative h-[50vh] overflow-hidden">
            {visibleCompanies.map((company, index) => {
              // Calculate position - newer items appear at the bottom
              const isNewest = index === visibleCompanies.length - 1;
              const isOldest = index === 0;
              
              const position = isNewest ? 'bottom' : 
                               isOldest ? 'exiting' : 'visible';
              
              return (
                <div 
                  key={`${company.companyName}-${index}`}
                  className={cn(
                    "absolute w-full transition-all duration-500 ease-in-out px-1",
                    position === 'bottom' && "bottom-0 opacity-100 translate-y-0",
                    position === 'visible' && `bottom-${(visibleCompanies.length - 1 - index) * 25}% opacity-100`,
                    position === 'exiting' && "bottom-100% opacity-0 translate-y-[-20px]"
                  )}
                >
                  <CompanyStatusRow
                    companyName={company.companyName}
                    contactStatus={company.contactStatus}
                    personStatus={company.personStatus}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
