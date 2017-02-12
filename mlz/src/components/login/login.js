import React, { Component } from 'react';
import {AppRegistry} from 'react-native';
import { Row, Form, Item, Grid, Input, Col, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon , Text} from 'native-base';
import firebase from 'firebase';
import FirebaseConfig from '../firebase/firebase_config';

import  { Actions } from 'react-native-router-flux';
export default class Login extends Component {
constructor(props) {
    super(props);
    this.state = { email: '' };
    this.state = { senha: '' };
}

logarUsuario() {
    let senha = this.state.senha;
    let email = this.state.email;
    const usuario = firebase.auth();
    usuario.signInWithEmailAndPassword(
      email,
      senha
    ).then(Actions.sobre)
    .catch(
      (erro) => {
        alert(erro.message);
      }
    ); 
  }

  render() {
    return (
      <Container  style={{ backgroundColor: '#f2f2f2'}}>
        <Form style={{marginBottom: 20, marginTop:70}}>
          <Item rounded style={{ margin: 10}}>
            <Input onChangeText={(email) => this.setState({ email }) }  style={{ padding: 20, fontSize:12}} rounded placeholder="Username" />
          </Item>
          <Item style={{ margin: 10}} rounded>
            <Input onChangeText={(senha) => this.setState({ senha })} style={{ padding: 20, fontSize:12}} placeholder="Password" />
          </Item>
        </Form>
        <Button  onPress={ () => { this.logarUsuario(); }} style={{ margin: 10}} block info>
          <Text>Logar</Text>
        </Button>
      </Container>
      );
  }
}
