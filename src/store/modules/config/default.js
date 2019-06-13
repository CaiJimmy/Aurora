const defaultConfig = {
    siteName: 'Aurora',
    logo: 'https://i.imgur.com/wu5BCXq.png',
    login: {
        background: 'https://i.imgur.com/a0cAhUZ.jpg',
        defaultRole: 'student'
    },
    theme: {
        primary: '#1976D2',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
    },
    snackbar: {
        position: {
            x: 'left',
            y: 'bottom'
        },
        timeout: 5000
    },
    topic: {
        question_per_page: 10,   /* Number of questions per page */
        displayAuthorData: false,   /* Display question author data (name and email adress) for everyone. */
        questionEditable: true,  /* Question editable by author after being published */
        questionRemovable: false, /* Question removable by author after being published */
        defaultHeaderImage: 'https://source.unsplash.com/1000x1000/?technology',
        headerImageMaxWidth: 1000
    }
}

export default defaultConfig;