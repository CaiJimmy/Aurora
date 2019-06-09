import {
    Storage
} from '@/firebase/storage';

export default function uploadFile (file, path) {
    console.log(file);
    let storageRef = Storage.ref(path || ("/" + file.name)),
        metadata = {
            contentType: file.type
        };

    return storageRef
        .put(file, metadata)
        .then((snapshot) => snapshot.ref.getDownloadURL());
}