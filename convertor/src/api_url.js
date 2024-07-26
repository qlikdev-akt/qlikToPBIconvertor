export default function apiURL() {
  const devApiURL = "http://127.0.0.1:8000";
  if (process.env.NODE_ENV === "development") return devApiURL;
}
