import firebase from '../'
import 'firebase/storage';

const storage = firebase.storage,
    Storage = storage();

export {
    storage,
    Storage
};

