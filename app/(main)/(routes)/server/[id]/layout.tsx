import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import ServerSideBar from "@/components/server/ServerSideBar";
import { getServer } from "@/lib/actions/server.action";
import { currentProfile } from "@/lib/actions/user.action";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) => {
  const profile = await currentProfile();
  if (!profile) {
    redirect("/sign-in");
  }
  const { id } = params;

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSideBar serverId={id} userId={profile._id} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};
export default ServerIdLayout;
