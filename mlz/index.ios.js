import React, { Component } from 'react';
import {AppRegistry } from 'react-native';
import { Container, Header, Title, Content, Body} from 'native-base';
import { Router, Scene, Actions } from 'react-native-router-flux';
import firebase from 'firebase';


import Login from './src/components/login/login';
import Sobre from './src/components/about/sobre';
import Home from './src/components/home/home';



export default class mlz extends Component {
componentWillMount() {
    firebase.auth().onAuthStateChanged(function(user) {
     if (user) {   
         Actions.home();    
      } else {      
      }
    });
  }

  render() {
    return (
    <Container  style={{ backgroundColor: '#f2f2f2'}}> 
        <Router> 
           <Scene key="root">     
                <Scene key='login' component={Login} title='Login' hideNavBar />
                <Scene key='sobre' component={Sobre} title='Sobre' hideNavBar={false} /> 
                <Scene key='home' component={Home} title='Home' hideNavBar={true} /> 
            </Scene> 
        </Router>
    </Container>
    );
    }
}













AppRegistry.registerComponent('mlz', () => mlz);
