import GetTopArtists from "./GetTopArtists";
import GetTopGenres from "./GetTopGenres";
import GetTopSongs from "./GetTopSongs";

const GetDisplayItem = (termProp, subjectProp) => {
    const currentTerm = termProp.termProp.curTerm.currentTerm;
    const termText = termProp.termProp.termText.termText;
    const currentSubject = "top_tracks";
    
    return (
        <>
            <div class="container">
                <div class = "row">
                    <div class="col">
                        {/* This is where the ranking numbers go */}
                    </div>
                    <div class="col">
                        {/* This is where the song name + artist name goes */}
                    </div>
                    <div class="col">
                        {/* This is where the scores go */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default GetDisplayItem;