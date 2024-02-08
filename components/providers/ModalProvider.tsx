"use client";

import { useEffect, useState } from "react";

import InviteModal from "../modals/InviteModal";

import MemberModal from "../modals/MembersModal";
import CreateChannelModal from "../modals/CreateChannelModal";
import LeaveServerModal from "../modals/LeaveServerModal";
import DeleteServerModal from "../modals/DeleteServerModal";
import DeleteChannelModal from "../modals/DelteChannelModal";
import EditChannelModal from "../modals/EditChannelModal";
import MessageFileModal from "../modals/MessageFileModal";
import DeleteMessageModal from "../modals/DeleteMessageModal";
import CreateServerModal from "../modals/CreateServerModal";
import EditServerModal from "../modals/EditServerModal";

const ModalProvider = () => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(true);
  }, []);
  if (!isOpen) return null;
  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MemberModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  );
};

export default ModalProvider;
