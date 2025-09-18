import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";

export default async function handler (req, res) {
    await connectMongoDB();

    const { token } = req.query;

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now()},
    })

    if (!user) {
        return res.status(400).json({error: "invalid token or expired reset link" });
    }

    return res.status(200).json({message: "valid token"});
}