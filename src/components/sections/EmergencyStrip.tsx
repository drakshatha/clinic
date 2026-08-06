import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";

export function EmergencyStrip() {
  return (
    <div className="border-y border-line bg-white">
      <div className="mx-auto flex w-[min(1120px,calc(100%-2rem))] flex-col items-start justify-between gap-4 py-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-blue">
            Need care today?
          </p>
          <p className="mt-1 font-semibold text-navy">
            Limited appointments available · Open daily till 9:30 PM
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href={`tel:${site.phone}`} variant="secondary">
            Call {site.phoneDisplay}
          </Button>
          <Button href="/contact#book">Book Appointment</Button>
        </div>
      </div>
    </div>
  );
}
