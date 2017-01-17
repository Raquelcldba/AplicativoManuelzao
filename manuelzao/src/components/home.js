import React, { Component } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import firebase from 'firebase';
import MultipleChoice from 'react-native-multiple-choice';
import GetLocalizao from './get-localizao';



export default class Home extends Component {
	constructor(props) {
    super(props);
    this.state = { 
    	text: '',
    	problema: '',
    	lastPosition: ''
    };
   
  }
  salvarDados() {
	var database = firebase.database();

	var descricao = this.state.text;
	var problema = this.state.problema;

	database.ref('Descricao').set(descricao);
	database.ref('Problema').set(problema);

  }


  render() {
    return ( 
	<View> 
	<View> 
		<Text> Selecione o problema que esta ocorrendo: </Text>
	</View> 

	<View> 
	 <MultipleChoice
    options={[
    'Poluição do rio',
    'Peixe Morto',
    'Poluição por mercurio',
    'Peixe morto',
    'Rio seco'
    ]}
 
    onSelection={(option)=>alert(option + ' was selected!')}
     onSelection={(problema) => this.setState({ problema })}
	/>
	</View> 
   <Text>{ this.state.problema }</Text>

	<View> 
		<Text>Descrava o problema que esta ocorrendo: </Text>
	</View> 

	<View> 
    <TextInput
        style={{ height: 100, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={(text) => this.setState({ text })}
        value={this.state.text}
      />
      <Text>{ this.state.text }</Text>
	</View> 

	<GetLocalizao />

    <View>     
    <Button
    onPress={() => { this.salvarDados(); }}
    title="Enviar"
    color="#841584"
    accessibilityLabel="Enviar"
    />
  </View>   

	</View> 
    );
  }

}

