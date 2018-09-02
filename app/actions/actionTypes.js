// It's better to use strings for type than Symbols because strings are serializable.
// Types should typically be defined as string constants.

// app start up
export const APP_BOOTED = 'APP_BOOTED';
export const ENTER_SLIDE = 'ENTER_SLIDE';
export const WILL_ENTER_APP = 'WILL_ENTER_APP';

export const USER_LOGINED = 'USER_LOGINED';
export const USER_UPDATED = 'USER_UPDATED';
export const USER_LOGOUT = 'USER_LOGOUT';



// alert message
export const SHOW_ALERT = 'SHOW_ALERT';
export const HIDE_ALERT = 'HIDE_ALERT';

// creation video list
export const FETCH_CREATIONS_START = 'FETCH_CREATIONS_START';
export const FETCH_CREATIONS_FULLFILLED = 'FETCH_CREATIONS_FULLFILLED';
export const FETCH_CREATIONS_REJECTED = 'FETCH_CREATIONS_REJECTED';

// creation comment list
export const FETCH_COMMENTS_START = 'FETCH_COMMENTS_START';
export const FETCH_COMMENTS_FULLFILLED = 'FETCH_COMMENTS_FULLFILLED';
export const FETCH_COMMENTS_REJECTED = 'FETCH_COMMENTS_REJECTED';

// send comment
export const SEND_COMMENTS_START = 'SEND_COMMENTS_START';
export const SEND_COMMENTS_FULLFILLED = 'SEND_COMMENTS_FULLFILLED';
export const SEND_COMMENTS_REJECTED = 'SEND_COMMENTS_REJECTED';











