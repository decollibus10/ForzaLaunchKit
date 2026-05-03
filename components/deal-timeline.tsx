import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import type { DealEvent } from "@/lib/types";

type DealTimelineProps = {
  events: DealEvent[];
};

export function DealTimeline({ events }: DealTimelineProps) {
  return (
    <ol className="deal-timeline">
      {events.map((event) => {
        const Icon =
          event.status === "complete"
            ? CheckCircle2
            : event.status === "current"
              ? Clock3
              : Circle;

        return (
          <li key={event.id} className={event.status}>
            <Icon size={17} />
            <div>
              <strong>{event.label}</strong>
              <p>{event.detail}</p>
              {event.occurredAt ? <span>{event.occurredAt}</span> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
