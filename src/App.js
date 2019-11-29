import React from 'react';
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
          <a
            className="App-link"
            href="https://mateuscoelho2009.github.io/gba-emu-web/#/emulator"
            target="_self"
            rel="noopener noreferrer"
          >
            Run Emulator
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
