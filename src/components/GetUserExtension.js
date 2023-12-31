import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const GetUserExtension = (termProp) => {
    const TERM = termProp.termProp.curTerm.currentTerm;
    const ARTISTS_ENDPOINT = `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${TERM}`; // endpoint = api?, Route to get information from
    const TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${TERM}`; // endpoint = api?, Route to get information from
    
    const [token, setToken] = useState('');
    const [mount, setMount] = useState(false); //boolean to control the number of calls
    const [mount2, setMount2] = useState(false);

    const [popArtists, setPopArtists] = useState([]);
    const [obsArtists, setObsArtists] = useState([]);
    const [popTracks, setPopTracks] = useState([]);
    const [obsTracks, setObsTracks] = useState([]);
    const [popArtSURL, setPopArtSURL] = useState([]);
    const [obsArtSURL, setObsArtSURL] = useState([]);
    const [popTrkSURL, setPopTrkSURL] = useState([]);
    const [obsTrkSURL, setObsTrkSURL] = useState([]);

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
        let linkMap = new Map();
        for(let i = 0; i < 50; i++){
            let indivData = itemArray[i];
            artistMap.set(indivData.name, indivData.popularity);
            linkMap.set(indivData.external_urls.spotify, indivData.popularity);
        }
        const sortedMap = new Map([...artistMap.entries()].sort((a, b) => b[1] - a[1])); //sorts the map by value
        const sortedLinkMap = new Map([...linkMap.entries()].sort((a, b) => b[1] - a[1]));

        //the most popular artist
        setPopArtists(Array.from(sortedMap.keys()));
        setPopArtSURL(Array.from(sortedLinkMap.keys()));
    
        //the most obscure artist
        setObsArtists(Array.from(sortedMap.keys()));
        setObsArtSURL(Array.from(sortedLinkMap.keys()));
    }

    /*
    * Gets the most popular and most underground track's img
    */
    const getPopTrack = async() => {
        let trackMap = new Map();
        let linkMap2 = new Map();
        for(let i = 0; i < 50; i++){
            let indivData = itemArray2[i];
            trackMap.set(indivData.name, indivData.popularity);
            linkMap2.set(indivData.external_urls.spotify, indivData.popularity);
        }
        const sortedMap = new Map([...trackMap.entries()].sort((a, b) => b[1] - a[1])); //sorts the map by value
        const sortedLinkMap = new Map([...linkMap2.entries()].sort((a, b) => b[1] - a[1]));

        //the most popular track
        setPopTracks(Array.from(sortedMap.keys()));
        setPopTrkSURL(Array.from(sortedLinkMap.keys()));

        //the most obscure track
        setObsTracks(Array.from(sortedMap.keys()));
        setObsTrkSURL(Array.from(sortedLinkMap.keys()));
    }



    /*
    * Dynamically creates the extension p tags
    */
    const createDynamicTags = () => {
        deleteDynamicTags();
        var b = "<br/>"
        for(let i = 45;i<obsTracks.length;i++){
            var p9 = `<a id="artist-item2" href=${obsTrkSURL[i]}>${Math.abs(i-50)}.&nbsp${obsTracks[i]}</a>`;
            document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', p9);
            document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', b);
        }
        var p8 = `<p id="songName-item3">MOST UNDERGROUND TRACKS</p>`;
        document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', p8);

        document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', b);
        for(let i = 4;i>-1;i--){
            var p7 = `<a id="artist-item2" href=${popTrkSURL[i]}>${i+1}.&nbsp${popTracks[i]}</a>`;
            document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', p7);
            document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', b);
        }
        var p6 = `<p id="songName-item3">MOST POPULAR TRACKS</p>`;
        document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', p6);

        document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', b);
        for(let i = 45;i<obsArtists.length;i++){
            var p5 = `<a id="artist-item2" href=${obsArtSURL[i]}>${Math.abs(i-50)}.&nbsp${obsArtists[i]}</a>`;
            document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', p5);
            document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', b);
        }
        var p4 = `<p id="songName-item3">MOST UNDERGROUND ARTISTS</p>`;
        document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', p4);

        document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', b);
        for(let i = 4;i>-1;i--){
            var p2 = `<a id="artist-item2" href=${popArtSURL[i]}>${i+1}.&nbsp${popArtists[i]}</a>`;
            document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', p2);
            document.getElementById("dynamicTags").insertAdjacentHTML('afterbegin', b);
        }
        var p3 = `<p id="songName-item3">MOST POPULAR ARTISTS</p>`;
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