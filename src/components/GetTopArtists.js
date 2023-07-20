import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import GetUsername from "./GetUsername";

const GetTopArtists = (termProp) => {
    //term can be "short_term", "medium_term", or "long_term"
    const TERM = termProp.termProp.curTerm.currentTerm;
    const ARTISTS_ENDPOINT = `https://api.spotify.com/v1/me/top/artists?limit=8&time_range=${TERM}`; // endpoint = api?, Route to get information from


    const [token, setToken] = useState('');
    // const [data, setData] = useState({}); //this data is from spotify
    const [mount, setMount] = useState(false); //boolean to control the number of calls
    const [clippedData, setClippedData] = useState([]);
    const [popScoreData, setPopScoreData] = useState([])
    const [totalScore, setTotalScore] = useState(0);
    const [linkData, setLinkData] = useState([]); // URLs for the artist's spotify link
;
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
    //empty dependencies array = only runs once when app is opened
   
    let itemArray;
    /*
    * Axios API call to spotify API using the access token
    * Sets the data as the response that is received
    */
    const handleGetTopArtists = () => {
        axios.get(ARTISTS_ENDPOINT, {
        headers: {
            Authorization: "Bearer " + token,
        }
        }).then(response => {
            // setData(response.data);
            itemArray = response.data.items;
            handleGetPopScore();
            titleCharacterLimiter();
        })
        .catch((error) => {
            console.log(error);
        });
    };

    /*
    Gets popularity score of each artist...BUT SPOTIFY API SAY NOOOOO
    */
    const handleGetPopScore = () => {
        let popScoreArray = []; 
        let totalScore = 0;
        for(let i = 0; i < 8; i++){
            let indivData = itemArray[i];
            let indivScore = (i+2) * 100 + indivData.popularity;
            popScoreArray.push(indivScore);
            totalScore += indivScore;
        }
        setPopScoreData(popScoreArray);
        setTotalScore(totalScore);
    }

    /*
    * Takes object received from response.data then limits the track title to 18 characters
    * In this case, it would be the name of the artists
    */
    const titleCharacterLimiter = () => {
        let titleArray = [];
        let linkArray = [];
        for(let i = 0; i < 8; i++){
            let indivData = itemArray[i];
            let indivName = indivData.name
            indivName = indivName.substring(0,18);
            titleArray.push(indivName);
            linkArray.push(indivData.external_urls.spotify);
        }
        setClippedData(titleArray);
        setLinkData(linkArray);
    }

    /*
    * handleGetTopSongs was restricted to being called when mount changes
    * Due to being called too early which lead to 2 total calls, the first being a 400 error
    * Boolean value mount allows the function call to skip the first call
    */
    useEffect(() => {
        if (mount){
            handleGetTopArtists();
        }
    }, [mount, TERM]);

    return(
        <>  
            <p id="hs-text">HIGH SCORES</p>
            <div id="leaderboard-view">
                <p id="leaderboard-item">TOP</p>
                <p id="leaderboard-item">2ND</p>
                <p id="leaderboard-item">3RD</p>
                <p id="leaderboard-item">4TH</p>
                <p id="leaderboard-item">5TH</p>
                <p id="leaderboard-item">6TH</p>
                <p id="leaderboard-item">7TH</p>
                <p id="leaderboard-item">8TH</p>
            </div>
            <div id="main-view">
                <a id="artistOrGenreOnly-item" href={linkData[0]}>{clippedData[0]}</a> 
                <br/>  
                <a id="artistOrGenreOnly-item" href={linkData[1]}>{clippedData[1]}</a>  
                <br/>            
                <a id="artistOrGenreOnly-item" href={linkData[2]}>{clippedData[2]}</a> 
                <br/> 
                <a id="artistOrGenreOnly-item" href={linkData[3]}>{clippedData[3]}</a> 
                <br/> 
                <a id="artistOrGenreOnly-item" href={linkData[4]}>{clippedData[4]}</a> 
                <br/> 
                <a id="artistOrGenreOnly-item" href={linkData[5]}>{clippedData[5]}</a> 
                <br/> 
                <a id="artistOrGenreOnly-item" href={linkData[6]}>{clippedData[6]}</a>
                <br/> 
                <a id="artistOrGenreOnly-item" href={linkData[7]}>{clippedData[7]}</a>  
            </div>
            <div id="popScore-view">
                <p id="popScore-item">{popScoreData[7]}</p>
                <p id="popScore-item">{popScoreData[6]}</p>
                <p id="popScore-item">{popScoreData[5]}</p>
                <p id="popScore-item">{popScoreData[4]}</p>
                <p id="popScore-item">{popScoreData[3]}</p>
                <p id="popScore-item">{popScoreData[2]}</p>
                <p id="popScore-item">{popScoreData[1]}</p>
                <p id="popScore-item">{popScoreData[0]}</p>
            </div>
            <GetUsername />
            <p id="total-text">TOTAL : {totalScore}</p>
        </>
    )
}


export default GetTopArtists;

