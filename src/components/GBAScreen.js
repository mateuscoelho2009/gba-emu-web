import React from 'react';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import GameBoyAdvance from '../libs/js/gba';
import loadRom from '../libs/resources/xhr';
import '../libs/resources/main.css';
import CrashImage from '../libs/resources/crash.png';
import BackgroundImage from '../libs/resources/bg.png';
import Bios from '../libs/resources/bios.bin';
import { withStyles, Button } from '@material-ui/core';
import GBAControlsHelper from './GBAControlsHelper';
import GBAMobileController from './GBAMobileController';

const styles = () => {
    const screenWidth = window.screen.width;
    const width = screenWidth > 480 ? 480 : screenWidth;
    const height = screenWidth > 480 ? 320 : 320 * screenWidth / 480;

    const noselect = {
        '-webkit-touch-callout': 'none', /* iOS Safari */
        '-webkit-user-select': 'none', /* Safari */
        '-khtml-user-select': 'none', /* Konqueror HTML */
        '-moz-user-select': 'none',/* Old versions of Firefox */
        '-ms-user-select': 'none', /* Internet Explorer/Edge */
        'user-select': 'none', /* Non-prefixed version, currently
                                    supported by Chrome, Opera and Firefox */
    }

    return ({
        container: {
            ...noselect,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            '-webkit-overflow-scrolling': 'touch',
            minHeight: '100vh',
            background: '-webkit-linear-gradient(#765490 560px, #6A4883 620px, #433061 900px)',
            textAlign: 'center',
            fontFamily: '"Calibri", "Verdana", sans-serif',
            color: 'white',
            textShadow: '0 2px rgba(0, 0, 0, 0.6)',
        },
        screen: {
            ...noselect,
            background: `url('${BackgroundImage}') no-repeat top center`,

            '@media (max-width:480px)': {
                background: 'none',
            },
        },
        canvas: {
            ...noselect,
            marginTop: 85,
            marginBottom: 150,
            
            '&[width="240"]': {
                marginTop: 42.5,
                marginBottom: -363, /* Take up no height */
                imageRendering: '-webkit-optimize-contrast',
                imageRendering: '-moz-crisp-edges',
                imageRendering: '-o-crisp-edges',
                zoom: 2,
                transform: 'scale(2)',
            },
            '@media (max-width:480px)': {
                background: 'gray',
                marginTop: 0,
                marginBottom: 0,
            },
        },
        controls: {
            ...noselect,
            borderRadius: 20,
            border: '1px solid rgba(0, 0, 0, 0.4)',
            borderTop: 'none',
            boxShadow: '0 4px 4px -2px rgba(0, 0, 0, 0.9), 0 -40px 2px -1px #433061 inset',
            width: '100vw',
            maxWidth: 700,
            margin: 'auto',
            height: 200,
            overflow: 'hidden',
            backgroundColor: '#765490',
            position: 'relative',

            '&::before': {
                content: '""',
                display: 'block',
                height: 30,
                width: 'calc(100vw + 7px)',
                maxWidth: 707,
                borderRadius: '5px / 15px',
                border: '1px solid rgba(0, 0, 0, 0.4)',
                borderWidth: '0 1px',
                margin: '0 -5px 20px',
                background: '-moz-linear-gradient(top, #8769A0, #9578B9 15%, #6A4883 50%, #433061)',
                background: '-webkit-linear-gradient(top, #8769A0, #9578B9 15%, #6A4883 50%, #433061)',
                boxShadow: '0 5px 4px -3px rgba(0, 0, 0, 0.6)',
                position: 'absolute',
            },
            '& > div': {
                // marginTop: 30,
                marginTop: -15,
                transform: 'rotateX(0deg)',
                transformOrigin: '50% 0',
                transition: 'transform linear 0.5s',
                '-moz-transform-origin': '50% 0',
                '-moz-transform': 'rotateX(0deg)',
                '-moz-transition': '-moz-transform linear 0.5s',
                '-webkit-transform-origin-y': 2,
                '-webkit-transform': 'rotateX(0deg)',
                '-webkit-transition': '-webkit-transform linear 0.5s',
            },
        },
        hidden: {
            transform: 'rotateX(90deg) !important',
            // -moz-transform: 'rotateX(90deg) !important';
            // -webkit-transform: 'rotateX(90deg) !important';
        },
        dead: {
            display: 'none',
        },
        button: {
            fontFamily: '"Calibri", "Verdana", sans-serif',
            backgroundColor: '#6A4883',
            fontWeight: 'bold',
            fontSize: 18,
            color: 'white',
            textShadow: '0 3px #433061',
            padding: '2px 10px 5px',
            borderRadius: '0 0 10px 10px',
            border: '0 solid rgba(0, 0, 0, 0.4)',
            borderWidth: '3px 1px 0px',
            display: 'inline',
            boxShadow: '0 2px 6px -1px rgba(0, 0, 0, 0.2) inset',
            margin: '0 0 20px',
        },
        noselect,
    });
};

