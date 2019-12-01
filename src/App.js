import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';
import { styled } from '@material-ui/core/styles';

const MyButton = styled(Button)({
  background: 'linear-gradient(45deg, #060508 30%, #805b9c 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  textTransform: 'none',
});

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
            <MyButton variant="outlined"> 
                Run Emulator
            </MyButton>   
          </Link>
        </p>
      </header>
    </div>
  );
}

export default App;
