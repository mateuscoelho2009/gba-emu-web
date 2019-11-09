import React from 'react';
import { Button } from '@material-ui/core';
import { commands } from './GBAScreen';

const GBAMobileController = () => {
    return commands.map(command => (
        <Button id={command}>{command}</Button>
    ));
}

export default GBAMobileController;
