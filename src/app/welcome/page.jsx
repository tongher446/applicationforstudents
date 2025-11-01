import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import WelcomeClient from "./welcomeClient";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function WelcomePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    return <WelcomeClient session ={session} />;
}