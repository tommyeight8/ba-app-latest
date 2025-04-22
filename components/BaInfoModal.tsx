"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserIcon, MailIcon, BriefcaseIcon, MapPinIcon } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    state: string | null;
  } | null;
};

export default function UserInfoModal({ isOpen, onClose, user }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center bg-[#111] text-white p-2">
            Brand Ambassador Info
          </DialogTitle>
        </DialogHeader>

        {user ? (
          <div className="bg-white rounded-lg space-y-4 text-sm">
            <div className="p-4 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">Name</p>
                  <p className="text-muted-foreground capitalize">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MailIcon className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground capitalize">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <BriefcaseIcon className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">Role</p>
                  <p className="text-muted-foreground capitalize">
                    {user.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPinIcon className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground capitalize">
                    {user.state ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No user linked to this BA ID.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
