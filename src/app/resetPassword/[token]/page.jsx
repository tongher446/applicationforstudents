import NewPasswordForm from "./newPasswordForm";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage({ params }) {
  const { token } = await params;

  // if token is missing (user typed URL directly), send them to welcome
  if (!token) {
    redirect("/"); // change to "/" if your welcome is at root
  }

  return <NewPasswordForm token={token} />;
}