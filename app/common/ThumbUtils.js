import {config} from "./Config";

export const thumb = (key) => {
    if (key.indexOf('http') > -1) return key;

    return config.qiniu.thumb + key;
};

export const avatar = (key) => {
    if (!key) {
        return config.backup.avatar;
    }
    if (key.indexOf('http') > -1) return key;
    
    if (key.indexOf('data:image') > -1) return key;

    if (key.indexOf('avatar/') > -1) {
        return config.cloudinary.base + '/image/upload/' + key;
    }

    return config.qiniu.avatar + key;
};

export const video = (key) => {
    if (key.indexOf('http') > -1) return key;

    if (key.indexOf('video/') > -1) {
        return config.cloudinary.base + '/video/upload/' + key;
    }

    return config.qiniu.video + key;
};