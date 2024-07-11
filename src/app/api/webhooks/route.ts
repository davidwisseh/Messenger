"use server";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const res = await req.json();
  console.log(req);
}
