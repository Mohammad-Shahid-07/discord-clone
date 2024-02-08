import InitialModal from "@/components/modals/InitialModal";
import { intialProfile } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import React from "react";

const SetupPage = async () => {
  const profile = await intialProfile();

  if (profile?.servers.length > 0) {
    return redirect(`/server/${profile.servers[0]}`);
  }
  return <InitialModal />;
};

export default SetupPage;
