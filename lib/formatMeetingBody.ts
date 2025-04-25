export const formatMeetingBody = (
  firstName: string,
  storeName: string,
  notes: string[]
) => {
  return `Meeting with ${firstName}:\n\nMet with ${firstName} at ${storeName}.\n\nTopics discussed:\n${notes
    .map((n) => `- ${n}`)
    .join(
      "\n"
    )}\n\nStore traffic: Steady with peak hours after 4 PM\nNext steps: Send wholesale catalog and follow up next Thursday`;
};
