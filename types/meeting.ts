export interface MeetingLogListRef {
  refetch: () => void;
  addOptimisticMeeting: (meeting: any) => void;
}
