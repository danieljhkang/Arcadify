import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import GetUserStats from "./GetUserStats";

const GetArtist = (props) => {
    console.log("oof");
    const ARTIST_ID = props.props;
    console.log(ARTIST_ID);
    const SPEF_ARTIST_ENDPOINT = `https://api.spotify.com/v1/artists/${ARTIST_ID}`;
    
    const [token, setToken] = useState('');
    const [mount, setMount] = useState(false); //boolean to control the number of calls
    const [popArtistURI, setPopArtistURI] = useState('');
    const [obsArtistURI, setObsArtistURI] = useState('');
    const [popTrackURI, setPopTrackURI] = useState('');
    const [obsTrackURI, setObsTrackURI] = useState('');
    const [popArtistIMG, setPopArtistIMG] = useState('');
    const [obsArtistIMG, setObsArtistIMG] = useState('');
    const [popTrackIMG, setPopTrackIMG] = useState('');
    const [obsTrackIMG, setObsTrackIMG] = useState('');

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            setToken(localStorage.getItem("accessToken"));
        }
        handleGetArtist();
        setMount(!mount);
    }, []);

    const handleGetArtist = async() => {
        await axios.get(SPEF_ARTIST_ENDPOINT, {
        headers: {
            Authorization: "Bearer " + token,
        }
        }).then(response => {
            console.log(response.data);
            setPopArtistURI(response.data.uri);
            setPopArtistIMG(response.data.images.url)
        })
        .catch((error) => {
            console.log(error);
        });
    }

    return (
        <>
        <p>{popArtistURI}</p>
        </>
    )
}

export default GetArtist;