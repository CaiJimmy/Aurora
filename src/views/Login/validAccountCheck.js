import {
    Firestore
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

    return Firestore.collection('users').doc(user.uid).set({
        'displayName': user.displayName,
        'email': user.email,
        'photoURL': user.photoURL
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