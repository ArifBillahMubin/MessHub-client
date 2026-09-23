import axios from "axios"
import { PAGE_LINKS } from "./knowledge"

const baseURL = String(import.meta.env.VITE_api_url || "http://localhost:3000").replace(/\/$/, "")

const chatbotApi = axios.create({
  baseURL,
  timeout: 20000,
})

export const resolveLinks = (keys) =>
  (keys || [])
    .map((key) => PAGE_LINKS[key])
    .filter(Boolean)

export const askAssistant = async (message, history) => {
  const res = await chatbotApi.post("/chatbot", { message, history })
  return {
    answer: res.data?.answer || "The assistant returned an empty reply.",
    links: resolveLinks(res.data?.links),
  }
}
