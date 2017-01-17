import React, { Component } from 'react';
import {StyleSheet, Text, View, Button, TextInput } from 'react-native';
import  { Actions } from 'react-native-router-flux';
import firebase from 'firebase';

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = { email: '' };
    this.state = { senha: '' };
  }


componentWillMount() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {   
         Actions.home();    
      } else {      
      }
    });
  }

  verificarUsuarioLogado() {
    const usuario = firebase.auth();

    usuario.onAuthStateChanged(
    (usuarioAtual) => {
      if (usuarioAtual) {
       alert('Usuário Logado');
        this.setState({
            logged: true
           
          });
       Actions.home();
      } else {
      alert('usuário não estar logado');
      } 
    }
    );
    // const usuarioAtual = usuario.currentUser;
    // if(usuarioAtual) {
    //    alert('Usuário Logado')
    // } else {
    //   alert('usuário não estar logado')
    // }
  }

  deslogarUsuario() {
     const usuario = firebase.auth();
     usuario.signOut();
  }

  logarUsuario() {
    var senha = this.state.senha;
    var email = this.state.email;
    const usuario = firebase.auth();
    usuario.signInWithEmailAndPassword(
      email,
      senha
    ).then(Actions.home)
    .catch(
      (erro) => {
        alert(erro.message);
      }
    ); 
  }

  render() {

    return (   
      <View> 
      <View style={{ padding: 10 }}>
        <TextInput
          style={{ height: 40 }}
          placeholder="Informe seu E-mail"
          onChangeText={(email) => this.setState({ email })}
        />
      </View>

       <View style={{ padding: 10 }}>
        <TextInput
          style={{ height: 40 }}
          placeholder="Informe sua senha"
          onChangeText={(senha) => this.setState({ senha })}
        /> 
      </View>

    <View>     
         <Button
        onPress={ () => { this.logarUsuario(); }}
        title="Logar usuário"
        color="#841584"
        accessibilityLabel="Logar usuário"
        />
      </View>

      <View>     
         <Button
        onPress={ () => { this.verificarUsuarioLogado(); }}
        title="Verificar usuário"
        color="#841584"
        accessibilityLabel="Verificar usuário"
        />
      </View>

      <View>     
        <Button
        onPress={ () => { this.deslogarUsuario(); }}
        title="Deslogar usuário"
        color="#841584"
        accessibilityLabel="Deslogar usuário"
        />
      </View>      

      <View>     
        <Button
        onPress={ () => { Actions.cadastro(); }}
        title=" IR PARA Cadastrar usuário"
        color="#841584"
        accessibilityLabel="Cadastrar usuário"
        />
      </View>

      <View>     
        <Button
        onPress={ () => { Actions.sobre(); }}
        title="Sobre o Manuelzão"
        color="#841584"
        accessibilityLabel="Cadastrar usuário"
        />
      </View>

        <View>     
        <Button
        onPress={() => { Actions.home(); }}
        title="Home"
        color="#841584"
        accessibilityLabel="Home"
        />
      </View>

    </View>

    );
  } 
}
