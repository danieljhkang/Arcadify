import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const GetUserStats = (termProp) => {
    //term can be "short_term", "medium_term", or "long_term"
    const TERM = termProp.termProp.curTerm.currentTerm;
    const termDisplay = termProp.termProp.termText.termText;

    const USER_ENDPOINT = "https://api.spotify.com/v1/me";
    const ARTISTS_ENDPOINT = `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${TERM}`; // endpoint = api?, Route to get information from
    const TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${TERM}`; // endpoint = api?, Route to get information from
    

    const [token, setToken] = useState('');
    const [mount, setMount] = useState(false); //boolean to control the number of calls
    const [day, setDay] = useState();
    const [month, setMonth] = useState();
    const [year, setYear] = useState();
    const [userName, setUserName] = useState('');
    const [userName2, setUserName2] = useState('');
    const [profImgURL, setProfImgURL] = useState('');
    const [countryName, setCountryName] = useState('');
    const [popArtURL, setPopArtURL] = useState('');
    const [obsArtURL, setObsArtURL] = useState('');
    const [popTrackURL, setPopTrackURL] = useState('');
    const [obsTrackURL, setObsTrackURL] = useState('');
    const [musicScore, setMusicScore] = useState(0);
    
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
            getDates();
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
            getPopArtist();
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
            getPopTrack();
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const getObscurities = async () => {
        await handleGetObscurity();
        await handleGetObscurity2();

        let finalScore = (10-((await getPopArtist() + await getPopTrack())/1000)).toFixed(2);
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
    * Gets the top 50 artists, organizes by popularity
    */
    const getPopArtist = async() => {
        let artistMap = new Map();
        for(let i = 0; i < 50; i++){
            let indivData = itemArray[i];
            artistMap.set(indivData.images[1].url, indivData.popularity);
        }
        const sortedMap = new Map([...artistMap.entries()].sort((a, b) => b[1] - a[1])); //sorts the map by value

        //the most popular artist
        setPopArtURL(Array.from(sortedMap.keys())[0]);
    
        //the most obscure artist
        setObsArtURL(Array.from(sortedMap.keys()).pop());

        //gets all the popularity scores and puts into array
        const popScores = Array.from(sortedMap.values());
        let scoreSum = popScores.reduce((a, b) => a + b, 0);
        return scoreSum;
    }

    /*
    * Gets the top 50 tracks, organizes by popularity
    */
    const getPopTrack = async() => {
        let trackMap = new Map();
        for(let i = 0; i < 50; i++){
            let indivData = itemArray2[i];
            trackMap.set(indivData.album.images[1].url, indivData.popularity);
        }
        const sortedMap = new Map([...trackMap.entries()].sort((a, b) => b[1] - a[1])); //sorts the map by value

        //the most popular track
        setPopTrackURL(Array.from(sortedMap.keys())[0]);
    
        //the most obscure track
        setObsTrackURL(Array.from(sortedMap.keys()).pop());

        //gets all the popularity scores and puts into array
        const popScores = Array.from(sortedMap.values());
        let scoreSum = popScores.reduce((a, b) => a + b, 0);
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
    * Gets current date
    */
    const getDates = () => {
        const current = new Date();
        let finalMonth;
        let finalDay;
        
        if(current.getMonth() < 9){
            let temp = current.getMonth() + 1;
            finalMonth = "0" + temp.toString();
        }else{
            let temp = current.getMonth() + 1; 
            finalMonth = temp.toString;
        }
        if(current.getDay() < 10){
            let temp = current.getDate();
            finalDay = "0" + temp.toString();
        }else{
            let temp = current.getDate(); 
            finalDay = temp.toString;
        }
        setDay(finalDay);
        setMonth(finalMonth);
        setYear(current.getFullYear());
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
        <p id="termDisplay">{termDisplay}</p>
        <img id="prof-image" src={profImgURL} alt ="user profile"></img>
        <p id = "countryName">{countryName}</p>
        <p id = "dayTag">DAY</p>
        <p id = "monthTag">MONTH</p>
        <p id = "yearTag">YEAR</p>
        <p id = "dayVal">{day}</p>
        <p id = "monthVal">{month}</p>
        <p id = "yearVal">{year}</p>
        <p id = "userStatName">{userName}</p>  
        <p id = "userStatName2">{userName2}</p>  
        <img id="popArtImg" src={popArtURL} alt="popular artist"></img>
        <img id="obsArtImg" src={obsArtURL} alt="obscure artist"></img>
        <img id="popTrkImg" src={popTrackURL} alt="popular track"></img>
        <img id="obsTrkImg" src={obsTrackURL} alt="obscure track"></img>
        <p id="obs_score">{musicScore}/10</p>

        <p id = "userStatTitle1">MUSIC OBSCURITY</p>
        <p id = "userStatTitle2">MOST<br/>POPULAR<br/>ARTIST</p>
        <p id = "userStatTitle3">MOST<br/>UNDERGROUND<br/>ARTIST</p>
        <p id = "userStatTitle4">MOST<br/>POPULAR<br/>TRACK</p>
        <p id = "userStatTitle5">MOST<br/>UNDERGROUND<br/>TRACK</p>
    </>)
}

export default GetUserStats;