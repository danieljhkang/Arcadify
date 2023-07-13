import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const GetUserExtension = (termProp) => {
    const TERM = termProp.termProp.curTerm.currentTerm;
    const USER_ENDPOINT = "https://api.spotify.com/v1/me";
    const ARTISTS_ENDPOINT = `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${TERM}`; // endpoint = api?, Route to get information from
    const TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${TERM}`; // endpoint = api?, Route to get information from
    
    const [token, setToken] = useState('');
    // const [data, setData] = useState({}); //this data is from spotify
    const [mount, setMount] = useState(false); //boolean to control the number of calls
    const [mount2, setMount2] = useState(false);
    const [clippedData, setClippedData] = useState([]);

    const [popArtists, setPopArtists] = useState([]);
    const [obsArtists, setObsArtists] = useState([]);
    const [popTracks, setPopTracks] = useState([]);
    const [obsTracks, setObsTracks] = useState([]);

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

        setMount2(!mount2);
    }

     /*
    * Gets the most popular and most underground artist's img
    */
     const getPopArtist = async() => {
        let artistMap = new Map();
        for(let i = 0; i < 50; i++){
            let indivData = itemArray[i];
            artistMap.set(indivData.name, indivData.popularity);
        }
        const sortedMap = new Map([...artistMap.entries()].sort((a, b) => b[1] - a[1])); //sorts the map by value

        //the most popular artist
        setPopArtists(Array.from(sortedMap.keys()));
    
        //the most obscure artist
        setObsArtists(Array.from(sortedMap.keys()));
    }

    /*
    * Gets the most popular and most underground track's img
    */
    const getPopTrack = async() => {
        let trackMap = new Map();
        for(let i = 0; i < 50; i++){
            let indivData = itemArray2[i];
            trackMap.set(indivData.name, indivData.popularity);
        }
        const sortedMap = new Map([...trackMap.entries()].sort((a, b) => b[1] - a[1])); //sorts the map by value

        //the most popular track
        setPopTracks(Array.from(sortedMap.keys()));

        //the most obscure track
        setObsTracks(Array.from(sortedMap.keys()));
    }



    const createDynamicTags = () => {
        deleteDynamicTags();
        for(let i = 45;i<obsTracks.length;i++){
            var p9 = `<p id="artist-item2">${Math.abs(i-50)}.&nbsp${obsTracks[i]}</p>`;
            document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', p9);
        }
        var p8 = `<p id="songName-item2">MOST UNDERGROUND TRACKS</p>`;
        document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', p8);

        for(let i = 4;i>-1;i--){
            var p7 = `<p id="artist-item2">${i+1}.&nbsp${popTracks[i]}</p>`;
            document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', p7);
        }
        var p6 = `<p id="songName-item2">MOST POPULAR TRACKS</p>`;
        document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', p6);

        for(let i = 45;i<obsArtists.length;i++){
            var p5 = `<p id="artist-item2">${Math.abs(i-50)}.&nbsp${obsArtists[i]}</p>`;
            document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', p5);
        }
        var p4 = `<p id="songName-item2">MOST UNDERGROUND ARTISTS</p>`;
        document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', p4);

        for(let i = 4;i>-1;i--){
            var p2 = `<p id="artist-item2">${i+1}.&nbsp${popArtists[i]}</p>`;
            document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', p2);
        }
        var p3 = `<p id="songName-item2">MOST POPULAR ARTISTS</p>`;
        document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', p3);
    }

    const deleteDynamicTags = () => {
        const element = document.getElementById("dynamicTags");
        element.innerHTML = '';
    }

    useEffect(() => {
        if (mount){
            getObscurities();
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
        <p id="selectionText">YOUR EXTENDED STATS :</p>
        <div id="dynamicTags">
        </div>
        </>
    )
}

export default GetUserExtension;