import React, { Component } from 'react';
import firebase from 'firebase';
import HeaderMlz from '../header/header';
import Select from '../select/select';


import PickerExample from '../picker/picker';

import { Container, Title, Content, Left, Button, Body, Right, ListItem, Text} from 'native-base';

export default class Home extends Component {
 constructor(props){
    super(props);
    this.state = {
      selecionado: []
    };
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
	            <HeaderMlz title='Home'/>

	         			
	           	<PickerExample setItensSelecionado={this.setItensSelecionado} />
	           

            </Container>
        );
    }
}
