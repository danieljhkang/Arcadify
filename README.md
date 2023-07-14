# Arcadify

Arcadify is an open source program that creates an arcade graphic based on your most listened Spotify songs, artists, and genres.

This application can be viewed at ...

Inspired by Receiptify.

# Running the app locally : 

This app runs on Node.js. Install Node.js and npm,
then clone the repository and install all its dependencies
using :
```
$ npm install
```

# Using the Spotify API :
In order to pull data from the Spotify API, you first have to have
a Spotify account and register your app there on the Developers
page. After that, you'll have to get different credentials.

Change the redirect URI to your localhost.

Then insert your own CLIENT_ID, REDIRECT_URL_AFTER_LOGIN, and
REACT_APP_CLIENT_ID into Home.js

Run the app by going to the root folder and using : 
```
$ npm start
```

Finally, open http://localhost:3000 in a browser to view the app.