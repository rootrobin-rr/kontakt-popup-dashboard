
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Check, X, Phone, User, Loader } from "lucide-react";
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
  if (status === "loading") {
    return <Loader className="h-5 w-5 animate-spin text-gray-400" />;
  }
  
  if (status === "success") {
    return (
      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
        <Check className="h-5 w-5 text-green-600" />
      </div>
    );
  }
  
  if (status === "error") {
    return (
      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
        <X className="h-5 w-5 text-red-600" />
      </div>
    );
  }
  
  return null;
};

const CompanyStatusRow = ({ companyName, contactStatus, personStatus }: CompanyStatusProps) => {
  return (
    <Card className="mb-3">
      <div className="flex items-center justify-between py-4 px-4">
        <div className="font-medium text-lg">{companyName}</div>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-gray-600" />
            <StatusIndicator status={contactStatus} />
          </div>
          
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-600" />
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
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              searched {currentAmount} out of {totalAmount}
            </h2>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div>
            {companies.map((company, index) => (
              <CompanyStatusRow
                key={`${company.companyName}-${index}`}
                companyName={company.companyName}
                contactStatus={company.contactStatus}
                personStatus={company.personStatus}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
