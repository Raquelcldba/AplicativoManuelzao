import React, { Component } from 'react';
import { Container, Content, Text, Button, Left, Header, Body, Title, Right } from 'native-base';


export default class HeaderMlz extends Component {
    render() {
        return ( 
		    <Header>
	            <Left>
	                <Button transparent>
	                   
	                </Button>
	            </Left>
	            <Body>
	                <Title>{this.props.title}</Title>
	            </Body>
	            <Right />
	        </Header>       
        );
    }
}