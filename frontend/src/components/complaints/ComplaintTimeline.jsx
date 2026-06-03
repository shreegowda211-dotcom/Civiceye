import StatusBadge from "@/components/common/StatusBadge.jsx";

export default function ComplaintTimeline({ entries = [] }) {
  if (!entries.length) return <p className="text-sm text-muted-foreground">No history yet.</p>;
  return (
    <ol className="relative border-l border-border ml-3 space-y-5">
      {entries.map((e, index) => (
        <li key={e._id ?? `${e.createdAt}-${e.status}-${index}`} className="ml-4">
          <span className="absolute -left-1.5 size-3 rounded-full bg-primary ring-4 ring-background" />
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={e.status} />
            <span className="text-xs text-muted-foreground">{new Date(e.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-sm">
            {e.actor?.name ? (
              <>
                <span className="font-medium">{e.actor.name}</span>
                <span className="text-muted-foreground"> · {e.actor.role}</span>
              </>
            ) : (
              <span className="font-medium">{String(e.status || '').replace(/_/g, ' ') || 'Update'}</span>
            )}
          </p>
          {(e.remarks || e.message) && <p className="text-sm text-muted-foreground mt-0.5">{e.remarks || e.message}</p>}
        </li>
      ))}
    </ol>
  );
}
