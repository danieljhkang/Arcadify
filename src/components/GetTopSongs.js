import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import GetUsername from "./GetUsername";

const GetTopSongs = (termProp) => {
    //term can be "short_term", "medium_term", or "long_term"
    const TERM = termProp.termProp.curTerm.currentTerm;
    const SONGS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?limit=8&time_range=${TERM}`; // endpoint = api?, Route to get information from


    const [token, setToken] = useState('');
    const [mount, setMount] = useState(false); //boolean to control the number of calls
    const [primaryData, setPrimaryData] = useState([]);
    const [subData, setSubData] = useState([]);
    const [popScoreData, setPopScoreData] = useState([])
    const [totalScore, setTotalScore] = useState(0);
    const [primLinkData, setPrimLinkData] = useState([]); // URLs for the artist's spotify link
    const [subLinkData, setSubLinkData] = useState([]);
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
   
    let responseDataArray;
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
            responseDataArray = response.data.items;
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
            let indivData = responseDataArray[i];
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
            let indivData = responseDataArray[i];
            let indivName = indivData.name
            indivName = indivName.substring(0,18);
            titleArray.push(indivName);
            linkArray.push(indivData.external_urls.spotify);
        }
        setPrimaryData(titleArray);
        setPrimLinkData(linkArray);
    }

    //item array[8] -> artists array[x]
    const handleGetArtistNames = () => {
        let finalArray = [];
        let artistLinkArray = [];
        for(let i = 0; i < 8; i++){
            let indivData = responseDataArray[i];
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
        setSubData(finalArray);
        setSubLinkData(artistLinkArray);
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
            <div id="middle-column">
                <a id="primary-item" href={primLinkData[0]}>{primaryData[0]}</a>  
                <br/> 
                <a id="sub-item" href={subLinkData[0]}>{subData[0]}</a>
                <br/>
                <a id="primary-item" href={primLinkData[1]}>{primaryData[1]}</a>  
                <br/>            
                <a id="sub-item" href={subLinkData[1]}>{subData[1]}</a>
                <br/> 
                <a id="primary-item" href={primLinkData[2]}>{primaryData[2]}</a> 
                <br/> 
                <a id="sub-item" href={subLinkData[2]}>{subData[2]}</a>
                <br/> 
                <a id="primary-item" href={primLinkData[3]}>{primaryData[3]}</a> 
                <br/> 
                <a id="sub-item" href={subLinkData[3]}>{subData[3]}</a>
                <br/> 
                <a id="primary-item" href={primLinkData[4]}>{primaryData[4]}</a> 
                <br/> 
                <a id="sub-item" href={subLinkData[4]}>{subData[4]}</a>
                <br/> 
                <a id="primary-item" href={primLinkData[5]}>{primaryData[5]}</a> 
                <br/> 
                <a id="sub-item" href={subLinkData[5]}>{subData[5]}</a>
                <br/> 
                <a id="primary-item" href={primLinkData[6]}>{primaryData[6]}</a>
                <br/> 
                <a id="sub-item" href={subLinkData[6]}>{subData[6]}</a>
                <br/> 
                <a id="primary-item" href={primLinkData[7]}>{primaryData[7]}</a> 
                <br/> 
                <a id="sub-item" href={subLinkData[7]}>{subData[7]}</a>
            </div>
            <div id="right-column">
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

