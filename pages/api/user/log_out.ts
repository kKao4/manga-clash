import dbConnect from "@/lib/dbConnect";
import { NormalResponse } from "@/type";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NormalResponse>
) {
  try {
    await dbConnect();
    const method = req.method;
    switch (method) {
      case "GET": {
        // console.log(req.cookies);
        res.setHeader("Set-Cookie", "token=; HttpOnly; Path=/; Max-Age=0;");
        res.status(200).json({ message: "Logged Out" });
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
