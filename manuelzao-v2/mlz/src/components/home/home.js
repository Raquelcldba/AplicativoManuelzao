import React, { Component } from 'react';
import firebase from 'firebase';
import HeaderMlz from '../header/header';
import CameraMLZ from '../camera/camera';
import Formulario from '../picker/picker';
import { Container, Title, Content, Left, Button, Body, Right, ListItem, Text} from 'native-base';


export default class Home extends Component {
 constructor(props){
    super(props);
    this.state = {
      selecionado: []
    };
    alert(this.props.text)
  }

  setItensSelecionado = (selecionado) => {
      this.setState({
          selecionado: selecionado
      });
      alert(this.state.selecionado);
  }

  render() {
      return (
          <Container>                  			
           	<Formulario setItensSelecionado={this.setItensSelecionado} />   
          </Container>
                
      );
  }
}
