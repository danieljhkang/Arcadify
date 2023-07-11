const About = () => {
    return (
    <><div className = "about-container">
        <h2>What is Arcadify?</h2>
        <p className="about-text">
            Arcadify is an open source program that creates an arcade graphic
            based on your most listened Spotify songs, artists, and genres.
            Inspired by Receiptify. 
        </p>

        <h2>How are the scores calculated?</h2>
        <p className="about-text">
            In many ways...
        </p>

        <h2>Are you stealing my data?</h2>
        <p className="about-text">
            Nope! None of your personal data is collected or stored online.
            For more specifics, check out Arcadify's privacy tab.
        </p>

        <h2>Where is Apple Music (or any other music streaming service)?</h2>
        <p className="about-text">
            I haven't yet got the chance to implement Apple Music API into Arcadify. 
            If I do get the time in the future, I will definitely be updating the
            the app to support Apple Music! As for any other music service,
            it seems that not every music streaming service have accessible API's 
            to obtain streaming data.
        </p>
    </div></>
    )
}

export default About;