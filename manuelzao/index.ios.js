import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import firebase from 'firebase';

import { Router, Scene } from 'react-native-router-flux';
import Login from './src/components/login';
import Cadastro from './src/components/cadastro';
import Sobre from './src/components/sobre';
import Home from './src/components/home';




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
    <Router sceneStyle={{ paddingTop: 70 }}> 
      <Scene key='login' component={Login} title='Login'   />
      <Scene key='cadastro' component={Cadastro} title='Cadastro'  /> 
      <Scene key='sobre' component={Sobre} title='Sobre'  /> 
      <Scene key='home' component={Home} title='Home' />        
    </Router>

    );
  } 
}

AppRegistry.registerComponent('manuelzao', () => manuelzao);