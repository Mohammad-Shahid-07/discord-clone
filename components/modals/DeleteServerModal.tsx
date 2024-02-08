"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import FileUpload from "@/components/FileUpload";
import { useRouter } from "next/navigation";
import {
  createServer,
  genrateNewInviteCode,
  deleteServer,
} from "@/lib/actions/server.action";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { CheckCheckIcon, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";

const DeleteServerModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "deleteServer";
  const router = useRouter();
  const { server } = data;

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      // Delete server

      const res = await deleteServer(server?._id);
      onClose();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to Delete this{" "}
            <span className="text-rose-500 font-semibold">{server?.name}?</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button variant={"ghost"} disabled={loading} onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant={"primary"}
              disabled={loading}
              onClick={() => handleDelete()}
            >
              Delete Server
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServerModal;
