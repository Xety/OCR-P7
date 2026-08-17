import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const commonProps = {
  fill: "none",
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
} as const;

export function DashboardIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path
        fill="currentColor"
        d="M4 3.5A1.5 1.5 0 0 1 5.5 2h4A1.5 1.5 0 0 1 11 3.5v6A1.5 1.5 0 0 1 9.5 11h-4A1.5 1.5 0 0 1 4 9.5v-6Zm9 0A1.5 1.5 0 0 1 14.5 2h4A1.5 1.5 0 0 1 20 3.5v3A1.5 1.5 0 0 1 18.5 8h-4A1.5 1.5 0 0 1 13 6.5v-3Zm0 8A1.5 1.5 0 0 1 14.5 10h4a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-4a1.5 1.5 0 0 1-1.5-1.5v-9Zm-9 3A1.5 1.5 0 0 1 5.5 13h4a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 9.5 22h-4A1.5 1.5 0 0 1 4 20.5v-6Z"
      />
    </svg>
  );
}

export function FolderIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path
        fill="currentColor"
        d="M3.75 4A2.75 2.75 0 0 0 1 6.75v10.5A2.75 2.75 0 0 0 3.75 20h13.1a2.75 2.75 0 0 0 2.55-1.72l3.35-8.25A1.5 1.5 0 0 0 21.36 8H8.82L7.27 4.9A1.63 1.63 0 0 0 5.82 4H3.75Z"
      />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0"
      />
    </svg>
  );
}

export function TeamIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path
        fill="currentColor"
        d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7.5-1a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 19a7 7 0 0 1 14 0v1H2v-1Zm14.25 1v-1a8.7 8.7 0 0 0-2.13-5.7A5.5 5.5 0 0 1 22 18.3V20h-5.75Z"
      />
    </svg>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M10 5H5.75A1.75 1.75 0 0 0 4 6.75v10.5C4 18.22 4.78 19 5.75 19H10m5-4 3-3-3-3m3 3H9"
      />
    </svg>
  );
}

export function ListIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="m5 12 2 2 4-5M13 8h6m-6 4h6m-6 4h4M5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13A2.5 2.5 0 0 1 5.5 3Z"
      />
    </svg>
  );
}

export function KanbanIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M6 3v3m12-3v3M4.75 5h14.5A1.75 1.75 0 0 1 21 6.75v12.5A1.75 1.75 0 0 1 19.25 21H4.75A1.75 1.75 0 0 1 3 19.25V6.75A1.75 1.75 0 0 1 4.75 5ZM7 10h3v3H7v-3Zm7 0h3v3h-3v-3Zm-7 6h3v1H7v-1Zm7 0h3v1h-3v-1Z"
      />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M7 3v3m10-3v3M4.75 5h14.5A1.75 1.75 0 0 1 21 6.75v12.5A1.75 1.75 0 0 1 19.25 21H4.75A1.75 1.75 0 0 1 3 19.25V6.75A1.75 1.75 0 0 1 4.75 5ZM3 9h18"
      />
    </svg>
  );
}

export function CommentIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path
        fill="currentColor"
        d="M5.5 3h13A2.5 2.5 0 0 1 21 5.5v9a2.5 2.5 0 0 1-2.5 2.5h-6.14l-4.73 3.55A1 1 0 0 1 6 19.75V17h-.5A2.5 2.5 0 0 1 3 14.5v-9A2.5 2.5 0 0 1 5.5 3Z"
      />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
        d="m20 20-4.25-4.25m2.25-5A7.25 7.25 0 1 1 3.5 10.75a7.25 7.25 0 0 1 14.5 0Z"
      />
    </svg>
  );
}
