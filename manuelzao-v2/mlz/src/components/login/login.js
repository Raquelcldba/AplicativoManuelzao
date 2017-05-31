import React, { Component } from 'react';
import {AppRegistry, View, AsyncStorage} from 'react-native';
import { Row, Form, Item, Grid, Input, Col, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon , Text,Thumbnail} from 'native-base';
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
  if(this.state.email) { 
      let senha = this.state.senha;
      let email = this.state.email;
      const usuario = firebase.auth();
      usuario.signInWithEmailAndPassword(
        email,
        senha
      ).then(() => {this.saveUserLocalStorage(email, senha), Actions.tipoCursoDagua() })
      .catch(
        (erro) => {
          alert(erro.message);
        }
      ); 
   } else{
      alert('Preencher o E-mail e a Senha')
     }
  }

  saveUserLocalStorage(email, senha) {
   AsyncStorage.multiSet([ ['user', email], ['password', senha] ]);
    //  AsyncStorage.multiGet(['user','password'],(err, result) => {
    //   alert(result);
    // });
  }

  render() {
    return (
      <Container  style={{ backgroundColor: '#f2f2f2'}}>
        <Content style={{ margin: 16 }}>
          <View style={{ backgroundColor: '#f2f2f2',alignItems: 'center', justifyContent: 'center'}}>
            <Thumbnail style={{width: 142, height: 160, marginTop:50}} square source={require('./logo.png')} />   
          </View>
          <Form style={{marginBottom: 20, marginTop:30, justifyContent: 'center'}}>
            <Item rounded style={{ marginTop: 20}}>
              <Input   keyboardType="email-address" onChangeText={(email) => this.setState({ email }) }  style={{ padding: 10, paddingLeft:20, fontSize:12}} rounded placeholder="E-mail" />
            </Item>
            <Item style={{ marginTop: 20}} rounded>
              <Input secureTextEntry={true}  onChangeText={(senha) => this.setState({ senha })} style={{ padding: 10, paddingLeft:20,fontSize:12}} placeholder="Senha" />
            </Item>             
          </Form>
          <Text  onPress={ () => { Actions.Cadastro() }} style={{ fontSize: 10, alignItems: 'flex-start', marginLeft: 20, color:'gray'}}>Não possui uma conta? Cadastre-se!</Text>
          <Text  onPress={ () => { Actions.Sobre({text: 'aaaa'}) }} style={{ fontSize: 10, alignItems: 'flex-start', marginLeft: 20, color:'gray', marginTop: 20, marginBottom:20}}>Saiba mais sobre o aplicativo</Text>
          <Button  onPress={ () => { this.logarUsuario(); }} style={{ margin: 10}} block info>
            <Text>Logar</Text>
          </Button>
        </Content>
      </Container>
    );
  }
  
}

