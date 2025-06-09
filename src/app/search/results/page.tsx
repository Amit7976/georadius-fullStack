import { Suspense } from "react";
import SearchResultsClient from "./SearchResultsClient";
import { t } from "@/src/helpers/i18n";

export default function SearchResultsPage() {
    return (
        <Suspense fallback={<div>{t("loadingSearch")}</div>}>
            <SearchResultsClient />
        </Suspense>
    );
}
