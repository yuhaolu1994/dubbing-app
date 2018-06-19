export const config = {
    header: {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    },
    api: {
        base: 'http://rapapi.org/mockjs/34769/',
        creations: 'api/creations',
        comment: 'api/comments',
        up: 'api/up',
        register: 'api/u/signup',
        verify: 'api/u/verify',
        signature: 'api/signature',
        update: 'api/u/update'
    }
};