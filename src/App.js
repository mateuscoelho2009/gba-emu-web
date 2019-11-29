import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        Inspired by the project <a href="https://github.com/endrift/gbajs" target="_blank">gbajs</a> which was descontinued.

        This project intends to:
          <ul>
            <li>
            Create a react component that can be used for playing GameBoy Advanced games in browser;
            </li>
            <li>
            Refactor code from <a href="https://github.com/endrift/gbajs" target="_blank">gbajs</a>;
            </li>
            <li>
            Include mobile gameplay support;
            </li>
            <li>
            Develop a platform for playing GBA online.
            </li>
          </ul>
        </p>
        <p>
          <Link
            to="/emulator"
            className="App-link"
          >
            Run Emulator
          </Link>
        </p>
      </header>
    </div>
  );
}

export default App;
