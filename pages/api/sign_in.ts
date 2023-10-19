import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import bcrypt from "bcrypt";
import User from "@/models/user";
import * as jose from "jose";
import { NormalResponse } from "@/type";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NormalResponse>
) {
  try {
    await dbConnect();
    const { method } = req;
    switch (method) {
      case "POST": {
        const formData = formidable({});
        const [fields, files] = await formData.parse(req);
        console.log("🚀 ~ file: sign_in.ts:26 ~ fields:", fields)
        if (fields.email && fields.password) {
          let email = fields.email[0];
          let password = fields.password[0];
          const user = await User.findOne({ email: email });
          if (user) {
            const result = await bcrypt.compare(password, user.password);
            if (result) {
              const secret = new TextEncoder().encode(
                process.env.SECRET_TOKEN_KEY
              );
              const token = await new jose.SignJWT({
                _id: user._id,
              })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("24h")
                .sign(secret);
              if (fields.remember && fields.remember[0] === "on") {
                res.setHeader(
                  "Set-Cookie",
                  `token=${token}; Path=/; HttpOnly; Max-Age=86400`
                );
              } else {
                res.setHeader("Set-Cookie", `token=${token}; Path=/; HttpOnly`);
              }
              res.status(200).json({ message: "Logged In" });
            } else {
              res.status(401).json({ error: "Wrong Information" });
            }
          } else {
            res.status(401).json({ error: "Wrong Information" });
          }
        } else {
          res.status(400).json({ error: "Invalid Form" });
        }
      }
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
}
