import { useAtom } from "jotai";
import { type NextPage } from "next";
import { useState } from "react";
import { Button } from "../../common/Button/Button";
import { tabAtom, TabName, TopNavigation } from "./DashboardTabs";
import { io } from "socket.io-client";

export const DashboardScreen: NextPage = () => {
  const [selectedTab] = useAtom(tabAtom);
  const [connected, setConnected] = useState<boolean>(false);

  const handleConnectButton = () => {
    // rustPlusApi.connect();
    // fetch("/api/rust/connection");
    const socket = io({
      path: "/api/rust/socketio",
    });
    console.log("socket initialized client");
    socket.on("connect", async () => {
      console.log("SOCKET CONNECTED!", socket.id);
      setConnected(true);
      const request = {
        message: "hola",
        hola: "hola",
      };
      await fetch("/api/rust/connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
    });
    socket.on("connected", (message) => {
      console.log(message);
    });
    socket.on("connecting", (message) => {
      console.log(message);
    });
    socket.on("error", (message) => {
      console.log(message);
    });
    socket.on("message", (message) => {
      console.log("message received");
      console.log(message);
    });
    socket.on("connect_error", (error) => {
      console.log("connect error, ", error);
    });
    socket.onAny((event) => {
      console.log(`got ${event}`);
    });
    // socket disconnet onUnmount if exists
  };
  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl flex-row gap-4 py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <main>
        <TopNavigation />
        {selectedTab === TabName.Connect && (
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="h-96 rounded-lg">
                <Button
                  disabled={connected}
                  type="button"
                  onClick={handleConnectButton}
                >
                  Connect to Rust+ API
                </Button>
              </div>
            </div>
          </div>
        )}
        {selectedTab === TabName.Events && (
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="h-96 rounded-lg">
                {connected
                  ? "Loading events..."
                  : "You need to be connected to Rust+ API in order to see the server events!"}
              </div>
            </div>
          </div>
        )}
        {selectedTab === TabName.Map && (
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="h-96 rounded-lg">
                {connected
                  ? "Loading map..."
                  : "You need to be connected to Rust+ API in order to see the server events!"}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};
