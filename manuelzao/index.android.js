import React, { Component } from 'react';
import {AppRegistry,StyleSheet,Text,View} from 'react-native';
import firebase from 'firebase';

export default class manuelzao extends Component {

componentWillMount() {

  var config = {
    apiKey: "AIzaSyCgup_D0mLIeGOp8XubC_jYQPUiCRHNIEU",
    authDomain: "manuelzao-5d236.firebaseapp.com",
    databaseURL: "https://manuelzao-5d236.firebaseio.com",
    storageBucket: "manuelzao-5d236.appspot.com",
    messagingSenderId: "89639731349"
  };

  firebase.initializeApp(config);

}


  render() {
    return (
      <View style={styles.container}>
        
      </View>
    );
  } 
}

AppRegistry.registerComponent('manuelzao', () => manuelzao);
