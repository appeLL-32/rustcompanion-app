import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "../components/common/Button/Button";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Rust Companion App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-6 p-4">
        <h1 className="mb-5 text-5xl font-extrabold leading-normal text-gray-700 dark:text-gray-500 md:text-[5rem]">
          <span className="text-red-400">Rust</span> Companion App
        </h1>
        <Button
          type="button"
          onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
        >
          Sign In with Discord
        </Button>
      </main>
    </>
  );
};

export default Home;

export async function getServerSideProps(context: any) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  } else {
    return { props: {} };
  }
}