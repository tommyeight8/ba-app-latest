"use client";

import { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { EditMeetingModal } from "./EditMeetingModal";
import { Skeleton } from "@/components/ui/skeleton";

export const MeetingLogList = forwardRef(function MeetingLogList(
  { contactId }: { contactId: string },
  ref
) {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMeeting, setEditingMeeting] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [expectedCount, setExpectedCount] = useState<number | null>(null);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/meetings/${contactId}`);
      const data = await res.json();
      setMeetings(data);
      setExpectedCount(data.length); // accurate skeleton count
    } catch (err) {
      console.error("❌ Failed to fetch meetings", err);
      setExpectedCount(2); // fallback to 2 skeletons
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (meetingId: string) => {
    if (!confirm("Are you sure you want to delete this meeting log?")) return;
    try {
      const res = await fetch(`/api/meetings/delete/${meetingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchMeetings(); // refresh list
    } catch (err) {
      console.error("❌ Error deleting meeting:", err);
    }
  };

  const handleEdit = (meeting: any) => {
    setEditingMeeting(meeting);
    setModalOpen(true);
  };

  useImperativeHandle(ref, () => ({
    refetch: fetchMeetings,
  }));

  useEffect(() => {
    fetchMeetings();
  }, [contactId]);

  if (loading) {
    const skeletons = expectedCount ?? 2; // fallback if null
    return (
      <ul className="mt-4 grid md:grid-cols-2 gap-4 items-stretch">
        {Array.from({ length: skeletons }).map((_, i) => (
          <li
            key={i}
            className="border border-gray-200 dark:border-zinc-700 p-4 rounded shadow-sm flex flex-col space-y-3"
          >
            <Skeleton className="h-5 w-3/4 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-1/2 rounded mt-2" />
            <div className="mt-auto flex gap-2 justify-end pt-2">
              <Skeleton className="h-8 w-20 rounded" />
              <Skeleton className="h-8 w-20 rounded" />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (!meetings.length) {
    return (
      <p className="text-sm text-gray-400 mt-4">
        Start by adding a meeting log.
      </p>
    );
  }

  return (
    <>
      <ul className="mt-4 grid md:grid-cols-2 gap-4 items-stretch">
        {meetings.map((meeting: any) => (
          <li
            key={meeting.id}
            className="border border-gray-200 dark:border-zinc-700 p-4 rounded shadow-sm flex flex-col"
          >
            <h4 className="text-md font-semibold text-black dark:text-white">
              {meeting.properties.hs_meeting_title || "Untitled Meeting"}
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {meeting.properties.hs_meeting_body}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(meeting.properties.hs_timestamp).toLocaleString()} ·{" "}
              <span className="capitalize">
                {meeting.properties.hs_meeting_outcome?.toLowerCase() ||
                  "unknown"}
              </span>
            </p>
            <div className="mt-2">&nbsp;</div>
            <div className="flex gap-2 justify-end mt-auto">
              <button
                onClick={() => handleEdit(meeting)}
                className="text-sm text-green-400 flex items-center px-4 py-1 border border-green-400
              hover:bg-green-400 hover:text-black cursor-pointer transition duration-200 rounded-xs"
              >
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(meeting.id)}
                className="text-sm text-red-400 flex items-center px-4 py-1 border border-red-400
              hover:bg-red-400 hover:text-black cursor-pointer transition duration-200 rounded-xs"
              >
                <Trash className="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <EditMeetingModal
        open={modalOpen}
        setOpen={setModalOpen}
        meeting={editingMeeting}
        onSave={fetchMeetings}
      />
    </>
  );
});
