import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import { corBorda, corBranco, corPrincipal, meusEstilos } from '../../style/MeusEstilos'
import * as Animar from 'react-native-animatable'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { endWS } from '../../Config';

const Home = ({ navigation }) => {
    const [nomeUsuario, setNomeUsuario] = useState('')
    const [dadosEPIsVencendo, setDadosEPIsVencendo] = useState([])

    const carregarDados = async () => {
        try {
            //Buscar epis Vencendo da API
            resposta = await fetch(`${endWS}/epis/episVencendo`)
            dados = await resposta.json()
            setDadosEPIsVencendo(dados)
        } catch (error) {
            console.warn('Erro ao buscar dados', error)
        }
    }

    const exibirItemLista = ({ item }) => {
        return (
            <TouchableOpacity style={styles.itemEPI}>
                <Image source={{ uri: item.foto }} style={styles.imagemLista} />
                <View style={meusEstilos.textContainer}>
                    <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{ color: corPrincipal }}>EPI: {item.nome_epi}</Text>
                        <Text style={{fontWeight:'bold'}}>Validade: {item.data_vencimento} </Text>
                    </View>                    
                    <Text >Colaborador: {item.nome} </Text>
                </View>
            </TouchableOpacity>
        )
    }

    const verificarLoginRealizado = async () => {
        let dadosLogado = await AsyncStorage.getItem('UsuLogado');
        if (dadosLogado) {
            dadosLogado = JSON.parse(dadosLogado);
            setNomeUsuario(dadosLogado.nome)
        }
    }

    useEffect(() => {
        verificarLoginRealizado()
        carregarDados()
    }, []);

    const botaoLogout = async () => {
        await AsyncStorage.removeItem('UsuLogado')
        navigation.navigate('Login')
    }


    return (
        <View>
            <Animar.View animation='fadeInDown' style={styles.logo}>
                <Image source={require('../../assets/logo.png')}
                    animation='flipInY'
                    style={{ height: 80 }}
                    resizeMode="contain" />
            </Animar.View>
            <Animar.View animation='fadeInLeft' delay={500} style={styles.conteudo}>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Supervisor:</Text>
                            <Text style={[meusEstilos.NomeLista, { fontSize: 20 }]}>{nomeUsuario}</Text>
                        </View>
                        <MaterialIcons name='logout' size={25} onPress={botaoLogout} />
                    </View>

                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>EPI's próximas ao vencimento:</Text>
                    <View>
                        <FlatList
                            data={dadosEPIsVencendo}
                            renderItem={exibirItemLista}
                            keyExtractor={(item) => item.id_vinculacao.toString()}
                        />
                    </View>
                    
                </View>

            </Animar.View>
        </View>
    )
}
const styles = StyleSheet.create({
    logo: {
        backgroundColor: corPrincipal,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomStartRadius: 25,
        borderBottomEndRadius: 25,
    },
    conteudo: {
        padding: 10,
    },
    itemEPI: {
        flexDirection:'row',
        marginVertical: 5,
        padding: 10,
        borderColor: corBorda,
        borderWidth: 1,
        backgroundColor: corBranco,
        alignItems: 'center'
    },
    validade: {
        fontWeight: 'bold'
    },
    imagemLista: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
})

export default Home