export const commands = [
    "LEFT",
    "RIGHT",
    "UP",
    "DOWN",
    "A",
    "B",
    "R",
    "L",
    "START",
    "SELECT",
];

var gba;

class GBAScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isFull: false,
            throttle: 16,
        };

        this.initGBA = this.initGBA.bind(this);
        this.toogleSpeed = this.toogleSpeed.bind(this);
        // this.goFull = this.goFull.bind(this);
    }

    goFull() {
        // this.setState({ isFull: true });
        var doc = window.document;
        var docEl = doc.documentElement;
        
        var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            requestFullScreen.call(docEl);
        }
        else {
            cancelFullScreen.call(doc);
        }
    }

    toogleSpeed() {
        if (gba) {
            var throttle = gba.throttle;

            gba.throttle = {
                16: 12,
                12: 8,
                8: 16,
            }[throttle];

            this.setState({
                throttle: gba.throttle,
            });
        }
    }

    componentDidMount() {
        this.initGBA();

        window.addEventListener('beforeinstallprompt',e=>{
            // For older browsers
            e.preventDefault();
            console.log("Install Prompt fired");
            this.installPrompt = e;
            // See if the app is already installed, in that case, do nothing
            if((window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true){
              return false;
            }
            // Set the state variable to make button visible
            this.setState({
                installButton:true,
            });
        });
    }

    async installApp () {
        if(!this.installPrompt) return false;
        this.installPrompt.prompt();
        let outcome = await this.installPrompt.userChoice;
        if(outcome.outcome=='accepted'){
          console.log("App Installed")
        }
        else{
          console.log("App not installed");
        }
        // Remove the event reference
        this.installPrompt=null;
        // Hide the button
        this.setState({
          installButton:false
        })
    }

    initGBA() {
        var runCommands = [];
        const {
            classes,
        } = this.props;  

        document.addEventListener('gesturestart', function (e) {
            e.preventDefault();
        });

        // Initialize emulator once the browser loads
        window.onload = function () {
            // Setup the emulator
            try {
                gba = new GameBoyAdvance();
                gba.keypad.eatInput = true;

                gba.setLogger(function (level, error) {
                    console.error(error);
                    
                    gba.pause();
                    
                    var screen = document.getElementById('screen');
                    
                    if (screen.getAttribute('class') === classes.dead) {
                        console.log('We appear to have crashed multiple times without reseting.');
                        return;
                    }

                    // Show error image in the emulator screen
                    // The image can be retrieven from the repository
                    var crash = document.createElement('img');
                    crash.setAttribute('id', 'crash');
                    crash.setAttribute('src', CrashImage);
                    screen.parentElement.insertBefore(crash, screen);
                    screen.setAttribute('class', classes.dead);
                });

                // In order to pause/resume the game when the user changes the website tab in the browser
                // add the 2 following listeners to the window !
                // 
                // This feature is problematic/tricky to handle, so you can make it better if you need to
                window.onblur = function () {
                    if(gba.hasRom()){
                        var e = document.getElementById('pause');

                        if (!gba.paused) {
                            gba.pause();
                            e.textContent = "UNPAUSE";

                            console.log("Window Focused: the game has been paused");
                        }
                    }
                };

                window.onfocus = function () {
                    if(gba.hasRom()){
                        var e = document.getElementById('pause');

                        if (gba.paused) {
                            gba.runStable();
                            e.textContent = "PAUSE";

                            console.log("Window Focused: the game has been resumed");
                        }
                    }
                };
            } catch (exception) {
                gba = null;
            }

            if (gba && FileReader) {
                var canvas = document.getElementById('screen');
                gba.setCanvas(canvas);

                gba.logLevel = gba.LOG_ERROR;

                // Load the BIOS file of GBA (change the path according to yours)
                loadRom(Bios, function (bios) {
                    gba.setBios(bios);
                });

                if (!gba.audio.context) {
                    // Remove the sound box if sound isn't available
                    var soundbox = document.getElementById('sound');
                    soundbox.parentElement.removeChild(soundbox);
                }

            } else {
                var dead = document.getElementById('controls');
                dead.parentElement.removeChild(dead);
            }
        }
        window.onload();

        function fadeOut(id, nextId, kill) {
            var e = document.getElementById(id);
            var e2 = document.getElementById(nextId);
            if (!e) {
                return;
            }

            var removeSelf = function () {
                if (kill) {
                    e.parentElement.removeChild(e);
                } else {
                    e.setAttribute('class', classes.dead);
                    e.removeEventListener('webkitTransitionEnd', removeSelf);
                    e.removeEventListener('oTransitionEnd', removeSelf);
                    e.removeEventListener('transitionend', removeSelf);
                }
                if (e2) {
                    e2.setAttribute('class', classes.hidden);
                    setTimeout(function () {
                        e2.removeAttribute('class');
                    }, 0);
                }
            }

            e.addEventListener('webkitTransitionEnd', removeSelf, false);
            e.addEventListener('oTransitionEnd', removeSelf, false);
            e.addEventListener('transitionend', removeSelf, false);
            e.setAttribute('class', classes.hidden);
        }

        /**
         * Starts the emulator with the given ROM file
         * 
         * @param file 
         */
        function run(file) {
            var dead = document.getElementById('loader');

            dead.value = '';
            
            var load = document.getElementById('select');
            load.textContent = 'Loading...';
            load.removeAttribute('onclick');
            
            var pause = document.getElementById('pause');
            pause.textContent = "PAUSE";
            
            gba.loadRomFromFile(file, function (result) {
                if (result) {
                    for (var i = 0; i < runCommands.length; ++i) {
                        runCommands[i]();
                    }

                    runCommands = [];
                    fadeOut('preload', 'ingame');
                    fadeOut('instructions', null, true);
                    gba.runStable();
                } else {
                    load.textContent = 'FAILED';

                    setTimeout(function () {
                        load.textContent = 'SELECT';
                        
                        load.onclick = function () {
                            document.getElementById('loader').click();
                        };

                    }, 3000);
                }
            });
        }

        /**
         * Resets the emulator
         * 
         */
        function reset() {
            gba.pause();
            gba.reset();

            var load = document.getElementById('select');
            
            load.textContent = 'SELECT';

            var crash = document.getElementById('crash');
            const screenWidth = window.screen.width;
            const width = screenWidth > 480 ? 480 : screenWidth;
            const height = screenWidth > 480 ? 320 : 320 * screenWidth / 480;

            if (crash) {
                var context = gba.targetCanvas.getContext('2d');
                context.clearRect(0, 0, width, height);
                gba.video.drawCallback();
                crash.parentElement.removeChild(crash);
                var canvas = document.getElementById('screen');
                canvas.removeAttribute('class');
            } else {
                lcdFade(gba.context, gba.targetCanvas.getContext('2d'), gba.video.drawCallback);
            }

            load.onclick = function () {
                document.getElementById('loader').click();
            };

            fadeOut('ingame', 'preload');

            // Clear the ROM
            gba.rom = null;
        }

        /**
         * Stores the savefile data in the emulator.
         * 
         * @param file 
         */
        function uploadSavedataPending(file) {
            runCommands.push(function () { 
                gba.loadSavedataFromFile(file) 
            });
        }

        /**
         * Toggles the state of the game
         */
        function togglePause() {
            var e = document.getElementById('pause');

            if (gba.paused) {
                gba.runStable();
                e.textContent = "PAUSE";
            } else {
                gba.pause();
                e.textContent = "UNPAUSE";
            }
        }

        /**
         * From a canvas context, creates an LCD animation that fades the content away.
         * 
         * @param context 
         * @param target 
         * @param callback 
         */
        function lcdFade(context, target, callback) {
            var i = 0;
            const screenWidth = window.screen.width;
            const width = screenWidth > 480 ? 480 : screenWidth;
            const height = screenWidth > 480 ? 320 : 320 * screenWidth / 480;

            var drawInterval = setInterval(function () {
                i++;

                var pixelData = context.getImageData(0, 0, width / 2, height / 2);

                for (var y = 0; y < height / 2; ++y) {
                    for (var x = 0; x < width / 2; ++x) {
                        var xDiff = Math.abs(x - width / 4);
                        var yDiff = Math.abs(y - height / 4) * 0.8;
                        var xFactor = (width / 4 - i - xDiff) / (width / 4);
                        var yFactor = (height / 4 - i - ((y & 1) * 10) - yDiff + Math.pow(xDiff, 1 / 2)) / (height / 4);
                        pixelData.data[(x + y * width / 2) * 4 + 3] *= Math.pow(xFactor, 1 / 3) * Math.pow(yFactor, 1 / 2);
                    }
                }
                
                context.putImageData(pixelData, 0, 0);

                target.clearRect(0, 0, width, height);

                if (i > 40) {
                    clearInterval(drawInterval);
                } else {
                    callback();
                }
            }, 50);
        }

        /**
         * Set the volume of the emulator.
         * 
         * @param value 
         */
        function setVolume(value) {
            gba.audio.masterVolume = Math.pow(2, value) - 1;
        }

        // If clicked, simulate click on the File Select input to load a ROM
        document.getElementById("select").addEventListener("click", function(){
            document.getElementById("loader").click();
        }, false);

        // One-liner to resume playback when user interacted with the page.
        document.querySelector('button').addEventListener('click', function() {
            gba.audio.context.resume();
        });

        // Run the emulator with the loaded ROM
        document.getElementById("loader").addEventListener("change", function(){
            var ROM = this.files[0];
            run(ROM);
        }, false);

        // If clicked, simulate click on the File Select Input to load the savegame file
        document.getElementById("select-savegame-btn").addEventListener("click", function(){
            document.getElementById('saveloader').click();
        }, false);

        // Load the savegame to the emulator
        document.getElementById("saveloader").addEventListener("change", function(){
            var SAVEGAME = this.files[0];
            uploadSavedataPending(SAVEGAME);
        }, false); 

        // Pause/Resume game
        document.getElementById("pause").addEventListener("click", function(){
                togglePause();
        }, false);

        // Reset game
        document.getElementById("reset-btn").addEventListener("click", function(){
                reset();
        }, false);

        // Download the savegamefile
        document.getElementById("download-savegame").addEventListener("click", function(){
                gba.downloadSavedata();
        }, false);

        // Mute/Unmute emulator
        document.getElementById("audio-enabled-checkbox").addEventListener("change", function(){
            gba.audio.masterEnable = this.checked;
        }, false);

        // Handle volume level slider
        document.getElementById("volume-level-slider").addEventListener("change", function(){
            var volumeLevel = this.value;
            setVolume(volumeLevel);
        }, false);
        document.getElementById("volume-level-slider").addEventListener("input", function(){
            var volumeLevel = this.value;
            setVolume(volumeLevel);

            console.log(gba.audio);
        }, false);

        commands.forEach((command) => {
            if (document.getElementById(command)) {
                document.getElementById(command).ontouchstart = e => {
                    gba.keypad.clickHandlerStart({
                        ...e,
                        clickedButton: gba.keypad[command],
                    });
                };
        
                document.getElementById(command).ontouchend = e => {
                    gba.keypad.clickHandlerEnd({
                        ...e,
                        clickedButton: gba.keypad[command],
                    });
                };
            }
        });
    }

    render() {
        const {
            classes,
        } = this.props; // Canvas 480 x 320 => 320 x 214
        const screenWidth = window.screen.width;
        const width = screenWidth > 480 ? 480 : screenWidth;
        const height = screenWidth > 480 ? 320 : 320 * screenWidth / 480;

        return (
            <div className={classes.container}>
                {this.state.installButton && <Button onClick={this.installApp}>Install as application</Button>}

                <div className={classes.screen}>
                    <div id="fullscreenable">
                        <canvas id="screen" className={classes.canvas} width={`${width}`} height={`${height}`}></canvas>
                        
                        {screenWidth <= 480 ? <GBAMobileController goFull={this.goFull} throttle={this.state.throttle} toogleSpeed={this.toogleSpeed} /> : <GBAControlsHelper />}
                    </div>

                    <div id="controls" className={classes.controls}>
                        <div id="preload">
                            <h4 className={classes.noselect}>App Controls</h4>
                            <button className={classes.button} id="select"> Select ROM file </button>
                            <input id="loader" type="file" accept=".gba" />
                            <button className={classes.button} id="select-savegame-btn">Upload Savegame</button>
                            <input id="saveloader" type="file" />
                        </div>
                        <div id="ingame" className={classes.hidden}>
                            <h4 className={classes.noselect}>In-game controls</h4>
                            <button className={classes.button} id="pause">Pause game</button>
                            <button className={classes.button} id="reset-btn">Reset</button>
                            <button className={classes.button} id="download-savegame">Download Savegame File</button>

                            <div id="sound">
                                <p>Audio enabled</p>
                                <input type="checkbox" id="audio-enabled-checkbox" />
                                <p>Change sound level</p>
                                <input id="volume-level-slider" type="range" min="0" max="1" step="any" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(GBAScreen);