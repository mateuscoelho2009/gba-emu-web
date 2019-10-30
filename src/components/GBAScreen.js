import React from 'react';
import GameBoyAdvance from '../libs/js/gba';
import loadRom from '../libs/resources/xhr';
import '../libs/resources/main.css';
import CrashImage from '../libs/resources/crash.png';
import BackgroundImage from '../libs/resources/bg.png';
import Bios from '../libs/resources/bios.bin';
import { withStyles } from '@material-ui/core';
import GBAControlsHelper from './GBAControlsHelper';

const styles = () => ({
    container: {
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        background: '-webkit-linear-gradient(#765490 560px, #6A4883 620px, #433061 900px)',
        textAlign: 'center',
        fontFamily: '"Calibri", "Verdana", sans-serif',
        color: 'white',
        textShadow: '0 2px rgba(0, 0, 0, 0.6)',
    },
    screen: {
        background: `url('${BackgroundImage}') no-repeat top center`,
    },
    canvas: {
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
        }
    },
    controls: {
        borderRadius: 20,
        border: '1px solid rgba(0, 0, 0, 0.4)',
        borderTop: 'none',
        boxShadow: '0 4px 4px -2px rgba(0, 0, 0, 0.9), 0 -40px 2px -1px #433061 inset',
        width: 640,
        margin: 'auto',
        height: 200,
        overflow: 'hidden',
        backgroundColor: '#765490',
        position: 'relative',

        '&::before': {
            content: '""',
            display: 'block',
            height: 30,
            width: 647,
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
});

class GBAScreen extends React.Component {
    constructor(props) {
        super(props);

        this.initGBA = this.initGBA.bind(this);
    }

    componentDidMount() {
        this.initGBA();
    }

    initGBA() {
        var gba;
        var runCommands = [];
        const {
            classes,
        } = this.props;

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

            if (crash) {
                var context = gba.targetCanvas.getContext('2d');
                context.clearRect(0, 0, 480, 320);
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

            var drawInterval = setInterval(function () {
                i++;

                var pixelData = context.getImageData(0, 0, 240, 160);

                for (var y = 0; y < 160; ++y) {
                    for (var x = 0; x < 240; ++x) {
                        var xDiff = Math.abs(x - 120);
                        var yDiff = Math.abs(y - 80) * 0.8;
                        var xFactor = (120 - i - xDiff) / 120;
                        var yFactor = (80 - i - ((y & 1) * 10) - yDiff + Math.pow(xDiff, 1 / 2)) / 80;
                        pixelData.data[(x + y * 240) * 4 + 3] *= Math.pow(xFactor, 1 / 3) * Math.pow(yFactor, 1 / 2);
                    }
                }
                
                context.putImageData(pixelData, 0, 0);

                target.clearRect(0, 0, 480, 320);

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
    }

    render() {
        const {
            classes,
        } = this.props;

        return (
            <div className={classes.container}>
                <div className={classes.screen}>
                    <canvas id="screen" className={classes.canvas} width="480" height="320"></canvas>
                    
                    <GBAControlsHelper />

                    <div id="controls" className={classes.controls}>
                        <div id="preload">
                            <h4>App Controls</h4>
                            <button className={classes.button} id="select"> Select ROM file </button>
                            <input id="loader" type="file" accept=".gba" />
                            <button className={classes.button} id="select-savegame-btn">Upload Savegame</button>
                            <input id="saveloader" type="file" />
                        </div>
                        <div id="ingame" className={classes.hidden}>
                            <h4>In-game controls</h4>
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