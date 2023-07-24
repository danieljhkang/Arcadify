import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import machineTemplateGreen from "../assets/arcadifyMachine-green.png";
import machineTemplateBlue from "../assets/arcadifyMachine-blue.png";
import machineTemplateRed from "../assets/arcadifyMachine-red.png";
import machineTemplateYellow from "../assets/arcadifyMachine-yellow.png";
import machineTemplatePurple from "../assets/arcadifyMachine-purple.png";
import machineTemplatePink from "../assets/arcadifyMachine-pink.png";
import machineTemplateWhite from "../assets/arcadifyMachine-white.png";
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

// "https://arcadify.netlify.app/"
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000";
const SPACE_DELIMITER = "%20";
const SCOPES = ["user-top-read user-read-email"]; //i can access users top artists/songs through this scope
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

    const [day, setDay] = useState();
    const [month, setMonth] = useState();
    const [year, setYear] = useState();

    const [machineImage, setMachineImage] = useState(machineTemplateGreen);
    
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
        getDates();
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
            window.location.href = "http://localhost:3000";
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

    /*
    * Gets today's dates
    */
    const getDates = () => {
        const current = new Date();
        let finalMonth;
        let finalDay;
        
        if(current.getMonth() < 10){
            let temp = current.getMonth() + 1;
            finalMonth = "0" + temp.toString();
        }else{
            let temp = current.getMonth() + 1; 
            finalMonth = temp.toString();
        }
        if(current.getDate() < 10){
            let temp = current.getDate();
            finalDay = "0" + temp.toString();
        }else{
            let temp = current.getDate(); 
            finalDay = temp.toString();
        }
        setDay(finalDay);
        setMonth(finalMonth);
        setYear(current.getFullYear());
    }

    const handleColorGreen = () => {
        setMachineImage(machineTemplateGreen);
    }
    const handleColorBlue = () => {
        setMachineImage(machineTemplateBlue);
    }
    const handleColorRed = () => {
        setMachineImage(machineTemplateRed);
    }
    const handleColorYellow = () => {
        setMachineImage(machineTemplateYellow);
    }
    const handleColorPurple = () => {
        setMachineImage(machineTemplatePurple);
    }
    const handleColorPink = () => {
        setMachineImage(machineTemplatePink);
    }
    const handleColorWhite = () => {
        setMachineImage(machineTemplateWhite);
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
                { isLoggedIn && 
                    <>
                        <p id = "dayTag">DAY</p>
                        <p id = "monthTag">MONTH</p>
                        <p id = "yearTag">YEAR</p>
                        <p id = "dayVal">{day}</p>
                        <p id = "monthVal">{month}</p>
                        <p id = "yearVal">{year}</p>
                        <p id="termDisplay">{termText}</p>
                    </> }
                { isLoggedIn && (currentSubject === "top_tracks" || currentSubject === "top_artists" || currentSubject === "top_genres")
                    && 
                    <>
                        <p id="hs-text">HIGH SCORES</p>
                        <div id="left-column">
                            <p id="leaderboard-item">TOP</p>
                            <p id="leaderboard-item">2ND</p>
                            <p id="leaderboard-item">3RD</p>
                            <p id="leaderboard-item">4TH</p>
                            <p id="leaderboard-item">5TH</p>
                            <p id="leaderboard-item">6TH</p>
                            <p id="leaderboard-item">7TH</p>
                            <p id="leaderboard-item">8TH</p>
                        </div>
                    </>
                }
                { isLoggedIn && currentSubject === "top_tracks" && (<GetTopSongs termProp = {{curTerm: {currentTerm}}} />)}
                { isLoggedIn && currentSubject === "top_artists" && (<GetTopArtists termProp = {{curTerm: {currentTerm}}} />)}
                { isLoggedIn && currentSubject === "top_genres" && (<GetTopGenres termProp = {{curTerm: {currentTerm}}} />)}
                { isLoggedIn && currentSubject === "user_stats" && (<GetUserStats termProp = {{curTerm: {currentTerm}}} />)}
                { isLoggedIn && (<img className="machineTemplate"src={machineImage} alt="arcadeMachine"/>)}
            </div>

            {
                isLoggedIn && 
                <div>
                    <button id='colorSelect-green' onClick={handleColorGreen}></button>
                    <button id='colorSelect-blue' onClick={handleColorBlue}></button>
                    <button id='colorSelect-red' onClick={handleColorRed}></button>
                    <button id='colorSelect-yellow' onClick={handleColorYellow}></button>
                    <button id='colorSelect-purple' onClick={handleColorPurple}></button>
                    <button id='colorSelect-pink' onClick={handleColorPink}></button>
                    <button id='colorSelect-white' onClick={handleColorWhite}></button>
                </div>
            }
            
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