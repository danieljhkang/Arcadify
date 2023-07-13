import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const GetArtistExtension = (termProp) => {
    const TERM = termProp.termProp.curTerm.currentTerm;
    const ARTISTS_ENDPOINT = `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${TERM}`; // endpoint = api?, Route to get information from    
    
    const [token, setToken] = useState('');
    // const [data, setData] = useState({}); //this data is from spotify
    const [mount, setMount] = useState(false); //boolean to control the number of calls
    const [mount2, setMount2] = useState(false);
    const [clippedData, setClippedData] = useState([]);

    /*
    * Runs only on the first render
    * Sets token to the accessToken received from localStorage
    */
    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            setToken(localStorage.getItem("accessToken"));
        }
        setMount(!mount);
    }, []); //empty dependencies array = only runs once when app is opened

    let itemArray;
    const handleGetTopArtists = () => {
        axios.get(ARTISTS_ENDPOINT, {
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
    * Takes object received from response.data then limits the track title to 18 characters
    */
    const titleCharacterLimiter = () => {
        let titleArray = [];
        for(let i = 0; i < 50; i++){
            let indivData = itemArray[i];
            let indivName = indivData.name
            indivName = indivName.substring(0,40);
            titleArray.push(indivName);
        }
        setClippedData(titleArray);
        setMount2(!mount2);
    }

    const createDynamicTags = () => {
        deleteDynamicTags();
        for(let i = 49;i>7;i--){
            if(i===8){
                var p2 = `<p id="songName-item2">${i+1}.&nbsp&nbsp${clippedData[i]}</p>`;
                document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', p2);
            }else{
                var p3 = `<p id="songName-item2">${i+1}.&nbsp${clippedData[i]}</p>`;
                document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', p3);
            }
        }
    }

    const deleteDynamicTags = () => {
        const element = document.getElementById("dynamicTags");
        element.innerHTML = '';
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

    useEffect(() => {
        if (mount2){
            createDynamicTags();
            setMount2(false);
        }
    },[mount2]);

    return (
        <>
        <p id="selectionText">YOUR TOP 9-50 :</p>
        <div id="dynamicTags">
        </div>
        </>
    )
}

export default GetArtistExtension;