import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { RustPlus } from "@rustmeta/rustplus-ts";
import { env } from "../../../env/server.mjs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    const rustPlusApi = new RustPlus(
      "45.88.228.66",
      28017,
      env.RUSTAUTH_PLAYERID,
      env.RUSTAUTH_PLAYERTOKEN
    );
    rustPlusApi.on("connected", () => {
      // ready to send requests
      rustPlusApi.sendTeamMessage("Hello from rustplus.js!");
    });
    rustPlusApi.on("connecting", () => {
      console.log("connecting");
    });
    rustPlusApi.on("error", (error: string) => {
      console.log(error);
      console.log("error");
    });

    console.log("Session", JSON.stringify(session, null, 2));
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
};
