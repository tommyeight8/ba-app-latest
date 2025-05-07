"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogMeetingForm } from "./LogMeetingForm";
import { RefObject } from "react";
import { useContactContext } from "@/context/ContactContext";
import type { MeetingLogListRef } from "@/types/meeting";

export function LogMeetingModal({
  logListRef,
  refetchContact,
}: {
  logListRef?: RefObject<MeetingLogListRef | null>;
  refetchContact?: () => void;
}) {
  const { logOpen, setLogOpen, contactId, logContactData } =
    useContactContext();

  if (!contactId || !logContactData) return null;

  return (
    <Dialog open={logOpen} onOpenChange={setLogOpen}>
      <DialogContent className="sm:max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <DialogHeader className="mb-2">
          <DialogTitle>
            Log Meeting
            {/* Log Meeting{" "}
            {logContactData?.properties?.firstname
              ? `with ${logContactData.properties.firstname}`
              : ""} */}
          </DialogTitle>
        </DialogHeader>

        <LogMeetingForm
          contactId={contactId}
          contactFirstName={logContactData.properties?.firstname}
          contactJobTitle={logContactData.properties?.jobtitle}
          // onSuccess={() => {
          //   setLogOpen(false);
          // }}
          onSuccess={(newMeeting) => {
            // ✅ Optimistically add the meeting
            // logListRef.current?.addOptimisticMeeting?.(newMeeting);
            if (logListRef?.current) {
              logListRef.current.addOptimisticMeeting?.(newMeeting);
            }
            refetchContact?.();
            setLogOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
