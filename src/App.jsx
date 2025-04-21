import React, {useEffect} from 'react';
import {useState} from 'react';
import AuthModalComponent from "./components/AuthModalComponent.jsx";
import axios from 'axios';
import './App.css';
import {Link, Route, Routes} from "react-router-dom";
import MainComponent from "./components/MainComponent.jsx";
import PostDetailsComponent from "./components/PostDetailsComponent.jsx";

const App = () => {
    return (
        <div className="App">
            <Routes>
                <Route path={"/"} element={<MainComponent/>}/>
                <Route path={"/posts/:id"} element={<PostDetailsComponent/>}/>
            </Routes>
        </div>
    );
};

export default App;