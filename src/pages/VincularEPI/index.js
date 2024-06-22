import React, { useState, useEffect } from 'react';
import {View, TextInput, FlatList, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { corBranco, corPrincipal, corTexto, meusEstilos } from '../../style/MeusEstilos';
import { Picker } from '@react-native-picker/picker'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { endWS } from '../../Config';

const ComprarProduto = () => {
    const [Usuario, setUsuario] = useState('')
    const [Colaborador, setColaborador] = useState('')
    const [dadosEPIs, setDadosEPIs] = useState([])
    const [EPISelecionado, setEPISelecionado] = useState(0)
    const [dadosEPIsVinculados, setDadosEPIsVinculados] = useState([])

    const carregarDados = async () => {
        try {
            //Obter o Colaborador selecionado do AsyncStorage
            let ColaboradorSelecionado = await AsyncStorage.getItem('ColaboradorSelecionado')
            ColaboradorSelecionado = await JSON.parse(ColaboradorSelecionado)
            setColaborador(ColaboradorSelecionado)

            //Obter o usuário logado do AsyncStorage
            let UsuarioLogado = await AsyncStorage.getItem('UsuLogado')
            UsuarioLogado = await JSON.parse(UsuarioLogado)
            setUsuario(UsuarioLogado)

            //Buscar epis da API
            let resposta = await fetch(`${endWS}/epis/epis`)
            let dados = await resposta.json()
            setDadosEPIs(dados)

            //Buscar epis vinculados da API
            resposta = await fetch(`${endWS}/epis/obterVinculados/${ColaboradorSelecionado.id_colaborador}`)
            dados = await resposta.json()
            setDadosEPIsVinculados(dados)
        } catch (error) {
            console.warn ('Erro ao buscar dados', error)
        }
    }

    useEffect(() => {
        carregarDados()
    }, [])

    const botaoVincular = async () => {
        try {
            const resposta = await fetch(`${endWS}/epis/vincular`,
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        id_colaborador: Colaborador.id_colaborador,
                        id_colaborador_supervisor: Usuario.id_usuario,
                        id_epi: EPISelecionado
                    })
                }
            )
            if (resposta.ok) {
                alert('EPI vinculado com sucesso')
                carregarDados()
            } else {
                alert('Não foi possíve vincular o EPI')
            }

        } catch (error) {
            console.warn('Erro ao vincular:', error)
        }
    }

    const exibirItemLista = ({ item }) => {
        return (
            <TouchableOpacity style={meusEstilos.itemLista}>
                <Image source={{ uri: item.foto }} style={meusEstilos.imagemLista} />
                <View style={meusEstilos.textContainer}>
                    <Text style={{color:corPrincipal}}>{item.nome_epi}</Text>
                    <Text >Validade: {item.data_vencimento} </Text>
                    <Text >Vinculação: {item.data_cad}</Text>
                </View>
                <TouchableOpacity onPress={() => botaoExcluirVinculacao(item.id_vinculacao)}>
                    <MaterialIcons name="delete" size={24} color={corPrincipal} />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    const botaoExcluirVinculacao = async (id) => {
        try {
            const resposta = await fetch(`${endWS}/epis/excluirVinculacao/${id}`,
                { method: 'DELETE' })
            if (resposta.ok)
                carregarDados()
        } catch (error) {
            console.error('Erro ao excluir vinculação:', error)
            Alert('Erro ao excluir vinculação:', error)
        }
    }    

    return (
        <View style={meusEstilos.conteudoHeader}>
            <View style={{padding:20}}>
                <Text style={{color:corBranco}}>Colaborador:</Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color:corBranco, marginBottom: 20 }}>{Colaborador.nome}</Text>
                <Text style={{color:corBranco}}>Selecione o EPI: </Text>
                <View style={{backgroundColor:corBranco}}>
                    <Picker
                        selectedValue={EPISelecionado}
                        onValueChange={setEPISelecionado}
                        style={{ height: 50, width: '100%' }}
                    >
                        {/* Aqui receberemos os itens do picker*/}
                        {dadosEPIs.map((epi, index) => (
                            <Picker.Item key={index} label={epi.nome_epi} value={epi.id_epi} />
                        ))}
                    </Picker>
                </View>
                <TouchableOpacity style={meusEstilos.botao} onPress={botaoVincular}>
                    <Text style={meusEstilos.textoBotao}> Vincular </Text>
                </TouchableOpacity>
            </View>
            <View style={meusEstilos.conteudoCorpo}>
                <Text style={{fontSize:18,fontWeight:'bold',color:corPrincipal}}>EPIS vinculados à este colaborador:</Text>
                <FlatList 
                    data={dadosEPIsVinculados}
                    renderItem={exibirItemLista}
                    keyExtractor={(item) => item.id_vinculacao.toString()}
                />
            </View>
        </View>
    )

}

export default ComprarProduto