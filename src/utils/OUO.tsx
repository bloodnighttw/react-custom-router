import { useRouter } from "../hook/router";
import type { Router } from "./router"

interface ComponentProps {
    source: Router[];
}

export function OuoRouter(props: ComponentProps) {
    const path = useRouter();
    const { source } = props;

    // iterator over the source array to find a matching route
    for (const route of source) {
        const match = route.matchFn(path);
        if (match) {
            // If a match is found, render the corresponding component
            return <route.component />;
        }
    }
    
    throw new Error(`No route found for path: ${path}`);
}