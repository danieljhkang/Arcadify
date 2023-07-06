import React, { useEffect, useState } from 'react';
import FileSaver, { saveAs } from 'file-saver';
import domtoimage from 'dom-to-image';
import GetTopSongs from "../components/GetTopSongs";
import GetUsername from "../components/GetUsername";
import machineTemplate from "../assets/arcadifyMachine.svg";
import leftArrow from "../assets/leftArrow.png";
import rightArrow from "../assets/rightArrow.png";


const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000";
const SPACE_DELIMITER = "%20";
const SCOPES = ["user-top-read user-read-email user-read-private"]; //i can access users top artists/songs through this scope
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

/*
* returns spotify access token from the redirect link
*/
const getReturnedParamsFromSpotifyAuth = (hash) => {
    const stringAfterHashtag = hash.substring(1);
    const paramsInUrl = stringAfterHashtag.split("&");
    const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
      const [key, value] = currentValue.split("=");
      accumulater[key] = value;
      return accumulater;
    }, {});
  
    return paramsSplitUp;
}

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // determines if the log in button is shown to user
    const [currentTerm, setCurrentTerm] = useState("short_term");
    const [termText, setTermText] = useState("LAST MONTH");
    
    const [currentSubject, setCurrentSubject] = useState("top_tracks");
    const [subjectText, setSubjectText] = useState("TOP TRACKS");
   
    /*
    * determines whether  the log in button is shown based on the user's link
    */
    

    /*
    * takes spotify access token and sets them into localStorage
    */
    useEffect(() => {
        if (window.location.hash) {
        const { access_token, expires_in, token_type } =
            getReturnedParamsFromSpotifyAuth(window.location.hash);

        localStorage.clear();

        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("tokenType", token_type);
        localStorage.setItem("expiresIn", expires_in);
        //FUCK THIS SHIT - access token it loading properly here

        if (window.location.hash){
            setIsLoggedIn(true);
        }else{
            setIsLoggedIn(false);
        }
        console.log("home : " + localStorage.getItem("accessToken"));
        }
    });

    useEffect(()=>{
        localStorage.setItem("term", currentTerm);
    }, [currentTerm]);

    /*
    * Changes the user's link to the spotify login link
    */
    const handleLogin = () => {
        console.log(process.env.REACT_APP_CLIENT_ID);
        window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
    };

    /*
    * Opens a new window to the spotify logout window, closes window, then redirects user back to home page
    */
    const handleLogout = (url) => {
        localStorage.clear();
        const spotifyLogout = window.open(url, 'Spotify Logout', 'width=700,height=500,top=40,left=40');
        setTimeout(function(){
            spotifyLogout.close()
            window.location.href = "http://localhost:3000/";
           },2000);    
    };

    const handleDownload2 = () => {
        domtoimage.toBlob(document.getElementById('captureArea'))
        .then(function (blob) {
            window.saveAs(blob, 'arcadify.png');
        });
    }

    const subjectOptions = ["top_tracks", "top_artists", "top_genres", "user_stats"];

    const handleSetSubjectLeft = () => {
        if(currentSubject == "top_tracks"){
            setCurrentSubject("user_stats");
            setSubjectText("USER STATS");
        }else if(currentSubject == "top_artists"){
            setCurrentSubject("top_tracks");
            setSubjectText("TOP TRACKS");
        }else if(currentSubject == "top_genres"){
            setCurrentSubject("top_artists");
            setSubjectText("TOP ARTISTS");
        }else{
            setCurrentSubject("top_genres");
            setSubjectText("TOP GENRES");
        }
    }

    const handleSetSubjectRight = () => {
        if(currentSubject == "top_tracks"){
            setCurrentSubject("top_artists");
            setSubjectText("TOP ARTISTS");
        }else if(currentSubject == "top_artists"){
            setCurrentSubject("top_genres");
            setSubjectText("TOP GENRES");
        }else if(currentSubject == "top_genres"){
            setCurrentSubject("user_stats");
            setSubjectText("USER STATS");
        }else{
            setCurrentSubject("top_tracks");
            setSubjectText("TOP TRACKS");
        }
    }

    const termOptions = ["short_term", "medium_term", "long_term"];

    const handleSetTermLeft = () => {
        if(currentTerm == "short_term"){
            setCurrentTerm("long_term");
            setTermText("ALL TIME");
        }else if (currentTerm == "medium_term"){
            setCurrentTerm("short_term");
            setTermText("LAST MONTH");
        }else{
            setCurrentTerm("medium_term");
            setTermText("LAST 6 MONTHS");
        }
        localStorage.setItem("term", currentTerm);
    }

    const handleSetTermRight = () => {
        if(currentTerm == "medium_term"){
            setCurrentTerm("long_term");
            setTermText("ALL TIME");
        }else if (currentTerm == "long_term"){
            setCurrentTerm("short_term");
            setTermText("LAST MONTH");
        }else{
            setCurrentTerm("medium_term");
            setTermText("LAST 6 MONTHS");
        }
        localStorage.setItem("term", currentTerm);
    }

    return(
        <>
            { !isLoggedIn && (<h1 className="homeText">Enter your favorite music arcade.</h1>)}
            { !isLoggedIn && ( <button onClick={handleLogin} className="spotifyButton"><span>Spotify Login</span></button> )}
            { isLoggedIn &&
                <div id="selectorArea1">
                <button id = "leftArrow" onClick={handleSetSubjectLeft}><img id="leftArrowImg"src={leftArrow}></img></button>
                <p id="selectionText">{subjectText}</p>
                <button id = "rightArrow" onClick={handleSetSubjectRight}><img id="rightArrowImg"src={rightArrow}></img></button>
            </div>
            }
            { isLoggedIn &&
                <div id="selectorArea2">
                <button id = "leftArrow" onClick={handleSetTermLeft}><img id="leftArrowImg"src={leftArrow}></img></button>
                <p id="selectionText">{termText}</p>
                <button id = "rightArrow" onClick={handleSetTermRight}><img id="rightArrowImg"src={rightArrow}></img></button>
            </div>
            }
            <div id="captureArea">
                { isLoggedIn && (<GetTopSongs termProp = {{curTerm: {currentTerm}, termText: {termText}}} />)}
                { isLoggedIn && (<GetUsername />)}
                { isLoggedIn && (<img className="machineTemplate"src={machineTemplate}/>)}
            </div>
            
            <br/>
            { isLoggedIn && 
                (<button className="spotifyButton" onClick={handleDownload2} >Download Image</button>)}
            <br/>
            { isLoggedIn && 
            (<button className="spotifyButton" role="link" onClick={()=> handleLogout("https://accounts.spotify.com/en/logout")}>Log Out</button>)}
        </>
    )
}

export default Home;