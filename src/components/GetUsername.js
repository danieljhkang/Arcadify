import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const GetUsername = () => {
    const USER_ENDPOINT = "https://api.spotify.com/v1/me";

    const [token, setToken] = useState('');
    const [mount, setMount] = useState(false); //boolean to control the number of calls
    const [userName, setUserName] = useState('');
    const [userName2, setUserName2] = useState('');
    const [userLink, setUserLink] = useState('');
    
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

    /*
    * Axios API call to spotify API using the access token
    * Sets the data as the response that is received
    */
    const handleGetUsername = async () => {
        await axios.get(USER_ENDPOINT, {
        headers: {
            Authorization: "Bearer " + token,
        }
        }).then(response => {
            let userData = response.data;
            setUserName(formatUserName(userData.display_name));
            setUserLink(userData.external_urls.spotify);
        })
        .catch((error) => {
            console.log(error);
        });
    };

    //first line can only by 16 characters
    const formatUserName = (string) => {
        let line1 = string;
        if(string.length>15){
            line1 = line1.substring(0,15);
            setUserName2(nameTooLong(line1.substring(15,30)));
        }else{
            setUserName2(nameTooLong(" "));
        }
        
        return line1;
    }

    //when the username is longer than 15 characters
    //spotify username limit is 30 characters
    const nameTooLong = (isTooLong) => {
        let line2;
        if(isTooLong === " "){
            line2 = "---------------"
        }else{
            line2 = isTooLong;
        }
        return line2;
    }

    /*
    * handleGetUsername was restricted to being called when mount changes
    * Due to being called too early which lead to 2 total calls, the first being a 400 error
    * Boolean value mount allows the function call to skip the first call
    */
    useEffect(() => {
        if (mount){
            handleGetUsername();
        }
    }, [mount]);


    return (
        <>
            <div id="userNameView">
                <a id = "userName" href={userLink}>{userName}</a>
                <br/>
                <a id = "userName2" href={userLink}>{userName2}</a>
            </div>
        </>
        
    )

}


export default GetUsername;