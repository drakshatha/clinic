import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "white";

const styles: Record<Variant, string> = {
  primary:
    "bg-blue text-white shadow-[var(--shadow-sm)] hover:bg-blue-deep hover:-translate-y-0.5",
  secondary:
    "bg-white text-navy border border-line hover:border-blue hover:text-blue-deep",
  ghost: "bg-transparent text-navy hover:text-blue",
  white: "bg-white text-navy hover:bg-bg-soft",
};

type Props = {
  href?: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  href,
  variant = "primary",
  children,
  className = "",
  ...rest
}: Props) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-200 disabled:opacity-60 ${styles[variant]} ${className}`;

  if (href) {
    const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
    const { onClick, ...anchorRest } = rest;
    if (external) {
      return (
        <a
          href={href}
          className={cls}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          onClick={onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className={cls}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
