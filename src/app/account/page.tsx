import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import AccountClient from "./account-client";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user data from database
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <AccountClient user={user} userData={userData} />
    </div>
  );
}
