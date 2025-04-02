
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { BadgeCheck, BadgeX, Phone, User, Loader, Link } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="mt-4 flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-[0_4px_12px_0_#0000000D]">
      <Link className="h-4 w-4 text-neutral-700" />
      <div className="font-medium">{companyName}</div>
      
      <div className="flex items-center ml-auto gap-8">
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
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogTitle>Search Progress</DialogTitle>
        <DialogDescription>
          Searched {currentAmount} out of {totalAmount}
        </DialogDescription>
        
        <div className="flex flex-col gap-6">
          <Progress value={progress} className="h-2" />
          
          <div className="h-[40vh] w-full max-w-full overflow-hidden px-4 [mask-image:linear-gradient(transparent,black_10%,black_90%,transparent)]">
            <div className="animate-infinite-scroll-y flex flex-col [animation-duration:15s]" style={{ "--scroll": "-50%" } as React.CSSProperties}>
              {companies.map((company, index) => (
                <CompanyStatusRow
                  key={`${company.companyName}-${index}`}
                  companyName={company.companyName}
                  contactStatus={company.contactStatus}
                  personStatus={company.personStatus}
                />
              ))}
              
              {/* Duplicate items to create seamless loop */}
              {companies.length > 0 && companies.map((company, index) => (
                <CompanyStatusRow
                  key={`${company.companyName}-duplicate-${index}`}
                  companyName={company.companyName}
                  contactStatus={company.contactStatus}
                  personStatus={company.personStatus}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
