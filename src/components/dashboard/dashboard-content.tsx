"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TaskCard } from "@/components/dashboard/task-card";
import {
  KanbanIcon,
  ListIcon,
  SearchIcon,
} from "@/components/ui/icons";
import {
  filterDashboardTasks,
  statusLabels,
  visibleTaskStatuses,
} from "@/lib/dashboard/task-utils";
import type { DashboardTask } from "@/lib/dashboard/types";

type DashboardContentProps = {
  userName: string | null;
  tasks: DashboardTask[];
  hasLoadingError: boolean;
};

type DashboardView = "list" | "kanban";

export function DashboardContent({
  userName,
  tasks,
  hasLoadingError,
}: DashboardContentProps) {
  const [view, setView] = useState<DashboardView>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const filteredTasks = useMemo(
    () => filterDashboardTasks(tasks, searchQuery),
    [searchQuery, tasks],
  );

  return (
    <section className="mx-auto w-full max-w-225 px-5 py-12 md:px-0 md:py-16">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-950">
            Tableau de bord
          </h1>
          <p className="mt-2 text-sm text-neutral-800 sm:text-base">
            Bonjour{userName ? ` ${userName}` : ""}, voici un aperçu de vos
            projets et tâches.
          </p>
        </div>
        <Link
          href="/projects/new"
          className="flex h-11 items-center justify-center rounded-lg bg-[#202020] px-6 text-sm text-white outline-none transition-colors hover:bg-black focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2"
        >
          + Créer un projet
        </Link>
      </div>

      <div className="mt-10 flex items-center gap-2" aria-label="Vue du dashboard">
        <ViewButton
          label="Liste"
          isActive={view === "list"}
          onClick={() => setView("list")}
          icon={<ListIcon className="size-4" />}
        />
        <ViewButton
          label="Kanban"
          isActive={view === "kanban"}
          onClick={() => setView("kanban")}
          icon={<KanbanIcon className="size-4" />}
        />
      </div>

      {hasLoadingError ? (
        <div
          role="alert"
          className="mt-7 rounded-lg border border-[#f0c8b6] bg-white p-8 text-center"
        >
          <h2 className="font-semibold text-neutral-950">
            Impossible de charger les tâches
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Vérifiez que le backend est disponible, puis réessayez.
          </p>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="mt-5 rounded-lg bg-[#202020] px-5 py-3 text-sm text-white outline-none hover:bg-black focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2"
          >
            Réessayer
          </button>
        </div>
      ) : view === "list" ? (
        <ListView
          tasks={filteredTasks}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          hasTasks={tasks.length > 0}
        />
      ) : (
        <KanbanView tasks={tasks} />
      )}
    </section>
  );
}

type ViewButtonProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
};

function ViewButton({ label, isActive, onClick, icon }: ViewButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`flex h-9 items-center gap-2 rounded-md px-4 text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2 ${isActive
          ? "bg-[#fde5d6] text-(--brand)"
          : "bg-white text-(--brand) hover:bg-[#fff1e8]"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

type ListViewProps = {
  tasks: DashboardTask[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  hasTasks: boolean;
};

function ListView({
  tasks,
  searchQuery,
  onSearchChange,
  hasTasks,
}: ListViewProps) {
  return (
    <div className="mt-6 rounded-lg border border-[#dfe3e8] bg-white p-5 sm:p-8 md:p-10">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h2 className="font-semibold text-neutral-950">Mes tâches assignées</h2>
          <p className="mt-1 text-sm text-[#858b98]">Par ordre de priorité</p>
        </div>
        <label className="relative block w-full sm:w-64">
          <span className="sr-only">Rechercher une tâche</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Rechercher une tâche"
            className="h-11 w-full rounded-md border border-[#dfe3e8] bg-white pr-11 pl-4 text-sm text-neutral-950 outline-none placeholder:text-[#9299a5] focus:border-(--brand) focus:ring-2 focus:ring-[#d3590b26]"
          />
          <SearchIcon className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#778191]" />
        </label>
      </div>

      {tasks.length > 0 ? (
        <div className="mt-8 flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} variant="list" />
          ))}
        </div>
      ) : (
        <EmptyState
          message={
            hasTasks
              ? "Aucune tâche ne correspond à votre recherche."
              : "Aucune tâche ne vous est assignée pour le moment."
          }
        />
      )}
    </div>
  );
}

function KanbanView({ tasks }: { tasks: DashboardTask[] }) {
  return (
    <div className="mt-9 grid gap-4 lg:grid-cols-3">
      {visibleTaskStatuses.map((status) => {
        const columnTasks = tasks.filter((task) => task.status === status);
        const columnTitle = status === "DONE" ? "Terminées" : statusLabels[status];

        return (
          <section
            key={status}
            aria-labelledby={`column-${status}`}
            className="min-w-0 rounded-lg border border-[#f2cfc1] bg-transparent p-4"
          >
            <div className="flex items-center gap-3 px-1 py-2">
              <h2 id={`column-${status}`} className="font-semibold text-neutral-900">
                {columnTitle}
              </h2>
              <span className="rounded-full bg-[#e8eaed] px-3 py-1 text-xs text-[#7e8796]">
                {columnTasks.length}
              </span>
            </div>
            {columnTasks.length > 0 ? (
              <div className="mt-5 flex flex-col gap-3">
                {columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} variant="kanban" />
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-lg border border-dashed border-[#dfe3e8] bg-white/60 px-4 py-8 text-center text-sm text-[#858b98]">
                Aucune tâche
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="mt-8 rounded-lg border border-dashed border-[#dfe3e8] px-5 py-12 text-center text-sm text-[#858b98]">
      {message}
    </p>
  );
}
