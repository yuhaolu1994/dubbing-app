# AwesomeDubbing
![](https://github.com/yuhaolu1994/DubbingApp/blob/master/android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png)

## Introduction
This mobile app is developed by Webstorm 2018.1.5. Users can feel free to upload any videos and make their awesome dubbing for the videos. Currently, this mobile app part has been successfully built and run on One Plus 5T, which is running Android 8.1.0

## Abstract
The front end part of a dubbing full-stack project. 
- Combine video and customized audio perfictly
- Upload and enjoy creation list from back-end server
- Feel free to add comments and like or dislike any creations
- Create or edit your personal profile 

## Installation
1. clone this project (https://github.com/yuhaolu1994/DubbingApp)
2. cd DubbingApp
3. connect your android phone, use adb devices to check connection
4. run react-native-run-android in terminal

## Version
`v 2.0`
- use React Redux to refactor the codes

`v 1.5`
- add [back-end](https://github.com/yuhaolu1994/DubbingServer) server in front-end part 
- post or fetch creations and comments to server
- register an account 
- logout from current account

`v 1.4`
- use qiniu cloud and cloudinary as image, audio and video storage services
- use twilio as sms services

`v 1.1`
- use mock.js and [RAP V0.14.16](http://rapapi.org/org/index.do) to mock the fake data
- use react native modal to add comment or edit user profile

## TODO
- [ ] Comment creations directly through home page
- [ ] Deploy the localhost server on the public cloud services such as AWS
- [ ] Add email verification on register page
- [ ] Hot app version update
- [ ] Add tags on creations and classify based on tags
- [ ] Search creations or users

## Project
### Image Storage Services
- [Qiniu](https://www.qiniu.com/en)
- [Cloudinary](https://cloudinary.com)

### Open Source Tools
- [react-navigation](https://www.npmjs.com/package/react-navigation)
- [react-native-image-picker](https://www.npmjs.com/package/react-native-image-picker)
- [react-native-video](https://www.npmjs.com/package/react-native-video)
- [react-native-audio](https://www.npmjs.com/package/react-native-audio)
- [react-native-sound](https://www.npmjs.com/package/react-native-sound)
- [react-native-swiper](https://www.npmjs.com/package/react-native-swiper)
- [react-redux](https://www.npmjs.com/package/react-redux)
- [redux](https://www.npmjs.com/package/redux)
- [redux-actions](https://www.npmjs.com/package/redux-actions)
- [redux-immutable](https://www.npmjs.com/package/redux-immutable)
- [redux-logger](https://www.npmjs.com/package/redux-logger)
- [redux-promise](https://www.npmjs.com/package/redux-promise)
- [redux-thunk](https://www.npmjs.com/package/redux-thunk)

## Architecture
### App register and login
![](https://github.com/yuhaolu1994/DubbingApp/blob/master/art/app_startup.png)

### Data flow in app
![](https://github.com/yuhaolu1994/DubbingApp/blob/master/art/app_dataflow.png)

### Video and audio processing 
![](https://github.com/yuhaolu1994/DubbingApp/blob/master/art/video_audio.png)

## Screenshots
### Check creation list and detail
![](https://github.com/yuhaolu1994/DubbingApp/blob/master/art/new_creation.gif)
![](https://github.com/yuhaolu1994/DubbingApp/blob/master/art/creation_detail.gif)

### Create and upload a new dubbing video
![](https://github.com/yuhaolu1994/DubbingApp/blob/master/art/creation_made.gif)
![](https://github.com/yuhaolu1994/DubbingApp/blob/master/art/creation_post.gif)

### Update account avatar and profile
![](https://github.com/yuhaolu1994/DubbingApp/blob/master/art/account_avatar.gif)
![](https://github.com/yuhaolu1994/DubbingApp/blob/master/art/account_profile.gif)


