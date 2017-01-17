import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Button, TextInput } from 'react-native';
import firebase from 'firebase';

export default class manuelzao extends Component {

  constructor(props) {
    super(props);
    this.state = { email: '' };
    this.state = { senha: '' };
  }

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


cadastraUsuario() {
 var senha = this.state.senha;
 var email = this.state.email;

  const usuario = firebase.auth();

  usuario.createUserWithEmailAndPassword(email, senha)
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
    ).catch(
      (erro) => {
        alert(erro.message);
      }
    ); 
  }

  render() {
    return (   

      <View> 
      <View style={{ padding: 10} }>
        <TextInput
          style={{height: 40}}
          placeholder="Informe seu E-mail"
          onChangeText={(email) => this.setState({ email })}
        />

      </View>
       <View style={{padding: 10}}>
        <TextInput
          style={{height: 40}}
          placeholder="Informe sua senha"
          onChangeText={(senha) => this.setState({senha})}
        /> 
      </View>
      <View>     
         <Button
        onPress={ () => { this.cadastraUsuario(); } }
        title="Cadastrar usuário"
        color="#841584"
        accessibilityLabel="Salvar dados"
        />
      </View>

      <View>     
         <Button
        onPress={ () => { this.verificarUsuarioLogado(); } }
        title="Verificar usuário"
        color="#841584"
        accessibilityLabel="Verificar usuário"
        />
      </View>

      <View>     
         <Button
        onPress={ () => { this.deslogarUsuario(); } }
        title="Deslogar usuário"
        color="#841584"
        accessibilityLabel="Deslogar usuário"
        />
      </View>

         <View>     
         <Button
        onPress={ () => { this.logarUsuario(); } }
        title="Logar usuário"
        color="#841584"
        accessibilityLabel="Logar usuário"
        />
      </View>

    </View>

    );
  } 


}

AppRegistry.registerComponent('manuelzao', () => manuelzao);












  // constructor(props){
  //   super(props);
  //   this.state = {pontuacao : 0}
  // }


// salvarDados(){
//   var funcionarios = firebase.database().ref("funcionarios");
//    usar o .push(), pois ele gera o id do cadastro 
//   funcionarios.push().set({ 
//       nome: "Sergio Lopes",
//       altura: "1.90",
//       peso: "70kg"
//   });
// }

// recuperarDados(){
//   var pontuacao = firebase.database().ref("pontuacao");

//   pontuacao.on('value', (snapshot) => {   
//     var pontos = snapshot.val();
//     this.setState( {pontuacao: pontos} );
//   } );
// }

// no render , dentro do render
 // let {pontuacao} = this.state;

 // <Text> {pontuacao}</Text>