import { RustPlus } from "@rustmeta/rustplus-ts";
import { NextApiRequest } from "next";
import { env } from "../../../env/server.mjs";
import { NextApiResponseServerIO } from "../../../types/next.js";

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  // const session = await unstable_getServerSession(req, res, authOptions);
  // if (session) {
  if (req.method === "POST") {
    const request = req.body;
    if (request) {
      const rustPlusApi = new RustPlus(
        "45.88.228.66",
        28017,
        env.RUSTAUTH_PLAYER_ID,
        parseInt(env.RUSTAUTH_PLAYER_TOKEN)
      );
      rustPlusApi.on("connected", () => {
        rustPlusApi.sendTeamMessage("Hello from rustplus.js!");
        rustPlusApi
          .sendRequestAsync(
            {
              getInfo: {},
            },
            5000
          )
          .then((response) => {
            console.log("message sent");
            res?.socket?.server?.io?.emit("message", "message received");
          });
        console.log("connected");
        res?.socket?.server?.io?.emit(
          "connected",
          "Connection to Rust Server established"
        );
      });
      rustPlusApi.on("connecting", () => {
        console.log("connecting");
        res?.socket?.server?.io?.emit(
          "connecting",
          "Connecting to Rust Server"
        );
      });
      rustPlusApi.on("error", (error) => {
        console.log(error);
        console.log("error");
        res?.socket?.server?.io?.emit(
          "error",
          "An error ocurred while connecting to the Rust Server"
        );
      });
      rustPlusApi.on("message", (message) => {
        // check if message is an entity changed broadcast
        if (message.broadcast && message.broadcast.entityChanged) {
          /**
           * since we called getEntityInfo, this message handler will be triggered
           * when the entity state has changed. for example, when a smart alarm is triggered,
           * a smart switch is toggled or a storage monitor has updated.
           */

          var entityChanged = message.broadcast.entityChanged;

          // log the broadcast
          console.log(message.broadcast);

          var entityId = entityChanged.entityId;
          var value = entityChanged.payload.value;

          // log the entity status
          console.log(
            "entity " + entityId + " is now " + (value ? "active" : "inactive")
          );
          res.socket.server.io.emit(
            "message",
            "entity " + entityId + " is now " + (value ? "active" : "inactive")
          );
        }
      });
      // rustPlusApi.on("message", (message) => {
      //   res?.socket?.server?.io?.emit("message", message);
      // });
      await rustPlusApi.connect();
    }
  }
  console.log("end");
  res.end();
  // } else {
  //   // Not Signed in
  //   res.status(401);
  // }
  // res.end();
};
