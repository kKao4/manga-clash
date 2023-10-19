import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import Manga from "@/models/manga";
import { auth } from "@/lib/auth";
import { toLowerCaseNonAccentVietnamese } from "@/lib/vietnamese";
import { MangaResponse } from "@/type";
import { checkFile } from "@/lib/checkExtension";
import e from "express";

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "1mb",
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MangaResponse>
) {
  try {
    await dbConnect();
    const { method } = req;
    switch (method) {
      case "POST": {
        const form = formidable({ maxFileSize: 10 * 1024 * 1024 });
        const [fields, files] = await form.parse(req);
        const token = req.cookies.token;
        // console.log(
        //   "🚀 ~ file: add_manga.ts:26 ~ req.cookies.token:",
        //   req.cookies.token
        // );
        console.log("🚀 ~ file: add_manga.ts:23 ~ files:", files);
        console.log("🚀 ~ file: add_manga.ts:23 ~ fields:", fields);
        if (token) {
          const { user } = await auth(token);
          // console.log("🚀 ~ file: add_manga.ts:35 ~ user:", user);
          if (user && user.role === "admin") {
            if (
              fields.name &&
              fields.otherName &&
              fields.author &&
              fields.description &&
              files.image
            ) {
              // check file extension
              if (checkFile(files.image[0].originalFilename)) {
                const newHref = toLowerCaseNonAccentVietnamese(fields.name[0])
                  .trim()
                  .replace(/[^a-zA-Z0-9 ]/g, "")
                  .replace(/\s+/g, "-");
                const newPath = newHref + "_" + files.image[0].originalFilename;
                const oldPath = files.image[0].filepath;
                await fs.promises.rename(oldPath, "./public/" + newPath);
                const newManga = new Manga({
                  name: fields.name[0],
                  otherName: fields.otherName[0],
                  href: newHref,
                  author: fields.author[0],
                  image: files.image ? newPath : "",
                  description: fields.description[0],
                  tags: fields.tags,
                });
                await newManga.save();
                res
                  .status(200)
                  .json({ message: "Added Manga", data: newManga });
              } else {
                res
                  .status(400)
                  .json({ error: "File Extension Is Not Matched" });
              }
            } else {
              res.status(400).json({ error: "Invalid Form" });
            }
          } else {
            res.status(403).json({ error: "Not Allowed" });
          }
        } else {
          res.status(401).json({ error: "Invalid Token" });
        }
      }
    }
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
}
