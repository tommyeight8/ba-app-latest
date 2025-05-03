import { STATIC_TASK_QUEUES } from "@/constants/const"; // or wherever you define it

export function QueueSelect({
  brand,
  onSelect,
}: {
  brand: "litto" | "skwezed";
  onSelect: (queueId: string) => void;
}) {
  const queues = STATIC_TASK_QUEUES[brand];

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Task Queue:</label>
      <select
        onChange={(e) => onSelect(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      >
        <option value="">Select queue</option>
        {queues.map((queue, i) => (
          <option key={queue.id || i} value={queue.id}>
            {queue.name || `Queue ${i + 1}`}
          </option>
        ))}
      </select>
    </div>
  );
}
