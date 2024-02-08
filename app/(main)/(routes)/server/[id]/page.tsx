import { getServerById } from "@/lib/actions/server.action";
import { currentProfile } from "@/lib/actions/user.action";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
interface PageProps {
  params: {
    id: string;
  };
}
const Page = async ({ params }: PageProps) => {
  const { id } = params;
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();
  const server = await getServerById(id);

  if (!server) return <div>Server not found</div>;
  console.log(server.channels[0]);

  if (server.channels[0].name !== "general") return null;
  return redirect(`/server/${id}/channels/${server.channels[0]._id}`);
};

export default Page;
