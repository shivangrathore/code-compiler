import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";

export default axios.create({ baseURL: new URL("/api", BASE_URL).toString() });
