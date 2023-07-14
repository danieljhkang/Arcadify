const About = () => {
    return (
    <><div className = "about-container">
        <h2>What is Arcadify?</h2>
        <p className="about-text">
            Arcadify is an open source program that creates an arcade graphic
            based on your most listened Spotify songs, artists, and genres.
        </p>

        <p className="about-text">
            Inspired by <a className="contact-link" href="https://receiptify.herokuapp.com/">Receiptify.</a>
        </p>

        <h2>How are the scores calculated?</h2>
        <p className="about-text">
            The scores for individual artists and tracks have less significance 
            than other components in Arcadify. They are calculated through an algorithm
            that makes sure that it matches up logically with the standings of the top
            items but it also mixes in its popularity points with it.
        </p>
        <br/>
        <p className="about-text">
            TLDR; I wish I could do something cool with it but because of limiting factors
            in Spotify's API, it really doesn't mean anything.
        </p>

        <h2>What is music obscurity and what determines its score (in the user stats)?</h2>
        <p className="about-text">
            Music obscurity is how unknown the artist or track is. The more underground
            the artist or track is, the higher their music obscurity points will be. The
            standards for obscurity or popularity is determined by Spotify and this 
            application is just using that data throught the Spotify API.
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