/** @format */

import { redirect } from "next/navigation";

// redirect to dashboard
export default function HomePage() {
  redirect("/admin/dashboard");
}
