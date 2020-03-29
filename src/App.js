import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css';
import Layout from './page/layout'
// import { HashRouter } from "react-router-dom";
const fs = window.require('fs').promises
const join = window.require('path').join;


function App() {



  return (

      <div className="App">
        <div>
            <Layout />
        </div>
      </div>

  );
}

export default App;
