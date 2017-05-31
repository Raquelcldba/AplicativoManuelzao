import React, { Component } from 'react';
import {StyleSheet, View, TextInput } from 'react-native';
import {Form , Item, Input, Container, Button, Text} from 'native-base';
import  { Actions } from 'react-native-router-flux';
import firebase from 'firebase';

export default class Cadastro extends Component {

  constructor(props) {
    super(props);
    this.state = { email: 'seu email' };
    this.state = { senha: '' };
    this.state= {teste: true}
  }

  cadastraUsuario() {
   let senha = this.state.senha;
   let email = this.state.email;

    const usuario = firebase.auth();
    if(senha && email != '') {

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
  } else
    alert('Informe o E-mail e a Senha')
  }


  // verificarUsuarioLogado() {
  //   const usuario = firebase.auth();

  //   usuario.onAuthStateChanged(
  //   (usuarioAtual) => {
  //     if (usuarioAtual) {
  //      alert('Usuário Logado');
  //     } else {
  //     alert('usuário não estar logado');
  //     } 
  //   }
  //   );
  // }

  // deslogarUsuario() {
  //    const usuario = firebase.auth();
  //    usuario.signOut();

  // }




  render() {
    return (   
      <View style={{ paddingTop: 70, marginLeft: 16, marginRight: 16}}>
        <Item rounded style={{ marginTop: 20}}>
          <Input  keyboardType="email-address" onChangeText={(email) => this.setState({ email })} style={{ padding: 10, paddingLeft:20, fontSize:12}} rounded placeholder="Informe seu E-mail" />
        </Item>
        <Item rounded style={{ marginTop: 20}}>
          <Input secureTextEntry={true} onChangeText={(senha) => this.setState({ senha })} style={{ padding: 10, paddingLeft:20, fontSize:12}} rounded placeholder="Informe sua senha" />
        </Item>  
      <View>  
         <Button onPress={() => { this.cadastraUsuario(); }} style={{ marginTop: 24}} block info>
            <Text>Cadastrar</Text>
          </Button>      
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

