import React, { Component } from 'react';
import {Text,CheckBox,ListItem,Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon } from 'native-base';

export default class Select extends Component {


handleClick = (teste) => {
      this.props.updateState(teste); 
     
  }


    render() {
        return (
             <Button onPress={() => {this.handleClick(222)}}></Button>
        );
    }
}
