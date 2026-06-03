type IconProps = { className?: string };

export function IconSubObjectives({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="18"
      height="16"
      viewBox="0 0 18 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 2h6v4H2V2zm8 0h6v4h-6V2zM2 10h6v4H2v-4zm8 0h6v4h-6v-4z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}

export function IconPages({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="12"
      height="16"
      viewBox="0 0 12 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 1h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2V1z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M4 5h4M4 8h4" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function IconActivities({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="16"
      height="13"
      viewBox="0 0 16 13"
      fill="none"
      aria-hidden
    >
      <circle cx="4" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M1 11c1.5-2 3-3 6-3s4.5 1 6 3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconExternalLink({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
    >
      <path
        d="M9 1h4v4M13 1 7 7M5 3H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconChevronLeft({ className }: IconProps) {
  return (
    <svg className={className} width="7" height="12" viewBox="0 0 7 12" aria-hidden>
      <path
        d="M6 1 1 6l5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconChevronRight({ className }: IconProps) {
  return (
    <svg className={className} width="7" height="12" viewBox="0 0 7 12" aria-hidden>
      <path
        d="M1 1l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconChevronDoubleLeft({ className }: IconProps) {
  return (
    <svg className={className} width="13" height="12" viewBox="0 0 13 12" aria-hidden>
      <path
        d="M7 1 2 6l5 5M12 1 7 6l5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconChevronDoubleRight({ className }: IconProps) {
  return (
    <svg className={className} width="13" height="12" viewBox="0 0 13 12" aria-hidden>
      <path
        d="M1 1l5 5-5 5M6 1l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconSort({ className }: IconProps) {
  return (
    <svg className={className} width="18" height="14" viewBox="0 0 18 14" aria-hidden>
      <path d="M1 3h16M4 7h10M7 11h4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconTrash({ className }: IconProps) {
  return (
    <svg className={className} width="15" height="18" viewBox="0 0 15 18" aria-hidden>
      <path
        d="M1 4h13M5 4V2h5v2M3 4v12h9V4"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconSearch({ className }: IconProps) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M12 12l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconChevronDown({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconPage({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="16" viewBox="0 0 14 16" aria-hidden>
      <path
        d="M2 1h6l4 4v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}

export function IconActivity({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <path
        d="M3 11V3l4 2 4-2v8"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconPencil({ className }: IconProps) {
  return (
    <svg className={className} width="8" height="14" viewBox="0 0 8 14" aria-hidden>
      <path
        d="M7 13 1 7l1-4 4-1 4 4-4 7z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}
