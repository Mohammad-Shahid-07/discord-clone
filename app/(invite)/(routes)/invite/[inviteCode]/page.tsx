import { joinServerByInviteCode } from "@/lib/actions/server.action";
import { currentProfile } from "@/lib/actions/user.action";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface PageProps {
  params: { inviteCode: string };
}
const Page = async ({ params }: PageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/sign-in");
  }
  if (!params.inviteCode) {
    return redirect("/");
  }
  const inviteCode = params.inviteCode;
  const joinServer = await joinServerByInviteCode(inviteCode);
  console.log(joinServer);
  
  if (joinServer) {
    return redirect(`/server/${joinServer}`);
  }
  return <div>Page</div>;
};

export default Page;
