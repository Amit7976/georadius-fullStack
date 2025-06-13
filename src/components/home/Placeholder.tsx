export default function Placeholder() {
    return (
        <div className="flex flex-col gap-4 px-4 py-6">
            {[...Array(9)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 dark:bg-neutral-800 rounded-lg h-52 w-full" />
            ))}
        </div>
    );
}

export function PlaceholderPost() {
    return (
        <div className="flex flex-col gap-10 px-0 py-6">
            {[...Array(9)].map((_, i) => (
                <div key={i} className="space-y-2">
                    <div className="flex items-center gap-4 px-2">
                        <div className="w-12 h-12 shrink-0 rounded-full bg-gray-100 dark:bg-neutral-800"></div>
                        <div className="w-full space-y-2">
                            <div className="w-1/2 h-2 rounded-full bg-gray-100 dark:bg-neutral-800"></div>
                            <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-neutral-800"></div>
                        </div>
                    </div>
                    <div className="animate-pulse bg-gray-100 dark:bg-neutral-800 h-[350px] w-full"></div>

                    <div className="space-y-3 mt-4 px-2">
                        <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-neutral-800"></div>
                        <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-neutral-800"></div>
                        <div className="w-1/2 h-3 rounded-full bg-gray-100 dark:bg-neutral-800"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
export function PlaceholderSearchPost() {
    return (
        <div className="flex flex-col gap-10 px-2 py-5">
            {[...Array(9)].map((_, i) => (
                <div key={i} className="space-y-3 py-2 text-start">
                    <p className="w-1/4 h-2 rounded-full bg-gray-100 dark:bg-neutral-800"></p>
                    <h4 className="w-1/2 h-3.5 rounded-full bg-gray-100 dark:bg-neutral-800"></h4>
                    <p className="w-2/3 h-2.5 rounded-full bg-gray-100 dark:bg-neutral-800"></p>

                    <div className="rounded-t-2xl mt-4 h-[250px] bg-gray-100 dark:bg-neutral-800"></div>
                    <div className="w-full h-2.5 mt-6 rounded-full bg-gray-100 dark:bg-neutral-800"></div>
                    <div className="w-1/2 h-2.5 rounded-full bg-gray-100 dark:bg-neutral-800 mt-4"></div>
                </div>
            ))}
        </div>
    );
}

export function PlaceholderSearchUser() {
    return (
        <div className="flex flex-col gap-10 px-2 py-10">
            {[...Array(9)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-2">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-gray-100 dark:bg-neutral-800"></div>
                    <div className="w-full space-y-3">
                        <div className="w-1/2 h-4 rounded-full bg-gray-100 dark:bg-neutral-800"></div>
                        <div className="w-full h-5 rounded-full bg-gray-100 dark:bg-neutral-800"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function PlaceholderUserProfile() {
    return (
        <div className="flex flex-col gap-10 px-4 py-6">
            <div className="space-y-2">
                <div className="w-1/4 h-4 rounded-full bg-gray-100 dark:bg-neutral-800"></div>
                <div className="flex items-start gap-4 px-2 py-10">
                    <div className="w-28 h-28 shrink-0 rounded-full bg-gray-100 dark:bg-neutral-800"></div>
                    <div className="w-full space-y-4 mt-2">
                        <div className="w-1/2 h-6 mb-6 rounded-full bg-gray-100 dark:bg-neutral-800"></div>
                        <div className="w-full h-4 rounded-full bg-gray-100 dark:bg-neutral-800"></div>
                        <div className="w-1/2 h-4 rounded-full bg-gray-100 dark:bg-neutral-800"></div>
                        <div className="w-2/3 h-2 mt-4 rounded-full bg-gray-100 dark:bg-neutral-800"></div>
                    </div>
                </div>
                <div className="flex justify-between items-center gap-5">
                    <div className="w-full h-10 rounded-xl bg-gray-100 dark:bg-neutral-800"></div>
                    <div className="w-full h-10 rounded-xl bg-gray-100 dark:bg-neutral-800"></div>
                </div>
            </div>
        </div>
    );
}
