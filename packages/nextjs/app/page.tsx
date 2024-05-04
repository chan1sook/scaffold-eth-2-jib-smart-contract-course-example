"use client";

import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address, EtherInput, InputBase } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const { data: greetingText } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "greeting",
  });
  const { data: isPremium } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "premium",
  });

  const [newGreetingText, setNewGreetingText] = useState("New Text");
  const [paymentValue, setPaymantValue] = useState("0");

  const { isPending, isMining, writeContractAsync } = useScaffoldWriteContract("YourContract");

  async function updateGreetingText() {
    if (isPending || isMining) {
      return;
    }

    try {
      await writeContractAsync({
        functionName: "setGreeting",
        args: [newGreetingText],
        value: BigInt(paymentValue),
      });
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <>
      <div className="px-4 py-4 flex flex-col gap-y-4 items-center">
        <div
          className={`transition duration-200 border-2 rounded-lg text-2xl px-8 py-6 w-full max-w-screen-sm ${
            isPremium ? "bg-warning border-warning" : "bg-info border-info"
          }`}
        >
          {greetingText}
        </div>
        <div className="flex flex-col bg-base-200 gap-y-2 w-full max-w-screen-md items-center">
          <div className="w-full">
            <InputBase value={newGreetingText} onChange={setNewGreetingText}></InputBase>
          </div>
          <div className="w-full">
            <EtherInput value={paymentValue} onChange={setPaymantValue}></EtherInput>
          </div>
          <button className="btn" disabled={isPending || isMining} onClick={updateGreetingText}>
            Send Transaction
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
