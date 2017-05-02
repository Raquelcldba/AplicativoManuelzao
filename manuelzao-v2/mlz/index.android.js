import React, { Component } from 'react';
import { AppRegistry, StyleSheet } from 'react-native';
import { Container, Header, Title, Content, Body, Spinner } from 'native-base';
import { Router, Scene, Actions,Switch} from 'react-native-router-flux';
import firebase from 'firebase';


import Login from './src/components/login/login';
import Cadastro from './src/components/cadastro/cadastro';
import Sobre from './src/components/about/sobre';
import Home from './src/components/home/home';
import Galeria from './src/components/galeria/galeria';
import CameraMLZ from './src/components/camera/camera';


export default class mlz extends Component {
    constructor(props){
        super(props);
        this.state = {
          loggedIn: false,
          loaded: false
        };
    }

    componentWillMount() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                 this.setState({ loggedIn: true, loaded: true });

            } else { 
                  this.setState({ loggedIn: false, loaded: true });                

            }
        }.bind(this));
    }

    render() {    
        if (!this.state.loaded) return (<Spinner  style={{marginTop: 30}} color='#d6d6d6' /> );

        if(this.state.loggedIn) { 
            return (
                <Container>
                    <Router  navigationBarStyle={{backgroundColor: '#f2f2f2'}}  titleStyle={{color : "#0070c9"}}>
                        <Scene key = "root" >            
                            <Scene key = 'home' component = { Home } title = 'Home' hideNavBar = { true } initial={true}/> 
                            <Scene key = 'Cadastro' component = { Cadastro } title = 'Cadastro' hideNavBar = { false } /> 
                            <Scene key = 'CameraMLZ' component = { CameraMLZ } title = 'cameraMLZ' hideNavBar = { true }  />
                             <Scene key = 'Galeria' component = { Galeria } title = 'Galeria'  />
                            <Scene key = 'login' component = { Login } title = 'Login' hideNavBar / >             
                        </Scene>  
                    </Router>
                </Container>
            )            
        } else {
             return ( 
                <Container>
                    <Router navigationBarStyle={{backgroundColor: '#f2f2f2'}}  titleStyle={{color : "#0070c9"}}>
                        <Scene key = "root" >   
                            <Scene key = 'login' component = { Login } title = 'Login' hideNavBar initial={true}/ >
                            <Scene key = 'home' component = { Home } title = 'Home' hideNavBar = { true }/>  
                            <Scene key = 'Cadastro' component = { Cadastro } title = 'Cadastro' hideNavBar = { false } /> 
                            <Scene key = 'sobre' component = { Sobre } title = 'Sobre' hideNavBar = { false } />                             
                            <Scene key = 'CameraMLZ' component = { CameraMLZ } title = 'cameraMLZ' hideNavBar = { true }  />
                            <Scene key = 'Galeria' component = { Galeria } title = 'Galeria'  />                      
                        </Scene>  
                    </Router>
                </Container>
            );             
        }
    }
}

AppRegistry.registerComponent('mlz', () => mlz);
