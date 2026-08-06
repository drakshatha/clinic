import { site } from "@/lib/site";

export function FloatingActions() {
  const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    "Hi, I want to book a consultation for smile restoration."
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3 md:bottom-8 md:right-8">
      <a
        href="/contact#book"
        className="hidden rounded-full bg-blue px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow)] transition hover:-translate-y-0.5 hover:bg-blue-deep sm:inline-flex"
      >
        Book Appointment
      </a>
      <a
        href={wa}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[var(--shadow)] transition hover:scale-105"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden>
          <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.4 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.1.1.3 0 .5l-.4.6c-.1.2-.3.3-.1.6.1.3.7 1.1 1.4 1.8.9.8 1.7 1 2 1.2.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.2.1.4.2.4.3.1.2.1.6 0 1.2Z" />
        </svg>
      </a>
      <a
        href={`tel:${site.phone}`}
        aria-label="Call clinic"
        className="grid h-14 w-14 place-items-center rounded-full bg-navy text-white shadow-[var(--shadow)] transition hover:scale-105"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden>
          <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .5 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.5-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1l-2.3 2.3Z" />
        </svg>
      </a>
    </div>
  );
}
