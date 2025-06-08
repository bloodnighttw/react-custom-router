import { runToPathWithCache } from "./cache";
import type { Router, RouterParams } from "./router";

interface Prop<T extends string> {
    to: Router<T>;
    params: RouterParams<T>;
    children?: React.ReactNode;
}

export default function Link<T extends string>({ to: router, params, children }: Prop<T>) {

    const path = runToPathWithCache(router, params);

    return <a onClick={(e)=> {
        e.preventDefault();
        window.history.pushState({}, "", path);
        window.dispatchEvent(new PopStateEvent("popstate"));
    }}>{children}</a>;
}