import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const GetUserStats = (termProp) => {
    //term can be "short_term", "medium_term", or "long_term"
    const TERM = termProp.termProp.curTerm.currentTerm;

    const USER_ENDPOINT = "https://api.spotify.com/v1/me";
    const ARTISTS_ENDPOINT = `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${TERM}`; // endpoint = api?, Route to get information from
    const TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${TERM}`; // endpoint = api?, Route to get information from
    

    const [token, setToken] = useState('');
    const [mount, setMount] = useState(false); //boolean to control the number of calls
    const [userName, setUserName] = useState('');
    const [userName2, setUserName2] = useState('');
    const [profImgURL, setProfImgURL] = useState('');
    const [countryName, setCountryName] = useState('');
    const [popArtURL, setPopArtURL] = useState('');
    const [obsArtURL, setObsArtURL] = useState('');
    const [popTrackURL, setPopTrackURL] = useState('');
    const [obsTrackURL, setObsTrackURL] = useState('');
    const [musicScore, setMusicScore] = useState(0);
    const [popArtSURL, setPopArtSURL] = useState('');
    const [obsArtSURL, setObsArtSURL] = useState('');
    const [popTrkSURL, setPopTrkSURL] = useState('');
    const [obsTrkSURL, setObsTrkSURL] = useState('');
    
    /*
    * Runs only on the first render
    * Sets token to the accessToken received from localStorage
    */
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            setToken(localStorage.getItem("accessToken"));
        }
        setMount(!mount);
    }, []);

    /*
    * Axios API call to spotify API using the access token
    * Sets the data as the response that is received
    */
    const handleGetUsername = async () => {
        await axios.get(USER_ENDPOINT, {
        headers: {
            Authorization: "Bearer " + token,
        }
        }).then(response => {
            let userData = response.data;
            setProfImgURL(userData.images[1].url);
            setCountryName(formatCountryName(userData.country));         
            setUserName(formatUserName(userData.display_name));
        })
        .catch((error) => {
            console.log(error);
        });
    };

    let itemArray;
    /*
    * Gets the top 50 artists you've listened to, then runs getPopArtist() 
    */
    const handleGetObscurity = async () => {
        await axios.get(ARTISTS_ENDPOINT, {
        headers: {
            Authorization: "Bearer " + token,
        }
        }).then(response => {
            itemArray = response.data.items;
        })
        .catch((error) => {
            console.log(error);
        });
    }

    let itemArray2;
    /*
    * Gets the top 50 tracks you've listened to, then runs getPopTrack() 
    */
    const handleGetObscurity2 = async () => {
        await axios.get(TRACKS_ENDPOINT, {
        headers: {
            Authorization: "Bearer " + token,
        }
        }).then(response => {
            itemArray2 = response.data.items;
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const getObscurities = async () => {
        await handleGetObscurity();
        await handleGetObscurity2();
        let finalScore = (10-((await getPopArtist() + await getPopTrack())/1000)).toFixed(2); // subtract from 10; higher obscurity = higher score
        setMusicScore(finalScore);
    }

    /*
    * Formats country name to 19 characters
    * Sets the country name
    */
    const formatCountryName = (string) => {
        let countryString;
        if(string === "US"){
            countryString = "USA";
        }else{
            if(string.length>19){
                countryString = string.substring(0,19);
            }else{
                countryString = string;
            }
        }

        return countryString;
    }

    /*
    * Filters through the top 50 artists, gets the most popular and obscure artists
    * Gets the image url and spotify urls for the artists
    * Gets part of the total popularity score by adding them up all together
    */
    const getPopArtist = async() => {
        let scoreSum = 0;
        let currentHighest = 0;
        let currentLowest = 100;
        for(let i = 0; i < 50; i++){
            let indivData = itemArray[i];
            if(indivData.popularity > currentHighest){  //most popular artist
                currentHighest = indivData.popularity;
                setPopArtURL(indivData.images[1].url);
                setPopArtSURL(indivData.external_urls.spotify);
            }else if (indivData.popularity < currentLowest){ //most obscure artist
                currentLowest = indivData.popularity;
                setObsArtURL(indivData.images[1].url);
                setObsArtSURL(indivData.external_urls.spotify);
            }
            scoreSum += indivData.popularity;
        }
        return scoreSum;
    }

    /*
    * Filters through the top 50 tracks, gets the most popular and obscure tracks
    * Gets the image url and spotify urls for the tracks
    * Gets part of the total popularity score by adding them up all together
    */
    const getPopTrack = async() => {
        let scoreSum = 0;
        let currentHighest = 0;
        let currentLowest = 100;
        for(let i = 0; i < 50; i++){
            let indivData = itemArray2[i];
            if(indivData.popularity > currentHighest){ //update the image url of most popular song if more popular than current highest
                currentHighest = indivData.popularity;
                setPopTrackURL(indivData.album.images[1].url);
                setPopTrkSURL(indivData.external_urls.spotify);
            }else if (indivData.popularity < currentLowest){
                currentLowest = indivData.popularity;
                setObsTrackURL(indivData.album.images[1].url);
                setObsTrkSURL(indivData.external_urls.spotify);
            }
            scoreSum += indivData.popularity;
        }
        return scoreSum;
    }
    
    

    //first line can only by 16 characters
    const formatUserName = (string) => {
        let line1 = string;
        if(string.length>15){
            line1 = line1.substring(0,15);
            setUserName2(nameTooLong(line1.substring(15,30)));
        }else{
            setUserName2(nameTooLong(" "));
        }
        
        return line1;
    }

    //when the username is longer than 15 characters
    //spotify username limit is 30 characters
    const nameTooLong = (isTooLong) => {
        let line2;
        if(isTooLong === " "){
            line2 = "---"
        }else{
            line2 = isTooLong;
        }
        return line2;
    }

    /*
    * handleGetUsername was restricted to being called when mount changes
    * Due to being called too early which lead to 2 total calls, the first being a 400 error
    * Boolean value mount allows the function call to skip the first call
    */
    useEffect(() => {
        if (mount){
            handleGetUsername();
        }
    }, [mount]);

    /*
    * Refreshes the obscurities by term
    */
    useEffect(() => {
        if (mount){
            getObscurities();
        }
    }, [mount, TERM]);

    return (<>
        <img id="prof-image" src={profImgURL} alt ="user profile"></img>
        <p id = "countryName">{countryName}</p>
        <p id = "userStatName">{userName}</p>  
        <p id = "userStatName2">{userName2}</p>  
        <a href={popArtSURL}>
            <img id="popArtImg" src={popArtURL} alt="popular artist"></img>
        </a>
        <a href={obsArtSURL}>
            <img id="obsArtImg" src={obsArtURL} alt="obscure artist"></img>
        </a>
        <a href={popTrkSURL}>
            <img id="popTrkImg" src={popTrackURL} alt="popular track"></img>
        </a>
        <a href={obsTrkSURL}>
            <img id="obsTrkImg" src={obsTrackURL} alt="obscure track"></img>
        </a>
        <p id="obs_score">{musicScore}/10</p>

        <p id = "userStatTitle1">MUSIC OBSCURITY</p>
        <p id = "userStatTitle2">MOST<br/>POPULAR<br/>ARTIST</p>
        <p id = "userStatTitle3">MOST<br/>UNDERGROUND<br/>ARTIST</p>
        <p id = "userStatTitle4">MOST<br/>POPULAR<br/>TRACK</p>
        <p id = "userStatTitle5">MOST<br/>UNDERGROUND<br/>TRACK</p>
    </>)
}

export default GetUserStats;