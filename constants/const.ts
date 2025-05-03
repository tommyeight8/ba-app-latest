export const STATIC_TASK_QUEUES: Record<
  "litto" | "skwezed",
  { id: string; name: string }[]
> = {
  litto: [
    { id: process.env.LITTO_BA_SAMPLE_QUEUE_ID!, name: "BA Sample Drop Off" },
    // add more if needed
  ],
  skwezed: [
    { id: process.env.SKWEZED_BA_SAMPLE_QUEUE_ID!, name: "BA Sample Drop Off" },
  ],
};
