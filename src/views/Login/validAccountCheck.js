import {
    Firestore,
    firestore
} from '@/firebase/firestore';
import {
    Auth
} from '@/firebase/auth';

import Console from '@/utils/Console';
import store from '@/store/';

/**
 * Check if the account used for login is valid
 * 
 * @returns {Promise} Boolean which indicates account is valid or not
 */
async function validAccountCheck () {
    const user = Auth.currentUser,
        userRef = Firestore.collection('users').doc(user.email);

    let userDoc = await userRef.get(),
        newUserDoc = {
            'displayName': user.displayName.toLocaleUpperCase(),
            'photoURL': user.photoURL,
            'lastLogin': firestore.FieldValue.serverTimestamp()
        };

    if (!userDoc.exists || !userDoc.data().hasOwnProperty('role')) {
        /// If user does not exists, or it's profile doc doesn't have `role` defined, set it to config.login.defaultRole`
        newUserDoc.role = store.getters['config/merged'].login.defaultRole;
    }

    return userRef.set(newUserDoc, {
        merge: true
    }).then(() => {
        return true;
    }).catch((err) => { // Not a while-listed domain
        Console.error(err);
        return false;
    });
}

export default validAccountCheck;