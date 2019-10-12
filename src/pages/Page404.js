import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withTheme } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import AlertIcon from '@material-ui/icons/ErrorOutline';

const useNonExistingPageStyle = makeStyles((theme) => ({
  background: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#aaf',
    overflow: 'hidden',
    textAlign: 'center',
  },
  alertIcon: {
    width: '40vh',
    height: '40vh',
    marginTop: '5vh',
    color: '#77f',
  },
  link: {
    color: '#77f',
    textDecorationColor: '#77f',
    '&:visited, &:hover, &:active': {
      color: '#55f',
      textDecorationColor: '#55f',
    },
  },
}));

function Page404() {
  const classes = useNonExistingPageStyle();

  return (
    <div className={classes.background}>
      <AlertIcon className={classes.alertIcon} />
      <Typography
        variant="h2"
        color="primary"
      >
        This page does not exist.
      </Typography>
      <br />
      <Link to="/" className={classes.link}>
        Please follow to the main page.
      </Link>
    </div>
  );
}

export default withTheme(Page404);
