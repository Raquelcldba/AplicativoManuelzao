import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Container, Header, Title, Content, Body, Spinner } from 'native-base';
import { Router, Scene, Actions,Switch} from 'react-native-router-flux';
import firebase from 'firebase';


import Login from './src/components/login/login';
import Cadastro from './src/components/cadastro/cadastro';
import Sobre from './src/components/about/sobre';
import Formulario from './src/components/formulario/formulario';
import Galeria from './src/components/galeria/galeria';
import tipoCursoDagua from './src/components/tipoCursoDagua/tipoCursoDagua';
import CameraMLZ from './src/components/camera/camera';

import { AsyncStorage} from 'react-native';


export default class mlz extends Component {
    constructor(props){
        super(props);
        this.state = {
          loggedIn: false,
          loaded: false,
          user: ''
        };
    }

    // verificar no storage local
    async  verificarUsuarioLogado() {
        var value = await AsyncStorage.getItem('user')

        if(value) {
             this.setState({ loggedIn: true, loaded: true })
        } else {
             this.setState({ loggedIn: false, loaded: true })               
        }
        return value
    }

    componentWillMount() {
        this.verificarUsuarioLogado();
    }

    render() {    
        if (!this.state.loaded) return (<Spinner  style={{marginTop: 30}} color='#d6d6d6' /> );

        if(this.state.loggedIn) { 
            return (
                <Container style = {{ backgroundColor: '#f2f2f2' } }>
                    <Router>
                        <Scene key = "root" titleStyle={{color: '#0070c9'}} >
                            <Scene key = 'tipoCursoDagua' component = { tipoCursoDagua } initial={true} title = 'Home' hideNavBar = { true } />                                         
                            <Scene key = 'Formulario' component = { Formulario } title = 'Registrar Informação' hideNavBar = { false } /> 
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
                <Container style = {{ backgroundColor: '#f2f2f2' } }>
                    <Router>
                        <Scene key = "root" titleStyle={{color: '#0070c9'}} >   
                            <Scene key = 'login' component = { Login } title = 'Login' hideNavBar initial={true}/ >
                            <Scene key = 'Formulario' component = { Formulario } title = 'Home' hideNavBar = { false }/> 
                            <Scene key = 'Cadastro' component = { Cadastro } title = 'Cadastro' hideNavBar = { false } />  
                            <Scene key = 'Sobre' component = { Sobre } title = 'Sobre' hideNavBar = { false } />  
                            <Scene key = 'tipoCursoDagua' component = { tipoCursoDagua } title = 'Home' hideNavBar = { false } />                                                                    
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