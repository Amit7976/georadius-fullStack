export default function Placeholder() {
    return (
        <div className="flex flex-col gap-4 px-4 py-6">
            {[...Array(9)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 dark:bg-neutral-800 rounded-lg h-32 w-full" />
            ))}
        </div>
    );
}
  