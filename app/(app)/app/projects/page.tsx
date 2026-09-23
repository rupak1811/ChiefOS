"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/Button";
import Reveal from "@/components/motion/Reveal";
import { FolderKanban, Plus, Trash2, Users, Bot, MessageSquare, ListTodo } from "lucide-react";

interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color: string;
  createdAt: string;
  _count?: {
    agents: number;
    teams: number;
    chatThreads: number;
    workItems: number;
  };
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    details: "",
    color: "#2DD4BF",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const project = await res.json();
        setProjects([project, ...projects]);
        setShowCreateModal(false);
        setFormData({ name: "", slug: "", description: "", details: "", color: "#2DD4BF" });
        
        // Open in new tab
        const projectUrl = `/app/p/${project.slug}`;
        window.open(projectUrl, "_blank");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create project");
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-foreground/60">Loading projects...</p>
      </div>
    );
  }

  return (
    <div>
      <Reveal>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Projects</h1>
            <p className="text-foreground/70">
              Organize your work into projects with teams and AI agents
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </Button>
        </div>
      </Reveal>

      {projects.length === 0 ? (
        <Reveal delay={0.1}>
          <GlassCard className="p-12 text-center">
            <FolderKanban className="w-16 h-16 mx-auto mb-4 text-foreground/40" />
            <h3 className="text-xl font-bold mb-2">No projects yet</h3>
            <p className="text-foreground/60 mb-6">
              Create your first project to start organizing work with AI teammates
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Create Project
            </Button>
          </GlassCard>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={0.1} index={i} stagger={80}>
              <div
                className="cursor-pointer hover:scale-[1.02] transition-transform"
                onClick={() => router.push(`/app/p/${project.slug}`)}
              >
              <GlassCard className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: project.color + "20" }}
                  >
                    <FolderKanban className="w-6 h-6" style={{ color: project.color }} />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(project.id);
                    }}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                {project.description && (
                  <p className="text-foreground/60 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-foreground/70">
                    <Bot className="w-4 h-4" />
                    <span>{project._count?.agents || 0} agents</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/70">
                    <Users className="w-4 h-4" />
                    <span>{project._count?.teams || 0} teams</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/70">
                    <MessageSquare className="w-4 h-4" />
                    <span>{project._count?.chatThreads || 0} chats</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/70">
                    <ListTodo className="w-4 h-4" />
                    <span>{project._count?.workItems || 0} tasks</span>
                  </div>
                </div>
              </GlassCard>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <GlassCard className="p-8 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-6">Create Project</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent-teal focus:outline-none"
                  placeholder="My Awesome Project"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Slug <span className="text-foreground/50">(URL-friendly name)</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent-teal focus:outline-none font-mono"
                  placeholder="my-awesome-project"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (optional)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent-teal focus:outline-none"
                  placeholder="A brief tagline or summary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Project Details</label>
                <p className="text-xs text-foreground/50 mb-2">
                  Paste your PRD, goals, stack, constraints, or any context. This helps generate the right AI teammates.
                </p>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent-teal focus:outline-none resize-none font-mono text-sm"
                  rows={8}
                  placeholder="## Project Goals&#10;- Build a mobile-first app...&#10;&#10;## Tech Stack&#10;- React Native, Node.js, PostgreSQL...&#10;&#10;## Constraints&#10;- Launch in Q2..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="flex gap-3">
                  {["#2DD4BF", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        formData.color === color ? "ring-2 ring-white scale-110" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl water-glass text-foreground hover:border-white/30 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
