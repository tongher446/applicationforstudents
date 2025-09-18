import nodemailer from "nodemailer";

export async function GET() {
  try {
    // transporter config
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // test connection
    await transporter.verify();
    console.log("✅ Nodemailer is ready to send emails!");

    // send a test email
    await transporter.sendMail({
      from: `"My App Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // send to yourself
      subject: "Nodemailer Test",
      text: "If you see this, your Gmail setup works!",
    });

    return new Response(
      JSON.stringify({ message: "Test email sent successfully ✅" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Nodemailer error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
