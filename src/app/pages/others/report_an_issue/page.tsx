import { Suspense } from 'react';
import ReportAnIssueClient from './ReportAnIssueClient';

export default function ReportAnIssuePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ReportAnIssueClient />
        </Suspense>
    );
}
