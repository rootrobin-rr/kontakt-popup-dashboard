
import React, { useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { BadgeCheck, BadgeX, Phone, User, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="h-6 w-6 flex items-center justify-center">
      {status === "loading" && (
        <Loader className="h-4 w-4 animate-spin text-gray-400" />
      )}
      
      {status === "success" && (
        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
          <BadgeCheck className="h-4 w-4 text-green-600" />
        </div>
      )}
      
      {status === "error" && (
        <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
          <BadgeX className="h-4 w-4 text-red-600" />
        </div>
      )}
    </div>
  );
};

const CompanyStatusRow = ({ companyName, contactStatus, personStatus }: CompanyStatusProps) => {
  return (
    <Card className="mb-3">
      <div className="flex items-center justify-between py-4 px-4">
        <div className="font-medium text-lg">{companyName}</div>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-600" />
            <StatusIndicator status={contactStatus} />
          </div>
          
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-600" />
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to keep the current company in view
  useEffect(() => {
    if (scrollAreaRef.current && companies.length > 0) {
      const scrollArea = scrollAreaRef.current;
      
      // Add a small delay to ensure DOM has updated
      setTimeout(() => {
        // Calculate the height needed to show the last item at the bottom
        const lastItemHeight = 80; // Approximate height of one company row
        const visibleHeight = scrollArea.clientHeight;
        const contentHeight = scrollArea.scrollHeight;
        
        // If content is taller than visible area, scroll to position the last item at bottom
        if (contentHeight > visibleHeight) {
          // Scroll so the newest item (at the bottom) is fully visible
          scrollArea.scrollTop = contentHeight - visibleHeight;
        }
      }, 50);
    }
  }, [companies, currentAmount]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              searched {currentAmount} out of {totalAmount}
            </h2>
            <Progress value={progress} className="h-2" />
          </div>
          
          <ScrollArea className="h-[50vh]" ref={scrollAreaRef}>
            <div className="pr-4">
              {companies.map((company, index) => (
                <CompanyStatusRow
                  key={`${company.companyName}-${index}`}
                  companyName={company.companyName}
                  contactStatus={company.contactStatus}
                  personStatus={company.personStatus}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
