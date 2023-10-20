import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import { NormalResponse } from "@/type";
import Manga from "@/models/manga";
import { auth } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NormalResponse>
) {
  try {
    await dbConnect();
    const method = req.method;
    switch (method) {
      case "POST": {
        const token = req.cookies.token;
        if (token) {
          const { user } = await auth(token);
          if (user && user.role === "admin") {
            const { href } = req.query;
            const { description } = req.body;
            const manga = await Manga.findOne({ href: href });
            if (manga) {
              manga.description = description;
              await manga.save();
              res.status(200).json({ message: "Updated Description" });
            } else {
              res.status(400).json({ error: "Invalid Manga" });
            }
          } else {
            res.status(401).json({ error: "Not Allowed" });
          }
        } else {
          res.status(401).json({ error: "Invalid Token" });
        }
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
