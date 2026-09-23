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
    <div className="w-full">
      <Reveal immediate>
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Projects</h1>
            <p className="text-sm sm:text-base text-foreground/70">
              Organize your work into projects with teams and AI agents
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
            <span className="hidden sm:inline">New Project</span>
          </Button>
        </div>
      </Reveal>

      {projects.length === 0 ? (
        <Reveal immediate delay={0.1}>
<<<<<<< HEAD
          <GlassCard className="p-12 text-center" immediate>
            <FolderKanban className="w-16 h-16 mx-auto mb-4 text-foreground/40" />
            <h3 className="text-xl font-bold mb-2">No projects yet</h3>
            <p className="text-foreground/60 mb-6">
=======
          <GlassCard className="p-8 sm:p-12 text-center">
            <FolderKanban className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-foreground/40" />
            <h3 className="text-lg sm:text-xl font-bold mb-2">No projects yet</h3>
            <p className="text-sm sm:text-base text-foreground/60 mb-4 sm:mb-6">
>>>>>>> e188526 (feat: Make ChiefOS fully responsive for mobile, tablet, and desktop)
              Create your first project to start organizing work with AI teammates
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Create Project
            </Button>
          </GlassCard>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project, i) => (
            <Reveal immediate key={project.id} delay={0.1} index={i} stagger={80}>
              <div
                className="cursor-pointer hover:scale-[1.02] transition-transform"
                onClick={() => router.push(`/app/p/${project.slug}`)}
              >
<<<<<<< HEAD
              <GlassCard className="p-6" immediate>
                <div className="flex items-start justify-between mb-4">
=======
              <GlassCard className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
>>>>>>> e188526 (feat: Make ChiefOS fully responsive for mobile, tablet, and desktop)
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: project.color + "20" }}
                  >
                    <FolderKanban className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: project.color }} />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(project.id);
                    }}
                    className="p-1.5 sm:p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                    aria-label="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">{project.name}</h3>
                {project.description && (
                  <p className="text-foreground/60 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-foreground/70">
                    <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{project._count?.agents || 0} agents</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-foreground/70">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{project._count?.teams || 0} teams</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-foreground/70">
                    <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{project._count?.chatThreads || 0} chats</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-foreground/70">
                    <ListTodo className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{project._count?.workItems || 0} tasks</span>
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
<<<<<<< HEAD
          <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <GlassCard className="p-8 max-w-lg w-full" immediate>
            <h2 className="text-2xl font-bold mb-6">Create Project</h2>
            <form onSubmit={handleCreate} className="space-y-4">
=======
          <div onClick={(e: React.MouseEvent) => e.stopPropagation()} className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Create Project</h2>
            <form onSubmit={handleCreate} className="space-y-3 sm:space-y-4">
>>>>>>> e188526 (feat: Make ChiefOS fully responsive for mobile, tablet, and desktop)
              <div>
                <label className="block text-sm font-medium mb-2">Project Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent-teal focus:outline-none text-sm sm:text-base"
                  placeholder="My Awesome Project"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Slug <span className="text-foreground/50 text-xs">(URL-friendly name)</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent-teal focus:outline-none font-mono text-sm sm:text-base"
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent-teal focus:outline-none text-sm sm:text-base"
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent-teal focus:outline-none resize-none font-mono text-xs sm:text-sm"
                  rows={6}
                  placeholder="## Project Goals&#10;- Build a mobile-first app...&#10;&#10;## Tech Stack&#10;- React Native, Node.js, PostgreSQL...&#10;&#10;## Constraints&#10;- Launch in Q2..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {["#2DD4BF", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-all ${
                        formData.color === color ? "ring-2 ring-white scale-110" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-xl water-glass text-foreground hover:border-white/30 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 text-sm sm:text-base"
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
