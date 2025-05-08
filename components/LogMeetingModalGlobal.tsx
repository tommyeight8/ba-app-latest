import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogMeetingForm } from "./LogMeetingForm";
import type { HubSpotContact } from "@/types/hubspot";
import type { MeetingLogListRef } from "@/types/meeting";
import { RefObject } from "react";

interface LogMeetingModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  contactId: string;
  contactData: HubSpotContact;
  logListRef?: RefObject<MeetingLogListRef | null>;
  refetchContact?: () => void;
}

export function LogMeetingModalGlobal({
  open,
  setOpen,
  contactId,
  contactData,
  logListRef,
  refetchContact,
}: LogMeetingModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <DialogHeader className="mb-2">
          <DialogTitle>Log Meeting</DialogTitle>
        </DialogHeader>

        <LogMeetingForm
          contactId={contactId}
          contactFirstName={contactData.properties?.firstname}
          contactJobTitle={contactData.properties?.jobtitle}
          contactStatus={contactData.properties?.l2_lead_status}
          useGlobalList={true}
          onSuccess={(newMeeting) => {
            logListRef?.current?.addOptimisticMeeting?.(newMeeting);
            refetchContact?.();
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
