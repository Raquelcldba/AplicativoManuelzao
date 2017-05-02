import React, { Component } from 'react';
import { Container, Content, Text, Button, Left, Header, Body, Title, Right, Icon } from 'native-base';
import firebase from 'firebase';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';



export default class HeaderMlz extends Component {
 deslogarUsuario() {
   AsyncStorage.multiRemove(['user','password'],(err, result) => {

   });
    //  AsyncStorage.multiGet(['user','password'],(err, result) => {
    //   alert(result);
    // });
   const usuario = firebase.auth();
	   usuario.signOut();
	   Actions.login();
  }

    render() {
        return ( 
		    <Header style={{backgroundColor:'#f2f2f2'}}>
	            <Left>
	                <Button transparent>	                	  
	                </Button>
	            </Left>
	            <Body>
	                <Title style={{color:'#67aefc'}}>{this.props.title}</Title>
	            </Body>
	                 <Right>
                        <Button transparent
                         onPress={() => {  this.deslogarUsuario() }}>
                            <Icon style={{color:'#0070c9'}}name='power' />
                        </Button>
                    </Right>
	        </Header>       
        );
    }
}