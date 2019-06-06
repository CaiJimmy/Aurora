import firebase from '../'
import 'firebase/firestore';

const firestore = firebase.firestore,
    Firestore = firestore();

export {
    firestore,
    Firestore
}