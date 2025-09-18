import { NextResponse } from "next/server";
import User from "../../../../models/user";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { connectMongoDB } from "../../../../lib/mongodb";


async function sendResetEmail(email, resetLink) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        service: "gmail",
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"My App" <${process.env.EMAIL_USER}>`,
        to: email, 
        subject: "Reset your password",
        html:`
        <p>hello,</p>
        <p> You requested a password reset.</p>
        <p>Click here to reset: <a href="${resetLink}">${resetLink} </a></p>
        <p>This link will expire in 15 minutes.</p>
        `,
    });
}

export async function POST(req) {
    try {
        console.log("reset password api called");

        await connectMongoDB();
        const { email } = await req.json();
        console.log("Email received");

        const user = await User.findOne({ email });
        console.log("user found", user);

        if (!user){
            return NextResponse.json({error: 'User not found'}, { status: 404 })
        }

        // generate token + expiry

        const token = crypto.randomBytes(32).toString("hex");
        const expiry = Date.now() + 1000 * 60 * 15;

        user.resetToken = token;
        user.resetTokenExpiry = expiry;
        await user.save();

        const resetLink = `${process.env.NEXTAUTH_URL}/resetPassword/${token}`;

        // send email
        await sendResetEmail(email, resetLink);

        return NextResponse.json({message: "reset link sent to email"});

    } catch (error) {
        return NextResponse.json({error: error.message }, { status: 500 })
    }
}