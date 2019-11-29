import React from 'react';
import { Button, withStyles } from '@material-ui/core';
import { commands } from './GBAScreen';

const styles = () => {
    const width = window.screen.width;

    return {
        container: {
            position: 'relative',
            height: 300,
        },
        "LEFT": {
            position: 'absolute',
            left: 8,
            top: 150,
            color: 'white',

            '& span': {
                border: '1px solid white',
                borderRadius: '50%',
            },
        },
        "RIGHT": {
            position: 'absolute',
            left: 108,
            top: 150,
            color: 'white',

            '& span': {
                border: '1px solid white',
                borderRadius: '50%',
            },
        },
        "UP": {
            position: 'absolute',
            left: 58,
            top: 100,
            color: 'white',

            '& span': {
                border: '1px solid white',
                borderRadius: '50%',
            },
        },
        "DOWN": {
            position: 'absolute',
            left: 58,
            top: 200,
            color: 'white',

            '& span': {
                border: '1px solid white',
                borderRadius: '50%',
            },
        },
        "A": {
            position: 'absolute',
            right: 8,
            top: 130,
            color: 'white',

            '& span': {
                border: '1px solid white',
                borderRadius: '50%',
            },
        },
        "B": {
            position: 'absolute',
            right: 58,
            top: 170,
            color: 'white',

            '& span': {
                border: '1px solid white',
                borderRadius: '50%',
            },
        },
        "R": {
            position: 'absolute',
            right: 8,
            top: 30,
            color: 'white',

            '& span': {
                border: '1px solid white',
                borderRadius: '50%',
            },
        },
        "L": {
            position: 'absolute',
            left: 8,
            top: 30,
            color: 'white',

            '& span': {
                border: '1px solid white',
                borderRadius: '50%',
            },
        },
        "START": {
            position: 'absolute',
            right: 70,
            bottom: 8,
            color: 'white',
        },
        "SELECT": {
            position: 'absolute',
            left: 70,
            bottom: 8,
            color: 'white',
        },
        fullscreen: {
            color: 'white',
        }
    };
};

const commandToStr = {
    "LEFT": String.fromCharCode(parseInt("+2190", 16)),
    "RIGHT": String.fromCharCode(parseInt("+2192", 16)),
    "UP": String.fromCharCode(parseInt("+2191", 16)),
    "DOWN": String.fromCharCode(parseInt("+2193", 16)),
    "A": "A",
    "B": "B",
    "R": "R",
    "L": "L",
    "START": "START",
    "SELECT": "SELECT",
}

const GBAMobileController = ({ classes, goFull }) => {
    // COmented for PWA reasons
    // <Button className={classes.fullscreen} onClick={goFull}>Fullscreen</Button>
    return (
        <div className={classes.container}>
            {commands.map(command => (
                <Button id={command} className={classes[command]}>{commandToStr[command]}</Button>
            ))}
            {(document.body.requestFullscreen ||
                document.body.mozRequestFullScreen ||
                document.body.webkitRequestFullScreen ||
                document.body.msRequestFullscreen) &&
                <Button className={classes.fullscreen} onClick={goFull}>Fullscreen</Button>}
        </div>
    );
}

export default withStyles(styles)(GBAMobileController);
