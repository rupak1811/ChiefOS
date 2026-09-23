"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/GlassCard";
import Reveal from "@/components/motion/Reveal";
import { ListTodo, Plus, Clock, CheckCircle, AlertCircle, Circle } from "lucide-react";

interface WorkItem {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  createdAt: string;
  agent?: {
    id: string;
    name: string;
    avatarColor: string;
  } | null;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProjectTasksPage({ params }: PageProps) {
  const router = useRouter();
  const [slug, setSlug] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [tasks, setTasks] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    params.then(({ slug: resolvedSlug }) => {
      setSlug(resolvedSlug);
      fetchData(resolvedSlug);
    });
  }, [params]);

  const fetchData = async (projectSlug: string) => {
    try {
      const projectsRes = await fetch("/api/projects");
      const projects = await projectsRes.json();
      const project = projects.find((p: any) => p.slug === projectSlug);

      if (project) {
        setProjectId(project.id);
        const tasksRes = await fetch(`/api/tasks?projectId=${project.id}`);
        const tasksData = await tasksRes.json();
        setTasks(tasksData);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setCreating(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          projectId,
          status: "pending",
        }),
      });

      if (res.ok) {
        const task = await res.json();
        setTasks([task, ...tasks]);
        setShowNewModal(false);
        setFormData({ title: "", description: "" });
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setTasks(tasks.map((t) => (t.id === taskId ? updated : t)));
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const getTasksByStatus = (status: string) =>
    tasks.filter((t) => t.status === status);

  const statusColumns = [
    { id: "pending", label: "Pending", icon: Circle, color: "text-gray-400" },
    { id: "in_progress", label: "In Progress", icon: Clock, color: "text-blue-400" },
    { id: "done", label: "Done", icon: CheckCircle, color: "text-green-400" },
    { id: "blocked", label: "Blocked", icon: AlertCircle, color: "text-red-400" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-foreground/60">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div>
      <Reveal immediate>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tasks</h1>
            <p className="text-foreground/70">Track work and assignments</p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="px-6 h-11 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Task
          </button>
        </div>
      </Reveal>

      {tasks.length === 0 ? (
        <Reveal immediate delay={0.1}>
          <GlassCard className="p-12 text-center">
            <ListTodo className="w-16 h-16 mx-auto mb-4 text-foreground/40" />
            <h3 className="text-xl font-bold mb-2">No tasks yet</h3>
            <p className="text-foreground/60 mb-6">
              Create tasks to track work and assignments
            </p>
            <button
              onClick={() => setShowNewModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Task
            </button>
          </GlassCard>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statusColumns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            const Icon = column.icon;

            return (
              <Reveal immediate key={column.id} delay={0.1} index={statusColumns.indexOf(column)} stagger={80}>
                <GlassCard className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className={`w-5 h-5 ${column.color}`} />
                    <h3 className="font-bold">{column.label}</h3>
                    <span className="ml-auto px-2 py-1 bg-white/10 rounded text-xs">
                      {columnTasks.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {columnTasks.map((task) => (
                      <div key={task.id} className="p-3 glass-morphism rounded-xl">
                        <p className="font-medium mb-2 text-sm">{task.title}</p>
                        {task.description && (
                          <p className="text-xs text-foreground/60 mb-2 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        {task.agent && (
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold"
                              style={{ backgroundColor: task.agent.avatarColor }}
                            >
                              {task.agent.name.charAt(0)}
                            </div>
                            <span className="text-xs text-foreground/70">
                              {task.agent.name}
                            </span>
                          </div>
                        )}
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-xs focus:border-accent-teal focus:outline-none mt-2"
                        >
                          {statusColumns.map((col) => (
                            <option key={col.id} value={col.id}>
                              {col.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      )}

      {/* New Task Modal */}
      {showNewModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowNewModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <GlassCard className="p-8 max-w-lg w-full">
              <h2 className="text-2xl font-bold mb-6">Create Task</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent-teal focus:outline-none"
                    placeholder="What needs to be done?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent-teal focus:outline-none resize-none"
                    rows={3}
                    placeholder="Additional details..."
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl water-glass text-foreground hover:border-white/30 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating || !formData.title.trim()}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {creating ? "Creating..." : "Create Task"}
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
