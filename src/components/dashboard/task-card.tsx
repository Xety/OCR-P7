import Link from "next/link";
import {
  CalendarIcon,
  CommentIcon,
  FolderIcon,
} from "@/components/ui/icons";
import {
  formatDueDate,
  isVisibleTaskStatus,
  statusLabels,
} from "@/lib/dashboard/task-utils";
import type { DashboardTask } from "@/lib/dashboard/types";

type TaskCardProps = {
  task: DashboardTask;
  variant: "list" | "kanban";
};

const statusStyles = {
  TODO: "bg-[#ffe0e1] text-[#e55e61]",
  IN_PROGRESS: "bg-[#fff0d5] text-[#d88916]",
  DONE: "bg-[#e5f9ef] text-[#2fad70]",
} as const;

export function TaskCard({ task, variant }: TaskCardProps) {
  if (!isVisibleTaskStatus(task.status)) {
    return null;
  }

  const isList = variant === "list";

  return (
    <article
      className={`rounded-lg border border-[#dfe3e8] bg-white ${
        isList ? "p-5 sm:p-7" : "p-5"
      }`}
    >
      <div
        className={
          isList
            ? "grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            : "flex flex-col"
        }
      >
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-semibold text-neutral-950">{task.title}</h3>
            {!isList && (
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs ${statusStyles[task.status]}`}
              >
                {statusLabels[task.status]}
              </span>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#858b98]">
            {task.description || "Aucune description"}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-y-2 text-xs text-[#7e8796]">
            <span className="flex min-w-0 items-center gap-2">
              <FolderIcon className="size-4 shrink-0 text-[#9da5b2]" />
              <span className="max-w-40 truncate">{task.project.name}</span>
            </span>
            <span aria-hidden="true" className="mx-3 h-4 border-l border-[#c7ccd3]" />
            <span className="flex items-center gap-2">
              <CalendarIcon className="size-4 text-[#7e8796]" />
              {formatDueDate(task.dueDate)}
            </span>
            <span aria-hidden="true" className="mx-3 h-4 border-l border-[#c7ccd3]" />
            <span className="flex items-center gap-2">
              <CommentIcon className="size-4 text-[#7e8796]" />
              <span className="sr-only">Commentaires :</span>
              {task.comments.length}
            </span>
          </div>
        </div>

        <div
          className={`flex ${
            isList
              ? "items-center justify-between gap-4 sm:flex-col sm:items-end"
              : "mt-6"
          }`}
        >
          {isList && (
            <span
              className={`rounded-full px-3 py-1 text-xs ${statusStyles[task.status]}`}
            >
              {statusLabels[task.status]}
            </span>
          )}
          <Link
            href={`/projects/${task.project.id}/tasks/${task.id}`}
            className={`flex h-10 items-center justify-center rounded-lg bg-[#202020] px-7 text-sm text-white outline-none transition-colors hover:bg-black focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2 ${
              isList ? "sm:mt-7" : "w-24"
            }`}
          >
            Voir
          </Link>
        </div>
      </div>
    </article>
  );
}
