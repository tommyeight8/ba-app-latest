"use client";

import { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash, ChevronDown, ChevronUp } from "lucide-react";
import { EditMeetingModal } from "./EditMeetingModal";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteMeetingModal } from "@/components/DeleteMeetingModal";
import moment from "moment";


export const MeetingLogList = forwardRef(function MeetingLogList(
  { contactId }: { contactId: string },
  ref
) {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMeeting, setEditingMeeting] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [expectedCount, setExpectedCount] = useState<number | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  // ✅ Deletion modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(
    null
  );

  const toggleCollapse = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/meetings/${contactId}`);
      const data = await res.json();
      setMeetings(data);
      setExpectedCount(data.length);
    } catch (err) {
      console.error("❌ Failed to fetch meetings", err);
      setExpectedCount(2);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setDeleteModalOpen(true);
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

  const renderMeetingCard = (meeting: any) => {
    const isOpen = openId === meeting.id;
    const title = meeting.properties.hs_meeting_title || "Untitled Meeting";

    return (
      <div
        key={meeting.id}
        className="border border-gray-200 dark:border-zinc-700 p-4 rounded shadow-sm flex flex-col mb-4"
      >
        <div
          onClick={() => toggleCollapse(meeting.id)}
          className="flex justify-between items-start cursor-pointer hover:opacity-80 transition duration-150"
        >
          {/* <h4 className="text-md font-semibold">{title}</h4> */}
          <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 capitalize">
            {moment(meeting.properties.hs_timestamp).fromNow()} ·{" "}
            <span className="capitalize text-green-400 text-sm">
              ({meeting.properties.hs_meeting_outcome?.toLowerCase() || "unknown"})
            </span>
          </h4>

          
          <button className="text-gray-500 hover:text-black dark:hover:text-white transition cursor-pointer">
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden min-h-0 mt-2"
            >
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
              <div className="mt-4 flex gap-2 justify-end">
                <button
                  onClick={() => handleEdit(meeting)}
                  className="text-sm text-green-400 flex items-center px-4 py-1 border border-green-400
            hover:bg-green-400 hover:text-black cursor-pointer transition rounded-xs"
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(meeting.id)}
                  className="text-sm text-red-400 flex items-center px-4 py-1 border border-red-400
            hover:bg-red-400 hover:text-black cursor-pointer transition rounded-xs"
                >
                  <Trash className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (loading) {
    const skeletons = expectedCount ?? 2;
    return (
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <div className="w-full md:w-1/2">
          {Array.from({ length: Math.ceil(skeletons / 2) }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 dark:border-zinc-700 p-4 rounded shadow-sm mb-4 space-y-3"
            >
              <Skeleton className="h-5 w-3/4 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-1/2 rounded mt-2" />
              <div className="mt-auto flex gap-2 justify-end pt-2">
                <Skeleton className="h-8 w-20 rounded" />
                <Skeleton className="h-8 w-20 rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="w-full md:w-1/2">
          {Array.from({ length: Math.floor(skeletons / 2) }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 dark:border-zinc-700 p-4 rounded shadow-sm mb-4 space-y-3"
            >
              <Skeleton className="h-5 w-3/4 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-1/2 rounded mt-2" />
              <div className="mt-auto flex gap-2 justify-end pt-2">
                <Skeleton className="h-8 w-20 rounded" />
                <Skeleton className="h-8 w-20 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!meetings.length) {
    return (
      <p className="text-sm text-gray-400 mt-4">
        Start by adding a meeting log.
      </p>
    );
  }

  // Split meetings into two columns
  const leftColumn = meetings.filter((_, i) => i % 2 === 0);
  const rightColumn = meetings.filter((_, i) => i % 2 === 1);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-0 md:gap-4 mt-4">
        <div className="flex-1">{leftColumn.map(renderMeetingCard)}</div>
        <div className="flex-1">{rightColumn.map(renderMeetingCard)}</div>
      </div>

      <EditMeetingModal
        open={modalOpen}
        setOpen={setModalOpen}
        meeting={editingMeeting}
        onSave={fetchMeetings}
      />

      {/* Delete Modal */}
      {selectedMeetingId && (
        <DeleteMeetingModal
          open={deleteModalOpen}
          setOpen={setDeleteModalOpen}
          meetingId={selectedMeetingId}
          onDeleted={fetchMeetings}
        />
      )}
    </>
  );
});
