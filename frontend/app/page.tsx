import { Suspense } from "react";
import HomeContent from "./HomeContent";

export default function HomePage() {
    return (
        <Suspense fallback={<></>}>
            <HomeContent />
        </Suspense>
    );
}