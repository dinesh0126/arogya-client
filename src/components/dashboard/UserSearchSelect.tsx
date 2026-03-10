import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";

export type UserSearchRecord = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  raw?: unknown;
};

const normalizeText = (value: string) => value.trim().toLowerCase();

export function UserSearchSelect({
  label,
  placeholder = "Search by name or email...",
  users,
  roleFilter,
  value,
  onChange,
  className,
}: {
  label: string;
  placeholder?: string;
  users: UserSearchRecord[];
  roleFilter?: string;
  value: UserSearchRecord | null;
  onChange: (user: UserSearchRecord | null) => void;
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = normalizeText(query);
    const base = roleFilter
      ? users.filter((u) => normalizeText(String(u.role || "")) === normalizeText(roleFilter))
      : users;
    if (!q) {
      return base.slice(0, 8);
    }
    return base
      .filter((u) => {
        const hay = `${u.name} ${u.email}`.toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 12);
  }, [query, roleFilter, users]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-slate-200">{label}</label>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs text-slate-300 hover:text-white cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {value ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-slate-100 truncate">{value.name}</p>
              <p className="text-xs text-slate-300 truncate">{value.email}</p>
              <p className="text-xs text-slate-400">
                id: {value.id}
                {value.role ? ` | role: ${value.role}` : ""}
                {value.phone ? ` | phone: ${value.phone}` : ""}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <Input
            value={query}
            placeholder={placeholder}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              // small delay so click can register
              window.setTimeout(() => setOpen(false), 150);
            }}
            className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
          />

          {open && filtered.length > 0 && (
            <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950/95 shadow-xl">
              {filtered.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  className="w-full cursor-pointer px-3 py-2 text-left hover:bg-white/5"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(u);
                    setQuery("");
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-100 truncate">
                        {u.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {u.role || "--"} #{u.id}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

