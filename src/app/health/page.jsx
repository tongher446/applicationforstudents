import { connectMongoDB } from "../../../lib/mongodb";


export default async function HealthPage() {
  try {
    await connectMongoDB();
    return <h1>✅ MongoDB is connected!</h1>;
  } catch (err) {
    return <h1>❌ DB Error: {err.message}</h1>;
  }
}
