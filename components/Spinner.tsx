// components/ui/spinner.tsx
type Props = {
  size: string;
};
export default function Spinner({ size = "4" }: Props) {
  return (
    <div
      className={`h-${size} w-${size} border-2 border-white dark:border-black border-t-transparent animate-spin rounded-full`}
    />
  );
}
