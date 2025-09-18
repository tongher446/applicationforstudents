import { redirect } from "next/navigation";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";
import NewPasswordForm from "./newPasswordForm";


export default async function resetPasswordPage({params}) {
  const {token} = await params;

  await connectMongoDB();

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: {$gt: Date.now()},
  });

  if (!user) {
    redirect("/?error=InvalidOrExpiredLink");
  }

  return <NewPasswordForm token= {token} />;
}
