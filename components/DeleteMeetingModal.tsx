"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Spinner from "./Spinner";

type DeleteMeetingModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  meetingId: string;
  onDeleted?: () => void; // Callback after successful delete
};

export const DeleteMeetingModal = ({
  open,
  setOpen,
  meetingId,
  onDeleted,
}: DeleteMeetingModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/meetings/delete/${meetingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Meeting deleted successfully");
      onDeleted?.(); // ✅ refetch meetings or whatever
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Meeting</DialogTitle>
        </DialogHeader>

        <div className="py-4 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Are you sure you want to delete this meeting? This action cannot be
            undone.
          </p>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="rounded"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={loading}
              className="rounded bg-red-400 hover:opacity-90 hover:bg-red-400"
            >
              {loading ? (
                <div className="flex items-center gap-1">
                  <Spinner size="4" />
                  Deleting
                </div>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
