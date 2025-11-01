import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import HomePageClient from "./homePageClient";

export default async function homePage() {
    const session = await getServerSession(authOptions);

    if (session){
        redirect('/welcome');
    }

    return <HomePageClient />;
}