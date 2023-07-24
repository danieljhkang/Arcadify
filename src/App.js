import React from 'react';
import Navbar from './components/Navbar';
import "./styles.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import {Route, Routes} from "react-router-dom";

function App(){
    
    return (
    <>
        <Navbar /> 
        <div className="container">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </div>
        <div className='center'>
            <hr className = 'footerLine'/>
            <br/>
            <p className='nameTag'>Created by&nbsp;</p>
            <a className='nameLink' href='https://www.linkedin.com/in/daniel-kang-46b1a51b9/'>Daniel Kang</a>
        </div>
        <a href='https://open.spotify.com/'>
            <img src={require('./assets/spotifyLogo.png')} className = "spotifyLogo" alt="spotifyLogo"/>
        </a>
    </>
    )
}

export default App;