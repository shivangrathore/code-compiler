import axios from "axios";

console.log(process.env.NEXT_PUBLIC_URL);
const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export default axios.create({ baseURL: new URL("/api", BASE_URL).toString() });
