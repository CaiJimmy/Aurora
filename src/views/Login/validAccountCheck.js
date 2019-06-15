import {
    Firestore,
    firestore
} from '@/firebase/firestore';
import {
    Auth
} from '@/firebase/auth';

import store from '@/store/';

/**
 * Check if the account used for login is valid
 * 
 * @returns {Boolean} Boolean which indicates account is valid or not
 */
async function validAccountCheck () {
    const user = Auth.currentUser,
        userRef = Firestore.collection('users').doc(user.email);

    let validUser = true;

    let userDoc = await userRef.get().catch(() => validUser = false),
        newUserDoc = {
            'displayName': user.displayName.toLocaleUpperCase(),
            'photoURL': user.photoURL,
            'lastLogin': firestore.FieldValue.serverTimestamp()
        };

    if (!validUser) {
        // Not a white-listed domain
        return validUser;
    }

    if (!userDoc.exists || !userDoc.data().hasOwnProperty('role')) {
        /// If user does not exists, or it's profile doc doesn't have `role` defined, set it to config.login.defaultRole`
        newUserDoc.role = store.getters['config/merged'].login.defaultRole;
    }

    await userRef.set(newUserDoc, {
        merge: true
    });

    return validUser;
}

export default validAccountCheck;