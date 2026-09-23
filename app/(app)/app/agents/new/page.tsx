"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/GlassCard";
import Reveal from "@/components/motion/Reveal";
import { Bot, Save, X } from "lucide-react";

interface Project {
  id: string;
  name: string;
  slug: string;
}

export default function NewAgentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    instructions: "",
    avatarColor: "#2DD4BF",
    avatarShape: "circle",
    capabilities: [] as string[],
    projectId: "",
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const agent = await res.json();
        router.push(formData.projectId ? `/app/p/${projects.find(p => p.id === formData.projectId)?.slug}` : "/app/agents");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create agent");
      }
    } catch (error) {
      console.error("Failed to create agent:", error);
      alert("Failed to create agent");
    } finally {
      setLoading(false);
    }
  };

  const toggleCapability = (cap: string) => {
    setFormData({
      ...formData,
      capabilities: formData.capabilities.includes(cap)
        ? formData.capabilities.filter((c) => c !== cap)
        : [...formData.capabilities, cap],
    });
  };

  const availableCapabilities = [
    "chat",
    "code",
    "plan",
    "coordinate",
    "memory",
    "recall",
    "build",
    "debug",
    "security",
    "approval",
    "audit",
  ];

  const colorOptions = [
    "#2DD4BF",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#F59E0B",
    "#10B981",
    "#EF4444",
    "#6366F1",
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Reveal immediate>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Create AI Teammate</h1>
            <p className="text-foreground/70">
              Design a new agent with specific roles and capabilities
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="p-3 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </Reveal>

      <Reveal immediate delay={0.1}>
        <GlassCard className="p-8" immediate>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Preview */}
            <div className="flex justify-center mb-6">
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-white font-bold text-3xl"
                style={{ backgroundColor: formData.avatarColor }}
              >
                {formData.name.charAt(0).toUpperCase() || <Bot className="w-12 h-12" />}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Agent Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent-teal focus:outline-none"
                placeholder="e.g., Sarah, DataBot, Researcher..."
                required
              />
            </div>

            {/* Title/Role */}
            <div>
              <label className="block text-sm font-medium mb-2">Title / Role</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent-teal focus:outline-none"
                placeholder="e.g., Senior Developer, Research Assistant..."
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent-teal focus:outline-none resize-none"
                rows={3}
                placeholder="Brief description of what this agent does..."
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium mb-2">
                System Instructions
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent-teal focus:outline-none resize-none font-mono text-sm"
                rows={4}
                placeholder="Detailed instructions for how this agent should behave..."
              />
            </div>

            {/* Avatar Color */}
            <div>
              <label className="block text-sm font-medium mb-2">Avatar Color</label>
              <div className="flex gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatarColor: color })}
                    className={`w-12 h-12 rounded-lg transition-all ${
                      formData.avatarColor === color ? "ring-2 ring-white scale-110" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Capabilities */}
            <div>
              <label className="block text-sm font-medium mb-2">Capabilities</label>
              <div className="flex flex-wrap gap-2">
                {availableCapabilities.map((cap) => (
                  <button
                    key={cap}
                    type="button"
                    onClick={() => toggleCapability(cap)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      formData.capabilities.includes(cap)
                        ? "bg-accent-teal/20 border-2 border-accent-teal text-accent-teal"
                        : "bg-white/5 border border-white/10 text-foreground/70 hover:bg-white/10"
                    }`}
                  >
                    {cap}
                  </button>
                ))}
              </div>
            </div>

            {/* Project Assignment */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Assign to Project (optional)
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent-teal focus:outline-none"
              >
                <option value="">No project (global agent)</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 rounded-xl water-glass text-foreground hover:border-white/30 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.name}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {loading ? "Creating..." : "Create Agent"}
              </button>
            </div>
          </form>
        </GlassCard>
      </Reveal>
    </div>
  );
}
