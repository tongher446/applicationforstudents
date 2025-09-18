import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../../../models/user";
import { connectMongoDB } from "../../../../../lib/mongodb";

export async function POST(req, {params}){

    try{
        await connectMongoDB();
        const {token} = params;
        const {password} = await req.json();

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: {$gt: Date.now()},
        });

        if (!user){
            return NextResponse.json({error: 'invalid or expiry token'}, {status: 400}) 
        }

        const hashPassword = await bcrypt.hash(password, 10);
        user.password = hashPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({message: 'password reset successfully'}, {status: 200})
    }
    catch(error){
        return NextResponse.json({error: error.message}, {status: 500});

    }
}