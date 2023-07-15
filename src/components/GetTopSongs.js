import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import GetUsername from "./GetUsername";

const GetTopSongs = (termProp) => {
    //term can be "short_term", "medium_term", or "long_term"
    const TERM = termProp.termProp.curTerm.currentTerm;
    const termDisplay = termProp.termProp.termText.termText;
    const SONGS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?limit=8&time_range=${TERM}`; // endpoint = api?, Route to get information from


    const [token, setToken] = useState('');
    // const [data, setData] = useState({}); //this data is from spotify
    const [mount, setMount] = useState(false); //boolean to control the number of calls
    const [clippedData, setClippedData] = useState([]);
    const [artistData, setArtistData] = useState([]);
    const [popScoreData, setPopScoreData] = useState([])
    const [totalScore, setTotalScore] = useState(0);
    const [linkData, setLinkData] = useState([]); // URLs for the artist's spotify link
    const [linkDataArtist, setLinkDataArtist] = useState([]);
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
    const handleGetTopSongs = () => {
        axios.get(SONGS_ENDPOINT, {
        headers: {
            Authorization: "Bearer " + token,
        }
        }).then(response => {
            // setData(response.data);
            itemArray = response.data.items;
            handleGetPopScore();
            titleCharacterLimiter();
            handleGetArtistNames();
        })
        .catch((error) => {
            console.log(error);
        });
    };

    /*
    Gets popularity score of each song...BUT SPOTIFY API SAY NOOOOO
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

    //item array[8] -> artists array[x]
    const handleGetArtistNames = () => {
        let finalArray = [];
        let artistLinkArray = [];
        for(let i = 0; i < 8; i++){
            let indivData = itemArray[i];
            let artistsArray = indivData.artists; //array containing every artist on song
            //put every artist name in a single string
            let artistString;
            for(let i = 0; i< artistsArray.length;i++){
                if(i!==0){
                    //add a comma
                    artistString += ", ";
                    artistString += artistsArray[i].name;
                }else{
                    artistString = artistsArray[0].name;
                }
            }
            artistLinkArray.push(artistsArray[0].external_urls.spotify);
            // limit each string to 18 characters
            artistString = artistString.substring(0,18);
            // final product
            finalArray.push(artistString);
        }
        setArtistData(finalArray);
        setLinkDataArtist(artistLinkArray);
    }

    /*
    * handleGetTopSongs was restricted to being called when mount changes
    * Due to being called too early which lead to 2 total calls, the first being a 400 error
    * Boolean value mount allows the function call to skip the first call
    */
    useEffect(() => {
        if (mount){
            handleGetTopSongs();
        }
    }, [mount, TERM]);

    return(
        <>  
            <p id="termDisplay">{termDisplay}</p>
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
            <div id="artist-view">
            </div>
            <div id="main-view">
                <a id="songName-item" href={linkData[0]}>{clippedData[0]}</a>  
                <br/> 
                <a id="artist-item" href={linkDataArtist[0]}>{artistData[0]}</a>
                <br/>
                <a id="songName-item" href={linkData[1]}>{clippedData[1]}</a>  
                <br/>            
                <a id="artist-item" href={linkDataArtist[1]}>{artistData[1]}</a>
                <br/> 
                <a id="songName-item" href={linkData[2]}>{clippedData[2]}</a> 
                <br/> 
                <a id="artist-item" href={linkDataArtist[2]}>{artistData[2]}</a>
                <br/> 
                <a id="songName-item" href={linkData[3]}>{clippedData[3]}</a> 
                <br/> 
                <a id="artist-item" href={linkDataArtist[3]}>{artistData[3]}</a>
                <br/> 
                <a id="songName-item" href={linkData[4]}>{clippedData[4]}</a> 
                <br/> 
                <a id="artist-item" href={linkDataArtist[4]}>{artistData[4]}</a>
                <br/> 
                <a id="songName-item" href={linkData[5]}>{clippedData[5]}</a> 
                <br/> 
                <a id="artist-item" href={linkDataArtist[5]}>{artistData[5]}</a>
                <br/> 
                <a id="songName-item" href={linkData[6]}>{clippedData[6]}</a>
                <br/> 
                <a id="artist-item" href={linkDataArtist[6]}>{artistData[6]}</a>
                <br/> 
                <a id="songName-item" href={linkData[7]}>{clippedData[7]}</a> 
                <br/> 
                <a id="artist-item" href={linkDataArtist[7]}>{artistData[7]}</a>
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


export default GetTopSongs;

