"use client";

import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { logMeeting } from "@/app/actions/logMeeting";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function LogMeetingForm({
  contactId,
  onSuccess,
}: {
  contactId: string;
  onSuccess?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [meetingDate, setMeetingDate] = useState<Date | null>(new Date());
  const [duration, setDuration] = useState(30);
  const [outcome, setOutcome] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!meetingDate) {
      toast.error("Please select a meeting date & time.");
      return;
    }

    const endDate = new Date(meetingDate.getTime() + duration * 60000);

    startTransition(() => {
      logMeeting({
        contactId,
        title,
        body,
        meetingDate: meetingDate.toISOString(),
        endDate: endDate.toISOString(),
        outcome,
        newFirstName,
      })
        .then(() => {
          toast.success("Meeting logged!");
          setTitle("");
          setBody("");
          setNewFirstName("");
          if (onSuccess) onSuccess();
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to log meeting");
        });
    });
  };

  useEffect(() => {
    if (!body) {
      setBody(`Met with [Name] at [Store Name].

Topics discussed:
- 
- 

Store traffic:
Next steps:`);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="grid gap-1">
        <Label htmlFor="newFirstName">Contact's First Name</Label>
        <Input
          id="newFirstName"
          value={newFirstName}
          onChange={(e) => setNewFirstName(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-1">
        <Label htmlFor="title">Meeting Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-1">
        <Label htmlFor="body">Meeting Notes</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          required
        />
      </div>

      <div className="grid gap-1">
        <Label>Meeting Date & Time</Label>
        <DatePicker
          selected={meetingDate}
          onChange={setMeetingDate}
          showTimeSelect
          timeIntervals={15}
          timeFormat="HH:mm"
          dateFormat="yyyy-MM-dd h:mm aa"
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </div>

      <div className="grid gap-1">
        <Label htmlFor="duration">Duration</Label>
        <select
          id="duration"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full border rounded px-3 py-2 text-sm"
          required
        >
          {[15, 30, 45, 60].map((min) => (
            <option key={min} value={min} className="text-black">
              {min} minutes
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-1">
        <Label htmlFor="outcome">Outcome</Label>
        <select
          id="outcome"
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
          required
        >
          <option value="" className="text-black">
            Select outcome
          </option>
          <option value="SCHEDULED" className="text-black">
            Scheduled
          </option>
          <option value="COMPLETED" className="text-black">
            Completed
          </option>
          <option value="NO_SHOW" className="text-black">
            No Show
          </option>
          <option value="CANCELED" className="text-black">
            Canceled
          </option>
        </select>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? <Spinner size="4" /> : "Log Meeting"}
      </Button>
    </form>
  );
}
