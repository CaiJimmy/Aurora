import firebase from '../'
import 'firebase/firestore';

const firestore = firebase.firestore,
    Firestore = firestore();

Firestore.settings({
    timestampsInSnapshots: true
});

export {
    firestore,
    Firestore
}