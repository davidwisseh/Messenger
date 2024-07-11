"use server";
import { headers } from "next/headers";

export async function POST(req: Request) {
  console.log("reqested");
  const res = await req.json();
  console.log(req);
  return new Response(JSON.stringify(res));
}
