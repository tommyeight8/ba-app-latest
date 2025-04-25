"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export function EditMeetingModal({
  open,
  setOpen,
  meeting,
  onSave,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  meeting: any;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    title: "",
    body: "",
    outcome: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (meeting) {
      setForm({
        title: meeting.properties.hs_meeting_title || "",
        body: meeting.properties.hs_meeting_body || "",
        outcome: meeting.properties.hs_meeting_outcome || "",
      });
    }
  }, [meeting]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/meetings/edit/${meeting.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success("Meeting updated");
      setOpen(false);
      onSave(); // refetch meetings
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Meeting</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-1">
            <label className="text-sm font-medium text-muted-foreground">
              Title
            </label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Meeting title"
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium text-muted-foreground">
              Body
            </label>
            <Textarea
              name="body"
              value={form.body}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, body: e.target.value }))
              }
              placeholder="Meeting notes"
              className="min-h-[120px]"
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium text-muted-foreground">
              Outcome
            </label>
            <Input
              name="outcome"
              value={form.outcome}
              onChange={handleChange}
              placeholder="Outcome"
            />
          </div>

          <Button onClick={handleUpdate} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update Meeting
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
