import React from 'react';
import { Grid, Paper, makeStyles } from '@material-ui/core';

const useStyle = makeStyles((theme) => ({
    container: {
        width: '100%',
        height: 150,
        textShadow: 'none',
    },
    paper: {
        minWidth: 'fit-content',
        minHeight: 'fit-content',
        padding: 4,
    },
}));

function GBAControlsHelper (props) {
    const classes = useStyle();

    return (
        <Grid
            className={classes.container}
            container
            spacing={3}
            justify={'center'}
            alignItems={'center'}
            direction={'column'}
        >
            <Grid
                item
                container
                spacing={3}
                justify={'center'}
                alignItems={'center'}
                direction={'row'}
                xs={6}
            >
                <Grid item>
                    <Paper className={classes.paper}>GBA Buttons</Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>A</Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>B</Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>L</Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>R</Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>Start</Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>Select</Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>Arrows</Paper>
                </Grid>
            </Grid>
            <Grid
                item
                container
                spacing={3}
                justify={'center'}
                alignItems={'center'}
                direction={'row'}
                xs={6}
            >
                <Grid item>
                    <Paper className={classes.paper}>Respective Keyboards</Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>Z</Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>X</Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>A</Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>S</Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>Enter</Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>\</Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>Arrows</Paper>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default GBAControlsHelper;