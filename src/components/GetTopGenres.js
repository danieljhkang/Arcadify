import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import GetUsername from "./GetUsername";

const GetTopGenres = (termProp) => {
        //term can be "short_term", "medium_term", or "long_term"
        const TERM = termProp.termProp.curTerm.currentTerm;
        const SONGS_ENDPOINT = `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${TERM}`; // endpoint = api?, Route to get information from
        //generate 50 artists, find top genres based on the top 50 artists
    
        const [token, setToken] = useState('');
        // const [data, setData] = useState({}); //this data is from spotify
        const [mount, setMount] = useState(false); //boolean to control the number of calls
        const [primaryData, setPrimaryData] = useState([]);
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
       
        let responseDataArray;
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
                responseDataArray = response.data.items;
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
                let indivData = responseDataArray[i];
                let genresArray = indivData.genres
                //set genremap key for every genre in genresArray
                for(let i = 0; i< genresArray.length;i++){
                    if(genreMap.has(genresArray[i])){
                        genreMap.set(genresArray[i], genreMap.get(genresArray[i])+1)
                    }else{
                        genreMap.set(genresArray[i], 1);
                    }
                }
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
                let indivPercent = Math.round((fullGenrePercentArray[i]/50) * 100);
                topGenresScoreArray.push(indivPercent + "%");                
            }
            setPrimaryData(topGenresArray);
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
                <div id="middle-column">
                    <p id="artistOrGenreOnly-item">{primaryData[0]}</p>
                    <br/>   
                    <p id="artistOrGenreOnly-item">{primaryData[1]}</p>
                    <br/>              
                    <p id="artistOrGenreOnly-item">{primaryData[2]}</p> 
                    <br/> 
                    <p id="artistOrGenreOnly-item">{primaryData[3]}</p>
                    <br/>  
                    <p id="artistOrGenreOnly-item">{primaryData[4]}</p> 
                    <br/> 
                    <p id="artistOrGenreOnly-item">{primaryData[5]}</p> 
                    <br/> 
                    <p id="artistOrGenreOnly-item">{primaryData[6]}</p>
                    <br/> 
                    <p id="artistOrGenreOnly-item">{primaryData[7]}</p>  
                </div>
                <div id="right-column">
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