import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { corBorda, corBranco, corPrincipal, meusEstilos } from '../../style/MeusEstilos'
import * as Animar from 'react-native-animatable'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { endWS } from '../../Config';
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true, //exibir alerta na barra de notificacao
        shouldPlaySound:true, // emitir som da notificacao
        shouldSetBadge: true, //exibir o nº de natificacoes
    })
})

const Home = ({ navigation }) => {
    const [Usuario, setUsuario] = useState('')
    const [dadosEPIsVinculados, setDadosEPIsVinculados] = useState([])
    const [dadosNotificacoes, setDadosNotificacoes] = useState([])

    const carregarDados = async () => {
        try {
            //Obter o usuário logado do AsyncStorage
            let UsuarioLogado = await AsyncStorage.getItem('UsuLogado')
            UsuarioLogado = await JSON.parse(UsuarioLogado)
            setUsuario(UsuarioLogado)

            //Buscar epis vinculados da API
            resposta = await fetch(`${endWS}/epis/obterVinculados/${UsuarioLogado.id_usuario}`)
            dados = await resposta.json()
            setDadosEPIsVinculados(dados)

            //Buscar notificações
            resposta = await fetch(`${endWS}/epis/obterNotificacoes/${UsuarioLogado.id_usuario}`)
            dados = await resposta.json()
            setDadosNotificacoes(dados)
            if (dados.length > 0) 
                criarNotificacaoLocal()

            console.log(dados);
        } catch (error) {
            console.warn('Erro ao buscar dados', error)
        }
    }

    useEffect(() => {
        carregarDados()
    }, [])

    const exibirItemLista = ({ item }) => {
        return (
            <TouchableOpacity style={styles.itemEPI}>
                <Image source={{ uri: item.foto }} style={styles.imagemLista} />
                <View style={meusEstilos.textContainer}>
                    <Text style={{ color: corPrincipal }}>{item.nome_epi}</Text>
                    <Text >Validade: {item.data_vencimento} </Text>
                </View>
            </TouchableOpacity>
        )
    }

    const exibirItemNotificacao = ({ item }) => {
        return (
            <TouchableOpacity style={styles.itemEPI}>
                <Text >{item.descricao}</Text>
            </TouchableOpacity>
        )
    }

    const botaoLogout = async () => {
        await AsyncStorage.removeItem('UsuLogado')
        navigation.navigate('Login')
    }

    //Criando função para gerar uma notificação local
    const criarNotificacaoLocal = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'SafeGuardPro',
                body: 'Você tem EPIs que vencem em menos de 30 dias',
                data: {}
            },
            trigger: {
                seconds: 5
            }
        })
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <View>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Colaborador:</Text>
                        <Text style={[meusEstilos.NomeLista, { fontSize: 20 }]}>{Usuario.nome}</Text>
                    </View>
                    <MaterialIcons name='logout' size={25} onPress={botaoLogout} />
                </View>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>EPI's vinculadas à você:</Text>
                <View>
                    <FlatList
                        data={dadosEPIsVinculados}
                        renderItem={exibirItemLista}
                        keyExtractor={(item) => item.id_vinculacao.toString()}
                    />
                </View>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Notificações:</Text>
                {dadosNotificacoes.length > 0
                    ?
                    <FlatList
                        data={dadosNotificacoes}
                        renderItem={exibirItemNotificacao}
                        keyExtractor={(item) => item.id_notificacao.toString()}
                    />
                    :
                    <Text style={{ textAlign: 'center', marginTop: 50 }}> Nenhuma Notificação</Text>                    
                }

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
        flexDirection: 'row',
        marginVertical: 5,
        padding: 10,
        borderColor: corBorda,
        borderWidth: 1,
        backgroundColor: corBranco
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