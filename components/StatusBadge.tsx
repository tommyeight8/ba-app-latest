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
    bgColor: "bg-orange-50",
    textColor: "text-orange-400",
    borderColor: "border-orange-300",
  },
  shipped: {
    label: "Shipped",
    dotColor: "bg-blue-500",
    bgColor: "bg-blue-100",
    textColor: "text-orange-300",
    borderColor: "border-orange-300",
  },
  "dropped off": {
    label: "Dropped Off",
    dotColor: "bg-red-500",
    bgColor: "bg-red-100",
    textColor: "text-orange-300",
    borderColor: "border-orange-300",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusMap[status.toLowerCase()] ?? {
    label: status,
    dotColor: "bg-gray-400",
    bgColor: "bg-gray-100",
    textColor: "text-gray-300",
    borderColor: "border-gray-300",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bgColor} border ${config.borderColor}`}
    >
      {/* <span className={`w-3 h-3 rounded-full ${config.dotColor}`} /> */}
      <span className={`text-xs font-semibold ${config.textColor}`}>
        {config.label}
      </span>
    </div>
  );
}
