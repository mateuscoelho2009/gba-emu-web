import React from 'react';
import { Table, Paper, makeStyles, TableCell, TableRow } from '@material-ui/core';

const useStyle = makeStyles((theme) => ({
    container: {
        width: '100%',
        maxWidth: 700,
        margin: '16px auto',
        height: 150,
        textShadow: 'none',

        '& td': {
            padding: 0,
        },
    },
    paper: {
        textAlign: 'center',
        margin: 0,
        borderRadius: 0,
        background: '#759',
        color: 'white',
        fontWeight: 'bold',
    },
    topPaper: {
        background: '#648',
    },
}));

function GBAControlsHelper (props) {
    const classes = useStyle();

    return (
        <Table className={classes.container}>
            <TableRow>
                <TableCell>
                    <Paper className={`${classes.paper} ${classes.topPaper}`}>GBA Buttons</Paper>
                </TableCell>
                <TableCell>
                    <Paper className={`${classes.paper} ${classes.topPaper}`}>Respective Keyboard</Paper>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>
                    <Paper className={classes.paper}>A</Paper>
                </TableCell>
                <TableCell>
                    <Paper className={classes.paper}>Z</Paper>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>
                    <Paper className={classes.paper}>B</Paper>
                </TableCell>
                <TableCell>
                    <Paper className={classes.paper}>X</Paper>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>
                    <Paper className={classes.paper}>L</Paper>
                </TableCell>
                <TableCell>
                    <Paper className={classes.paper}>A</Paper>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>
                    <Paper className={classes.paper}>R</Paper>
                </TableCell>
                <TableCell>
                    <Paper className={classes.paper}>S</Paper>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>
                    <Paper className={classes.paper}>Start</Paper>
                </TableCell>
                <TableCell>
                    <Paper className={classes.paper}>Enter</Paper>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>
                    <Paper className={classes.paper}>Select</Paper>
                </TableCell>
                <TableCell>
                    <Paper className={classes.paper}>\</Paper>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>
                    <Paper className={classes.paper}>Arrows</Paper>
                </TableCell>
                <TableCell>
                    <Paper className={classes.paper}>Arrows</Paper>
                </TableCell>
            </TableRow>
        </Table>
    );
}

export default GBAControlsHelper;