import {
    Firestore,
    firestore
} from '@/firebase/firestore';
import {
    Auth
} from '@/firebase/auth';

import Console from '@/utils/Console';

/**
 * Check if the account used for login is valid
 * 
 * @returns {Promise} Boolean which indicates account is valid or not
 */
function validAccountCheck() {
    const user = Auth.currentUser;

    return Firestore.collection('users').doc(user.email).set({
        'displayName': user.displayName.toLocaleUpperCase(),
        'photoURL': user.photoURL,
        'lastLogin': firestore.FieldValue.serverTimestamp()
    }, {
        merge: true
    }).then(() => {
        return true;
    }).catch((err) => { // Not a while-listed domain
        Console.error(err);
        return false;
    });
}

export default validAccountCheck;