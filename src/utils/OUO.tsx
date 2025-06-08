import React from "react";
import { useRouter } from "../hook/router";
import { setParamsCache, type Router } from "./router";


interface ComponentProps {
    source: Router[];
}

export function OuoRouter(props: ComponentProps) {
    const routers = React.useMemo(() => props.source.map(fn => fn()), [props.source]);
    const path = useRouter();
    setParamsCache({}); // Reset cache before finding a route

    // iterator over the source array to find a matching route
    for (const route of routers) {
        const match = route.matchFn(path);
        if (match) {
            setParamsCache(match.params);
            return <route.component key={route.path}/>;
        }
    }
    
    throw new Error(`No route found for path: ${path}`);
}