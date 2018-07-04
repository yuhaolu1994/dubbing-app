export const config = {
    header: {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    },
    backup: {
        avatar: 'http://res.cloudinary.com/dubbingapp/image/upload/v1530224129/avatar/bvncnyzfd7xzcdhahdss.jpg'
    },
    qiniu: {
        upload: 'http://up.qiniu.com',
        video: 'http://pb48cggiq.bkt.clouddn.com/',
        thumb: 'http://pb48cggiq.bkt.clouddn.com/',
        avatar: 'http://pb3k12o07.bkt.clouddn.com/',
    },
    cloudinary: {
        cloud_name: 'dubbingapp',
        api_key: '159272366345356',
        api_secret: 'uR5Nx38KZ6w-PTpju1KAcxZrVdA',
        base: 'http://res.cloudinary.com/dubbingapp',
        image: 'https://api.cloudinary.com/v1_1/dubbingapp/image/upload',
        video: 'https://api.cloudinary.com/v1_1/dubbingapp/video/upload',
        audio: 'https://api.cloudinary.com/v1_1/dubbingapp/raw/upload',
    },
    api: {
        // base: 'http://rapapi.org/mockjs/34769/',
        base: 'http://192.168.0.10:3000/',
        creations: 'api/creations',
        comment: 'api/comments',
        up: 'api/up',
        register: 'api/u/signup',
        verify: 'api/u/verify',
        signature: 'api/signature',
        update: 'api/u/update',
        video: 'api/creations/video',
        audio: 'api/creations/audio'
    }
};