import React from 'react';
import firebase from 'firebase';
import { FirebaseConfig } from './private/firebase-config';
import PhonelinkRingIcon from '@material-ui/icons/PhonelinkRing';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    logOut,
    logIn,
} from './actions';
import './Wrapper.css';

firebase.initializeApp(FirebaseConfig);

class Wrapper extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
            return;
        }

        const userId = user.uid;
        const username = user.displayName;
        
        if (userId) {
            firebase.firestore().collection(userId).get()
                .then((snapshot) => {
                    const measurements = [];
                    snapshot.forEach((doc) => {
                        console.log(doc.id, '=>', doc.data());
                        measurements.push({
                            name: doc.id,
                            data: doc.data(),
                        });
                    });
    
                    this.props.logIn(userId, username, measurements);
                });
        }
    });
  }
  
  handleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }
  
  handleLogOut() {
    this.props.logOut();
  }

  render() {
    const {
        username,
    } = this.props;

    return (
      <div className="app">
        <div className="app__header">
          <Link to='/' className="app__brand">
            <PhonelinkRingIcon className="app__icon" />
            <h2>
                Smart Valve
            </h2>
          </Link>
          <div className="app__brand">
            <p>
                {username}
            </p>
            { !username ? (
                <button
                className="app__button"
                onClick={this.handleSignIn.bind(this)}
                >
                Sign in
                </button>
            ) : (
                <button
                className="app__button"
                onClick={this.handleLogOut.bind(this)}
                >
                Logout
                </button>
            )}
          </div>
        </div>
        <div className="app__list">
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
    username: store.userState.username,
    userId: store.userState.userId,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
        logOut,
        logIn,
    }, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
) (Wrapper);
