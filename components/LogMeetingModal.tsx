"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogMeetingForm } from "./LogMeetingForm";
import { useContactContext } from "@/context/ContactContext";

export function LogMeetingModal() {
  const { logOpen, setLogOpen, contactId, logContactData } =
    useContactContext();

  if (!contactId || !logContactData) return null;

  return (
    <Dialog open={logOpen} onOpenChange={setLogOpen}>
      <DialogContent className="sm:max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <DialogHeader className="mb-2">
          <DialogTitle>
            Log Meeting{" "}
            {logContactData?.properties?.firstname
              ? `with ${logContactData.properties.firstname}`
              : ""}
          </DialogTitle>
        </DialogHeader>

        <LogMeetingForm
          contactId={contactId}
          contactFirstName={logContactData.properties?.firstname}
          contactJobTitle={logContactData.properties?.jobtitle}
          onSuccess={() => {
            setLogOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
