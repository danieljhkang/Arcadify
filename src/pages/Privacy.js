const Privacy = () => {
    return(
        <><div className = "about-container">
            <h2>Privacy</h2>
            <p className="about-text">
                Arcadify does not collect, store, or distribute any user data.
            </p>
            <br/>
            <p className="about-text">
                Arcadify is a web application that uses user data pulled directly 
                from Spotify's API. Therefore, by logging into Spotify and choosing
                to use this app, you agree to the use of your Spotify data. This includes
                your username, top artists, and top tracks.
            </p>
            <br/>
            <p className="about-text">
                All information that is pulled from the Spotify API is used SOLELY to create 
                and display the arcade images.
            </p>
            <br/>
            <p className="about-text">
                You can revoke Arcadify's permission to use your Spotify data by visiting 
                your Spotify account "Apps" page and removing access for Arcadify.
            </p>
            </div>
        </>
    ) 
    
}

export default Privacy;