import React, { Component } from 'react';
import { Container, Content, List, ListItem, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';
import HeaderMlz from '../header/header';

export default class TipoCursoDagua extends Component {

  render() {
    return ( 
       <Container>
            <HeaderMlz title='Home'/>	  
              <Content>
                    <List>
                        <ListItem itemDivider>
                            <Text>Selecione o tipo de ambiente</Text>
                        </ListItem>                    
                        <ListItem   onPress={ () => { Actions.Formulario({tipoProtocolo: 'nascente'}) }}>
                            <Text>Nascentes</Text>
                        </ListItem>
                        <ListItem onPress={ () => { Actions.Formulario({tipoProtocolo: 'cursoDagua'}) }}>
                            <Text>Curso D'agua</Text>
                        </ListItem>
                          <ListItem onPress={ () => { Actions.Formulario({tipoProtocolo: 'mortandadeDePeixe'}) }}>
                            <Text>Mortandade de Peixes</Text>
                        </ListItem>                    
                    </List>
                </Content>          
            </Container>
    );
  } 
}
