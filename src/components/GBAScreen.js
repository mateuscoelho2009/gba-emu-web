import React from 'react';
import useScript from '../utils/UseScript';

function GBAScreen () {
    return (
        <>
            <canvas id="screen" width="480" height="320"></canvas>

            <div id="controls">
                <h4>App Controls</h4>
                <div id="preload">
                    <button id="select"> Select ROM file </button>
                    <input id="loader" type="file" accept=".gba" />
                    <button id="select-savegame-btn">Upload Savegame</button>
                    <input id="saveloader" type="file" />
                </div>
                <br />
                <h4>In-game controls</h4>
                <div id="ingame" class="hidden">
                    <button id="pause">Pause game</button>
                    <button id="reset-btn">Reset</button>
                    <button id="download-savegame">Download Savegame File</button>

                    <div id="sound">
                        <p>Audio enabled</p>
                        <input type="checkbox" id="audio-enabled-checkbox" checked="checked" />
                        <p>Change sound level</p>
                        <input id="volume-level-slider" type="range" min="0" max="1" value="1" step="any" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default GBAScreen;