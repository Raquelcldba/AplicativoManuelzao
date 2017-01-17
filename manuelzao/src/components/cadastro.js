import React, { Component } from 'react';
import {StyleSheet, View, Button, TextInput } from 'react-native';
import  { Actions } from 'react-native-router-flux';
import firebase from 'firebase';

export default class Cadastro extends Component {

  constructor(props) {
    super(props);
    this.state = { email: '' };
    this.state = { senha: '' };
  }

cadastraUsuario() {
 var senha = this.state.senha;
 var email = this.state.email;

  const usuario = firebase.auth();

  usuario.createUserWithEmailAndPassword(email, senha)
  .then(Actions.home)
  .catch(
      (erro) => {
        var mensagemErro = '';
        if (erro.code === 'auth/weak-password') {
          mensagemErro = 'Mínimo 6 caracteres';
          alert(mensagemErro);
        }
        if (erro.code === 'auth/email-already-in-use') {
        mensagemErro = 'E-mail já em uso';
        alert(mensagemErro);
        }
        if (erro.code === 'auth/invalid-email') {
        mensagemErro = 'E-mail invalido';
        alert(mensagemErro);
        }
      }
    );
  }


  verificarUsuarioLogado() {
    const usuario = firebase.auth();

    usuario.onAuthStateChanged(
    (usuarioAtual) => {
      if (usuarioAtual) {
       alert('Usuário Logado');
      } else {
      alert('usuário não estar logado');
      } 
    }
    );
  }

  deslogarUsuario() {
     const usuario = firebase.auth();
     usuario.signOut();
  }

  render() {
    return (   

      <View> 
      <View style={{ padding: 10 }}>
        <TextInput
          style={{ height: 40} }
          placeholder="Informe seu E-mail"
          onChangeText={(email) => this.setState({ email })}
        />

      </View>
       <View style={{ padding: 10 }} >
        <TextInput
          style={{ height: 40 }}
          placeholder="Informe sua senha"
          onChangeText={(senha) => this.setState({ senha })}
        /> 
      </View>
      <View>     
         <Button
        onPress={() => { this.cadastraUsuario(); }}
        title="Cadastrar usuário"
        color="#841584"
        accessibilityLabel="Salvar dados"
        />
      </View>

      <View>     
         <Button
        onPress={() => { this.verificarUsuarioLogado(); }}
        title="Verificar usuário"
        color="#841584"
        accessibilityLabel="Verificar usuário"
        />
      </View>

      <View>     
         <Button
        onPress={() => { this.deslogarUsuario(); }}
        title="Deslogar usuário"
        color="#841584"
        accessibilityLabel="Deslogar usuário"
        />
      </View>      

    </View>

    );
  } 


}
const styles = StyleSheet.create({  
  container: {
    paddingTop: 70,
  },
});

