"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLogMeetingModal } from "@/context/LogMeetingModalContext";
import { LogMeetingForm } from "./LogMeetingForm";

export function LogMeetingModal() {
  const {
    open,
    setOpen,
    contactId,
    contactName,
    contactJobTitle,
    onSuccess,
  } = useLogMeetingModal();

  if (!contactId) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <DialogHeader className="mb-2">
          <DialogTitle>Log Meeting {contactName ? `with ${contactName}` : ""}</DialogTitle>
        </DialogHeader>

        <LogMeetingForm
          contactId={contactId}
          contactFirstName={contactName}
          contactJobTitle={contactJobTitle}
          onSuccess={async () => {
            await onSuccess?.();
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
