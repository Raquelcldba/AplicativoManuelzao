import React, { Component } from 'react';
import { Container, Content, Text, Button, Left, Header, Body, Title, Right, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';


export default class HeaderMlz extends Component {


    render() {
        return ( 
		    <Header>
	            <Left>
	                <Button transparent>
	                	  
	                </Button>
	            </Left>
	            <Body>
	                <Title style={{color:'#67aefc'}}>{this.props.title}</Title>
	            </Body>
	            <Right />
	        </Header>       
        );
    }
}