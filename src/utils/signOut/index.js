import {
    Auth
} from "@/firebase/auth";

export default function signOut(route, router) {
    Auth.signOut().then(() => {
        if (!route.query.go || route.path !== '/login') {
            router.replace({
                path: '/login',
                query: {
                    go: route.fullPath,
                },
            });
        }
    });
}