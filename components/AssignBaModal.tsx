"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { assignBaIdToHubSpotContacts } from "@/app/actions/assignBaIdToHubSpotContacts";
import { getBaUsers } from "@/app/actions/getBaUsers";
import { getAvailableBaIds } from "@/app/actions/getAvailableBaIds";

import Spinner from "@/components/Spinner";
import { ensureBaIdPropertyExists } from "@/app/actions/checkOrCreateBaIdProperty";
import { assignBaIdToContacts } from "@/app/actions/assignBaIdToContacts";

type AssignModalProps = {
  open: boolean;
  onClose: () => void;
  selectedContacts: string[];
};

type User = {
  id: string;
  name: string;
  role: string;
  ba_id: string;
};

export default function AssignBaModal({
  open,
  onClose,
  selectedContacts,
}: AssignModalProps) {
  const [selectedUser, setSelectedUser] = useState<string | undefined>();
  const [selectedBaId, setSelectedBaId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [baIds, setBaIds] = useState<string[]>([]);

  console.log(selectedBaId);

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await getBaUsers();
      if (userRes.success && userRes.data) {
        setUsers(userRes.data);
      }

      //   const baRes = await getAvailableBaIds();
      //   if (baRes.success && baRes.data) {
      //     setBaIds(baRes.data.map((b) => b));
      //   }
    };

    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedUser || !selectedBaId || selectedContacts.length === 0) return;
    setLoading(true);

    try {
      await ensureBaIdPropertyExists(); // Make sure ba_id field exists
      await assignBaIdToContacts(selectedContacts, selectedBaId); // Then assign
      alert("BA ID assigned to selected contacts!");
    } catch (error) {
      console.error("Assignment error:", error);
      alert("Failed to assign BA ID.");
    }

    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign BA ID to Contacts</DialogTitle>
        </DialogHeader>

        <div className="relative flex items-center gap-2">
          <Select
            value={selectedUser}
            onValueChange={(val) => {
              setSelectedUser(val);
              const user = users.find((u) => u.id === val);
              if (user?.ba_id) {
                setSelectedBaId(user.ba_id);

                console.log(selectedBaId);
              }
            }}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select BA" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem
                  key={user.id}
                  value={user.id}
                  className="cursor-pointer"
                >
                  <span className="capitalize">{user.name}</span> — (
                  {user.ba_id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* {selectedUser && (
            <button
              type="button"
              onClick={() => {
                setSelectedUser("");
                setSelectedBaId("");
              }}
              className="absolute right-2 text-sm text-gray-500 hover:text-red-500"
            >
              ✕
            </button>
          )} */}
        </div>

        <DialogFooter>
          {selectedUser && (
            <Button
              onClick={() => {
                setSelectedUser("");
                setSelectedBaId("");
              }}
              className="bg-[#1c1c1c] text-white hover:bg-green-300 transition duration-200 ease"
            >
              Clear
            </Button>
          )}
          <Button
            onClick={handleAssign}
            disabled={loading || !selectedUser}
            className="bg-green-400 text-white hover:bg-green-300 transition duration-200 ease"
          >
            {loading ? (
              <Spinner />
            ) : (
              `Assign to ${selectedContacts.length} contact(s)`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
