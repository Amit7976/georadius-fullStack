import { Suspense } from "react";
import SearchResultsClient from "./SearchResultsClient";

export default function SearchResultsPage() {
    return (
        <Suspense fallback={<div>Loading search results...</div>}>
            <SearchResultsClient />
        </Suspense>
    );
}
