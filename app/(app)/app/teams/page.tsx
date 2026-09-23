"use client";

import { useState, useEffect } from "react";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/Button";
import Reveal from "@/components/motion/Reveal";
import { Users, Plus, Bot, FolderKanban } from "lucide-react";

interface Team {
  id: string;
  name: string;
  description?: string | null;
  project?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  members: Array<{
    agent: {
      id: string;
      name: string;
      title?: string | null;
      avatarColor: string;
      avatarShape: string;
      status: string;
    };
  }>;
  _count?: {
    chatThreads: number;
  };
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/teams");
      const data = await res.json();
      setTeams(data);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-foreground/60">Loading teams...</p>
      </div>
    );
  }

  return (
    <div>
      <Reveal>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Teams</h1>
            <p className="text-foreground/70">
              Organize AI agents into teams for collaborative work
            </p>
          </div>
          <Button onClick={() => alert("Create team feature - coming in next iteration")}>
            <Plus className="w-5 h-5 mr-2" />
            New Team
          </Button>
        </div>
      </Reveal>

      {teams.length === 0 ? (
        <Reveal delay={0.1}>
          <GlassCard className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-foreground/40" />
            <h3 className="text-xl font-bold mb-2">No teams yet</h3>
            <p className="text-foreground/60 mb-6">
              Create teams to organize your AI agents for collaborative projects
            </p>
            <Button onClick={() => alert("Create team feature - coming in next iteration")}>
              <Plus className="w-5 h-5 mr-2" />
              Create Team
            </Button>
          </GlassCard>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, i) => (
            <Reveal key={team.id} delay={0.1} index={i} stagger={80}>
              <GlassCard className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{team.name}</h3>
                {team.description && (
                  <p className="text-foreground/60 text-sm mb-4 line-clamp-2">
                    {team.description}
                  </p>
                )}
                {team.project && (
                  <div className="flex items-center gap-2 mb-3 text-sm text-foreground/70">
                    <FolderKanban className="w-4 h-4" />
                    <span>{team.project.name}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/70">
                    {team.members.length} member{team.members.length !== 1 ? "s" : ""}
                  </p>
                  <div className="flex -space-x-2">
                    {team.members.slice(0, 4).map((member) => (
                      <div
                        key={member.agent.id}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-background"
                        style={{ backgroundColor: member.agent.avatarColor }}
                        title={member.agent.name}
                      >
                        {member.agent.name.charAt(0)}
                      </div>
                    ))}
                    {team.members.length > 4 && (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 text-xs font-bold border-2 border-background">
                        +{team.members.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
