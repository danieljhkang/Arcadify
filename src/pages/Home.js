import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import machineTemplate from "../assets/arcadifyMachine.png";
import leftArrow from "../assets/leftArrow.png";
import rightArrow from "../assets/rightArrow.png";
import downArrow from "../assets/downArrow.png";
import upArrow from "../assets/upArrow.png";
import GetTopSongs from "../components/GetTopSongs";
import GetTopArtists from '../components/GetTopArtists';
import GetTopGenres from '../components/GetTopGenres';
import GetUserStats from '../components/GetUserStats';
import GetTrackExtension from '../components/GetTrackExtension';
import GetArtistExtension from '../components/GetArtistExtension';
import GetGenreExtension from '../components/GetGenreExtension';
import GetUserExtension from '../components/GetUserExtension';


const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = "https://arcadify.netlify.app/";
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

    const [isExtended, setIsExtended] = useState(false);
    
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
        //access token it loading properly here

        /*
        * determines whether  the log in button is shown based on the user's link
        */
        if (window.location.hash){
            setIsLoggedIn(true);
        }else{
            setIsLoggedIn(false);
        }
        }
    },[]);

    useEffect(()=>{
        localStorage.setItem("term", currentTerm);
    }, [currentTerm]);

    /*
    * Changes the user's link to the spotify login link
    */
    const handleLogin = () => {
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


    /*
    * Takes the #captureArea container, produces a png image, then downloads it
    */
    const handleDownload = (event) => {
        // Select the <body> element to capture full page.
        html2canvas(document.querySelector('#captureArea'),{
            allowTaint: true,
            useCORS: true,
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.offsetHeight
        }).then(canvas => {
                canvas.style.display = 'none'
                document.body.appendChild(canvas)
                return canvas
            })
            .then(canvas => {
                const image = canvas.toDataURL('image/png')
                const a = document.createElement('a')
                a.setAttribute('download', 'arcadify.png')
                a.setAttribute('href', image)
                a.click()
                canvas.remove()
            })
    }
    
    /*
    * Moves the subject option to the left
    */
    const handleSetSubjectLeft = () => {
        if(currentSubject === "top_tracks"){
            setCurrentSubject("user_stats");
            setSubjectText("USER STATS");
        }else if(currentSubject === "top_artists"){
            setCurrentSubject("top_tracks");
            setSubjectText("TOP TRACKS");
        }else if(currentSubject === "top_genres"){
            setCurrentSubject("top_artists");
            setSubjectText("TOP ARTISTS");
        }else{
            setCurrentSubject("top_genres");
            setSubjectText("TOP GENRES");
        }
    }

    /*
    * Moves the subject option to the right
    */
    const handleSetSubjectRight = () => {
        if(currentSubject === "top_tracks"){
            setCurrentSubject("top_artists");
            setSubjectText("TOP ARTISTS");
        }else if(currentSubject === "top_artists"){
            setCurrentSubject("top_genres");
            setSubjectText("TOP GENRES");
        }else if(currentSubject === "top_genres"){
            setCurrentSubject("user_stats");
            setSubjectText("USER STATS");
        }else{
            setCurrentSubject("top_tracks");
            setSubjectText("TOP TRACKS");
        }
    }

    /*
    * Moves the term option to the left
    */
    const handleSetTermLeft = () => {
        if(currentTerm === "short_term"){
            setCurrentTerm("long_term");
            setTermText("ALL TIME");
        }else if (currentTerm === "medium_term"){
            setCurrentTerm("short_term");
            setTermText("LAST MONTH");
        }else{
            setCurrentTerm("medium_term");
            setTermText("LAST 6 MONTHS");
        }
        localStorage.setItem("term", currentTerm);
    }

    /*
    * Moves the term option to the right
    */
    const handleSetTermRight = () => {
        if(currentTerm === "medium_term"){
            setCurrentTerm("long_term");
            setTermText("ALL TIME");
        }else if (currentTerm === "long_term"){
            setCurrentTerm("short_term");
            setTermText("LAST MONTH");
        }else{
            setCurrentTerm("medium_term");
            setTermText("LAST 6 MONTHS");
        }
        localStorage.setItem("term", currentTerm);
    }

    //will check off a boolean that allows the extension component to show
    const handleExtend = () => {
        setIsExtended(!isExtended);
    }

    return(
        <>
            { !isLoggedIn && (<h1 className="homeText">Enter your favorite music arcade.</h1>)}
            { !isLoggedIn && ( <button onClick={handleLogin} className="spotifyButton"><span>Spotify Login</span></button> )}
            { isLoggedIn &&
                <div id="selectorArea1">
                <button className="arrow" onClick={handleSetSubjectLeft}><img className="arrowImg"src={leftArrow} alt="leftArrow"></img></button>
                <p id="selectionText">{subjectText}</p>
                <button className= "arrow" onClick={handleSetSubjectRight}><img className="arrowImg"src={rightArrow}alt="rightArrow"></img></button>
            </div>
            }
            { isLoggedIn &&
                <div id="selectorArea2">
                <button className="arrow" onClick={handleSetTermLeft}><img className="arrowImg"src={leftArrow}alt="leftArrow"></img></button>
                <p id="selectionText">{termText}</p>
                <button className= "arrow" onClick={handleSetTermRight}><img className="arrowImg"src={rightArrow}alt="rightArrow"></img></button>
            </div>
            }
            <div id="captureArea">
                { isLoggedIn && currentSubject === "top_tracks" && (<GetTopSongs termProp = {{curTerm: {currentTerm}, termText: {termText}}} />)}
                { isLoggedIn && currentSubject === "top_artists" && (<GetTopArtists termProp = {{curTerm: {currentTerm}, termText: {termText}}} />)}
                { isLoggedIn && currentSubject === "top_genres" && (<GetTopGenres termProp = {{curTerm: {currentTerm}, termText: {termText}}} />)}
                { isLoggedIn && currentSubject === "user_stats" && (<GetUserStats termProp = {{curTerm: {currentTerm}, termText: {termText}}} />)}
                { isLoggedIn && (<img className="machineTemplate"src={machineTemplate} alt="arcadeMachine"/>)}
            </div>
            
            <br/>
            { isLoggedIn && 
                (<button className="spotifyButton" onClick={handleDownload} >Download Image</button>)}
            { isLoggedIn && 
            (<button className="spotifyButton" role="link" onClick={()=> handleLogout("https://accounts.spotify.com/en/logout")}>Log Out</button>)}
            <br/>
            {isLoggedIn && !isExtended &&
                (<div>
                    <p id="selectionText">CURIOUS ABOUT THE REST?</p>
                    <br/>
                    <p id="selectionText">CLICK ARROW TO EXTEND</p>
                    <br/>
                    <button className="arrow" onClick={handleExtend}><img className="arrowImg"src={downArrow}alt="downArrow"></img></button>
                </div>
                
                )}
            {isLoggedIn && isExtended && currentSubject === "top_tracks" &&
                (<div>
                    <GetTrackExtension termProp = {{curTerm: {currentTerm}, termText: {termText}}}/>
                    <br/>
                    <button className="arrow" onClick={handleExtend}><img className="arrowImg"src={upArrow}alt="upArrow"></img></button>
                    <br/>
                    <p id="selectionText">CLICK ARROW TO HIDE</p>
                </div>
                )}
            {isLoggedIn && isExtended && currentSubject === "top_artists" &&
                (<div>
                    <GetArtistExtension termProp = {{curTerm: {currentTerm}, termText: {termText}}}/>
                    <br/>
                    <button className="arrow" onClick={handleExtend}><img className="arrowImg"src={upArrow}alt="upArrow"></img></button>
                    <br/>
                    <p id="selectionText">CLICK ARROW TO HIDE</p>
                </div>
                )}
            {isLoggedIn && isExtended && currentSubject === "top_genres" &&
                (<div>
                    <GetGenreExtension termProp = {{curTerm: {currentTerm}, termText: {termText}}}/>
                    <br/>
                    <button className="arrow" onClick={handleExtend}><img className="arrowImg"src={upArrow}alt="upArrow"></img></button>
                    <br/>
                    <p id="selectionText">CLICK ARROW TO HIDE</p>
                </div>
                )}
            {isLoggedIn && isExtended && currentSubject === "user_stats" &&
                (<div>
                    <GetUserExtension termProp = {{curTerm: {currentTerm}, termText: {termText}}}/>
                    <br/>
                    <button className="arrow" onClick={handleExtend}><img className="arrowImg"src={upArrow}alt="upArrow"></img></button>
                    <br/>
                    <p id="selectionText">CLICK ARROW TO HIDE</p>
                </div>
                )}
        </>
    )
}

export default Home;