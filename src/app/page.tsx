"use client";

import { useCouncilStream } from "@/lib/useCouncilStream";
import AgentCard from "@/components/AgentCard";
import InvokeButton from "@/components/InvokeButton";
import IdeaSpotlight from "@/components/IdeaSpotlight";

export default function Home() {
  const { councilState, finalIdea, agents, invoke } = useCouncilStream();

  return (
    <>
      {/* Action Center */}
      <section className="mb-4">
        <InvokeButton state={councilState} onClick={() => invoke()} />
      </section>

      {/* Agents Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AgentCard 
          role="prospector" 
          name="The Prospector" 
          status={agents.prospector.status} 
          content={agents.prospector.text} 
        />
        <AgentCard 
          role="architect" 
          name="The Architect" 
          status={agents.architect.status} 
          content={agents.architect.text} 
        />
        <AgentCard 
          role="curator" 
          name="The Curator" 
          status={agents.curator.status} 
          content={agents.curator.text} 
        />
      </section>

      {/* Result Section */}
      {councilState === "done" && finalIdea && (
        <IdeaSpotlight content={finalIdea} />
      )}
    </>
  );
}
