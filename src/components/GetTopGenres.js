import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import GetUsername from "./GetUsername";

const GetTopGenres = (termProp) => {
        //term can be "short_term", "medium_term", or "long_term"
        const TERM = termProp.termProp.curTerm.currentTerm;
        const termDisplay = termProp.termProp.termText.termText;
        const SONGS_ENDPOINT = `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${TERM}`; // endpoint = api?, Route to get information from
        //generate 50 artists, find top genres based on the top 50 artists
    
        const [token, setToken] = useState('');
        // const [data, setData] = useState({}); //this data is from spotify
        const [mount, setMount] = useState(false); //boolean to control the number of calls
        const [clippedData, setClippedData] = useState([]);
        const [popScoreData, setPopScoreData] = useState([])
        const [totalScore, setTotalScore] = useState(0);
    
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
            axios.get(SONGS_ENDPOINT, {
            headers: {
                Authorization: "Bearer " + token,
            }
            }).then(response => {
                itemArray = response.data.items;
                titleCharacterLimiter();
            })
            .catch((error) => {
                console.log(error);
            });
        };
    
        /*
        * Takes object received from response.data then limits the genre title to 18 characters
        */
        const titleCharacterLimiter = () => {
            let genreMap = new Map();
            for(let i = 0; i < 50; i++){
                let indivData = itemArray[i];
                let genresArray = indivData.genres
                //set genremap key for every genre in genresArray
                for(let i = 0; i< genresArray.length;i++){
                    if(genreMap.has(genresArray[i])){
                        genreMap.set(genresArray[i], genreMap.get(genresArray[i])+1)
                    }else{
                        genreMap.set(genresArray[i], 1);
                    }
                }
                // genresArray.push(indivName);
            }
            const sortedMap = new Map([...genreMap.entries()].sort((a, b) => b[1] - a[1])); //sorts the map by value
            let fullGenreArray = Array.from(sortedMap.keys()); //put all genre names into fullGenreArray
            let fullGenrePercentArray = Array.from(sortedMap.values());
            let topGenresArray = [];
            //put top 8 genres into topGenresArray
            for(let i = 0; i<8; i++){
                let genreName = fullGenreArray[i].substring(0,18);
                topGenresArray.push(genreName);                
            }
            let topGenresScoreArray = [];
            //put top 8 genre scores into topGenresScoreArray
            for(let i = 0; i<8; i++){
                let indivPercent = (fullGenrePercentArray[i]/50) * 100;
                topGenresScoreArray.push(indivPercent + "%");                
            }
            setClippedData(topGenresArray);
            // getGenrePercentage(fullGenrePercentArray);
            setPopScoreData(topGenresScoreArray);
            setTotalScore("100%");
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
                <div id="songName-view">
                    <p id="songName-item">{clippedData[0]}</p>   
                    <p id="songName-item">{clippedData[1]}</p>             
                    <p id="songName-item">{clippedData[2]}</p> 
                    <p id="songName-item">{clippedData[3]}</p> 
                    <p id="songName-item">{clippedData[4]}</p> 
                    <p id="songName-item">{clippedData[5]}</p> 
                    <p id="songName-item">{clippedData[6]}</p>
                    <p id="songName-item">{clippedData[7]}</p>  
                </div>
                <div id="popScore-view">
                    <p id="popScore-item">{popScoreData[0]}</p>
                    <p id="popScore-item">{popScoreData[1]}</p>
                    <p id="popScore-item">{popScoreData[2]}</p>
                    <p id="popScore-item">{popScoreData[3]}</p>
                    <p id="popScore-item">{popScoreData[4]}</p>
                    <p id="popScore-item">{popScoreData[5]}</p>
                    <p id="popScore-item">{popScoreData[6]}</p>
                    <p id="popScore-item">{popScoreData[7]}</p>
                </div>
                <GetUsername />
                <p id="total-text">TOTAL : {totalScore}</p>
            </>
        )
}

export default GetTopGenres;