const userUtil = function userUtil (userObject) {
    return {
        isAdmin () {
            return userObject.role == 'administrator'
        },
        isStudent () {
            return userObject.role == 'student'
        }
    }
}

export default userUtil;