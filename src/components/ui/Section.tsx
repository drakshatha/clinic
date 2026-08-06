import { type ReactNode } from "react";

export function Section({
  children,
  className = "",
  id,
  alt = false,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  alt?: boolean;
}) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 ${alt ? "bg-bg-soft" : "bg-bg"} ${className}`}
    >
      <div className="mx-auto w-[min(1120px,calc(100%-2rem))]">{children}</div>
    </section>
  );
}

export function SectionHeading({
  kicker,
  title,
  description,
  center = true,
}: {
  kicker?: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-12 max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {kicker ? (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-blue">
          {kicker}
        </p>
      ) : null}
      <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
