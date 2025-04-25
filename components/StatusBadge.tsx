const statusMap: Record<
  string,
  {
    label: string;
    dotColor: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }
> = {
  "pending visit": {
    label: "Pending Visit",
    dotColor: "bg-orange-300",
    bgColor: "bg-orange-50 dark:bg-transparent",
    textColor: "text-orange-400",
    borderColor: "border-orange-300",
  },
  "visit requested by rep": {
    label: "Visit requested by rep",
    dotColor: "bg-red-300",
    bgColor: "bg-red-50 dark:bg-transparent",
    textColor: "text-red-400",
    borderColor: "border-red-300",
  },
  "dropped off": {
    label: "Dropped Off",
    dotColor: "bg-green-300",
    bgColor: "bg-green-50 dark:bg-transparent",
    textColor: "text-green-400",
    borderColor: "border-green-300",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusMap[status.toLowerCase()] ?? {
    label: status,
    dotColor: "bg-gray-400",
    bgColor: "bg-gray-100 dark:bg-transparent",
    textColor: "text-gray-300",
    borderColor: "border-gray-300",
  };

  return (
    <div
      className={`mt-auto inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full ${config.bgColor} border ${config.borderColor}`}
    >
      {/* <span className={`w-3 h-3 rounded-full ${config.dotColor}`} /> */}
      <span className={`text-[11px] font-semibold ${config.textColor}`}>
        {config.label}
      </span>
    </div>
  );
}
