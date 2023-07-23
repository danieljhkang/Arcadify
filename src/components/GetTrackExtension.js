import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const GetTrackExtension = (termProp) => {
    const TERM = termProp.termProp.curTerm.currentTerm;
    const SONGS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${TERM}`; // endpoint = api?, Route to get information from
    
    const [token, setToken] = useState('');
    const [mount, setMount] = useState(false); //boolean to control the number of calls
    const [mount2, setMount2] = useState(false);
    const [clippedData, setClippedData] = useState([]);
    const [artistData, setArtistData] = useState([]);
    const [linkData, setLinkData] = useState([]); // URLs for the artist's spotify link
    const [linkDataArtist, setLinkDataArtist] = useState([]);

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

    let itemArray;
    const handleGetTopSongs = () => {
        axios.get(SONGS_ENDPOINT, {
        headers: {
            Authorization: "Bearer " + token,
        }
        }).then(response => {
            itemArray = response.data.items;
            titleCharacterLimiter();
            handleGetArtistNames();
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
        let linkArray = [];
        for(let i = 0; i < 50; i++){
            let indivData = itemArray[i];
            let indivName = indivData.name
            indivName = indivName.substring(0,40);
            titleArray.push(indivName);
            linkArray.push(indivData.external_urls.spotify);
        }
        setClippedData(titleArray);
        setLinkData(linkArray);
    }

    //item array[50] -> artists array[x]
    const handleGetArtistNames = () => {
        let finalArray = [];
        let artistLinkArray = [];
        for(let i = 0; i < 50; i++){
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
            // limit each string to 30 characters
            artistString = artistString.substring(0,40);
            // final product
            finalArray.push(artistString);
        }
        setArtistData(finalArray);
        setLinkDataArtist(artistLinkArray);
        setMount2(!mount2);
    }

    /*
    * Dynamically creates the extension p tags
    */
    const createDynamicTags = () => {
        deleteDynamicTags();
        for(let i = 49;i>7;i--){
            if(i===8){
                var p2 = `<a id="artist-item2" href=${linkDataArtist[i]}>&nbsp&nbsp&nbsp&nbsp${artistData[i]}</a>`;
                document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', p2);
                var b = "<br/>"
                document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', b);
                var p = `<a id="songName-item2" href=${linkData[i]}>${i+1}.&nbsp&nbsp${clippedData[i]}</a>`;
                document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', p);
                document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', b);
            }else{
                var p3 = `<a id="artist-item2" href=${linkDataArtist[i]}>&nbsp&nbsp&nbsp&nbsp${artistData[i]}</a>`;
                document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', p3);
                var b2 = "<br/>"
                document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', b2);
                var p4 = `<a id="songName-item2" href=${linkData[i]}>${i+1}.&nbsp${clippedData[i]}</a>`;
                document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', p4);
                document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', b2);
                
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
            handleGetTopSongs();
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

export default GetTrackExtension;