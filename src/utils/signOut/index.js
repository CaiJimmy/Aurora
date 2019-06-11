import {
    Auth
} from "@/firebase/auth";

export default function signOut (route, router) {
    /**
     *  Sign out user, redirect to /login and refresh page
     *  This is a easy way to reset all Vuex state, and unbind all modules
    */
   
    Auth.signOut().then(() => {
        router.push({
            path: '/login'
        });
        router.go();
    });
}