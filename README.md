This is a quick example to illustrate a question about resizing images with Firebase functions.

### My primary goal:
- Prevent users from taking up too much of my Firebase storage by uploading huge images.

### My current approach:
- Use a Firebase function to check if images are over a certain maximum size when they are uploaded.  If so, resize and overwrite the original file.

### My problem:
- I need to save each image's download URL to Firestore, so I can create image links in my UI and associate images with the user who uploaded them.  When Firebase resizes an image, it changes the download URL, which breaks the image links.

This is a basic React app built with Create React App.  Firebase functions are in the `/functions` directory.