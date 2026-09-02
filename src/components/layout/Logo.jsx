function Mark({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 150.48 217.98"
      role="img"
      aria-hidden="true"
    >
      <image href="/logo-sign-color-hr.svg" width="150.48" height="217.98" />
    </svg>
  );
}

export function FullLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 372.53 217.98" role="img">
      <title>Pomorski fakultet u Splitu</title>
      <image href="/logo-color-hr.svg" width="372.53" height="217.98" />
    </svg>
  );
}

export function MarkLogo({ className }) {
  return <Mark className={className} />;
}
