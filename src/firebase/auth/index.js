import firebase from '../';
import 'firebase/auth';

const auth = firebase.auth,
    Auth = auth();

export {
    auth,
    Auth
};