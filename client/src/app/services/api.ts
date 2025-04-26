import axios from "axios";


console.log('process.env.NEXT_PUBLIC_API', process.env.NEXT_PUBLIC_API)

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API
})