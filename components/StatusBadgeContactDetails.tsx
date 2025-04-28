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
    dotColor: "bg-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-200/20",
    textColor: "text-orange-500 dark:text-orange-400",
    borderColor: "border-orange-400",
  },
  "visit requested by rep": {
    label: "Visit requested by rep",
    dotColor: "bg-red-400",
    bgColor: "bg-red-100 dark:bg-red-200/20",
    textColor: "text-red-500 dark:text-red-400",
    borderColor: "border-red-400",
  },
  "dropped off": {
    label: "Dropped Off",
    dotColor: "bg-green-400",
    bgColor: "bg-green-100 dark:bg-green-200/20",
    textColor: "text-green-500 dark:text-green-400",
    borderColor: "border-green-400",
  },
};

export function StatusBadgeContactDetails({ status }: { status: string }) {
  const config = statusMap[status.toLowerCase()] ?? {
    label: status,
    dotColor: "bg-gray-400",
    bgColor: "bg-gray-100",
    textColor: "text-gray-500 dark:text-gray-400",
    borderColor: "border-gray-400",
  };

  return (
    <div
      className={`mt-auto inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full ${config.bgColor} border ${config.borderColor}`}
    >
      {/* <span className={`w-3 h-3 rounded-full ${config.dotColor}`} /> */}
      <span className={`block rounded-full ${config.dotColor} h-2 w-2`}>
        &nbsp;
      </span>
      <span className={`text-[11px] font-semibold ${config.textColor}`}>
        {config.label}
      </span>
    </div>
  );
}
