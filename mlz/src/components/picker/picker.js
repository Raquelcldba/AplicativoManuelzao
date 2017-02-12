import React, { Component } from 'react';
import firebase from 'firebase';
import { Container, Content, Picker, Text, Button, ListItem} from 'native-base';
import {StyleSheet} from 'react-native';


const Item = Picker.Item

export default class PickerExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: undefined,
            corAguaselected: 'Clara',
            odorSelected: 'Não há',
            materialSuspensao: 'Não Há',
            residuoSolido: 'Não Há',
            esgoto: 'Não Há',
            erosao: 'Não Há',
            vegetacaoMargem: 'Pouco alterada',
            initialPosition: 'unknown',
            lastPosition: 'unknown',
           
        }
    }


/* locale */
 watchID: ?number = null;

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });

  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }
  /* end locale */

  salvarDados() {
  const database = firebase.database();

  const locale = this.state.lastPosition;

  const corAgua = this.state.corAguaselected;
  const odorAgua = this.state.odorSelected;
  const materialSuspensao = this.state.materialSuspensao;
  const esgoto = this.state.esgoto;
  const residuoSolido = this.state.residuoSolido;
  const erosao = this.state.erosao;
  const vegetacaoMargem = this.state.vegetacaoMargem;


  database.ref('Localização').set(locale);
  database.ref('Cor da Água').set(corAgua);
  database.ref('Odor da Água').set(odorAgua);
  database.ref('Material em Suspensão').set(materialSuspensao);
  database.ref('Presença de resíduos sólidos ').set(residuoSolido);
  database.ref('Esgoto').set(esgoto);
  database.ref('Focos de erosão').set(erosao);
  database.ref('Presença de focos de erosão').set(vegetacaoMargem);


  }


  onValueChange (key: string, value: string) {
      const newState = {};
      newState[key] = value;
      this.setState(newState);
  }

  getItemSelecionado = (corAguaselected) => {
  this.props.setItensSelecionado(corAguaselected);



  }

    render() {
     
        return ( 
            <Content>
                <ListItem itemDivider>
                      <Text>Qualidade da Água</Text>
                </ListItem>     
                <Text  style={{color:'#378ad8', fontSize:14, paddingLeft:15, paddingTop: 15}}>Cor da água:</Text>
                <Picker
                    iosHeader="Qualidade da Água"
                    mode="dropdown"
                    selectedValue={this.state.corAguaselected}
                    onValueChange={this.onValueChange.bind(this, 'corAguaselected')}>
                    <Item label='Clara' value='Clara' />
                    <Item label='Media' value='Media'/>  
                    <Item label='Escura' value='Escura' />                 
               </Picker>
                <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Odor da água</Text>
                <Picker
                    iosHeader="Odor da água"
                    mode="dropdown"
                    selectedValue={this.state.odorSelected}
                    onValueChange={this.onValueChange.bind(this, 'odorSelected')}>
                    <Item label='Não há' value='Não há' />
                    <Item label='Com odor' value='Com Odor' />  
                    <Item label='Odor Forte' value='Odor Forte' />                 
               </Picker>

                <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Material em suspençao</Text>
                <Picker
                    iosHeader="Material em suspençao"
                    mode="dropdown"
                    selectedValue={this.state.materialSuspensao}
                    onValueChange={this.onValueChange.bind(this, 'materialSuspensao')}>
                    <Item label='Não Há' value='Não Há' />
                    <Item label='Pouco' value='Pouco' />  
                    <Item label='Muito' value='Muito' />                 
               </Picker>
                <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Presença de resíduos sólidos (Margens e leito)</Text>
                <Picker
                    iosHeader="Presença de resíduos sólidos (Margens e leito)"
                    mode="dropdown"
                    selectedValue={this.state.residuoSolido}
                    onValueChange={this.onValueChange.bind(this, 'residuoSolido')}>
                    <Item label='Não Há' value='Não Há' />
                    <Item label='Pouco' value='Pouco' />  
                    <Item label='Muito' value='Muito' />                 
               </Picker>
                <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Presença de esgotos</Text>
                <Picker
                    iosHeader="Presença de esgotos"
                    mode="dropdown"
                    selectedValue={this.state.esgoto}
                    onValueChange={this.onValueChange.bind(this, 'esgoto')}>
                    <Item label='Não Há' value='Não Há' />
                    <Item label='Provável' value='Provável' />  
                    <Item label='Visível' value='Visível' />                 
               </Picker>

                <ListItem itemDivider>
                      <Text>Ocupação e paisagem</Text>
                </ListItem> 
                <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Presença de focos de erosão nas margens</Text>
                <Picker
                    iosHeader="Presença de focos de erosão nas margens"
                    mode="dropdown"
                    selectedValue={this.state.erosao}
                    onValueChange={this.onValueChange.bind(this, 'erosao')}>
                    <Item label='Não Há' value='Não Há' />
                    <Item label='Pouco significativa' value='Pouco significativa' />  
                    <Item label='Significativa' value='Significativa' />                 
               </Picker>
                 <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Vegetação nas Margens</Text>
                <Picker
                    iosHeader="Vegetação nas Margens"
                    mode="dropdown"
                    selectedValue={this.state.vegetacaoMargem}
                    onValueChange={this.onValueChange.bind(this, 'vegetacaoMargem')}>
                    <Item label='Pouco alterada' value='Pouco alterada' />
                    <Item label='Alterada' value='Alterada' />  
                    <Item label='Muito alterada ou ausente' value='Muito alterada ou ausente' />                 
               </Picker>






                <Button block info style={{ margin: 10, marginTop:50}}
                     onPress={() => {  this.salvarDados() }} > 
                    <Text>Salvar</Text>
                </Button>   
                     
               </Content>   
            
                   
                  
        );
    }
}

