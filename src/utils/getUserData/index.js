import store from '@/store';

export default function getUserData (userEmail) {
    if (!userEmail) {
        return;
    }

    /// Start fetching in case it has not been triggered, like when it's a new question
    if (!store.state.users.hasOwnProperty(userEmail)) {
        store.dispatch('users/requestUser', userEmail);
    }

    return store.state.users[userEmail];
}