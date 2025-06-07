import { useSyncExternalStore } from 'react';


const getCurrentPath = () => window.location.pathname;

// This function is a placeholder for server-side rendering.
const getCurrentPathFromServer = () => {
    throw new Error("The server-side pre-/rendering is not implemented yet in useRouter!")
};

const subscribe = (callback: () => void) => {
    window.addEventListener('popstate', callback);
    return () => {
        window.removeEventListener('popstate', callback);
    };
};

export const useRouter = () => {
    return useSyncExternalStore(subscribe, getCurrentPath, getCurrentPathFromServer);
};

