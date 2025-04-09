import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native'
import * as Animar from 'react-native-animatable'
import { Picker } from '@react-native-picker/picker';
import { Checkbox } from 'expo-checkbox'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { corBranco, meusEstilos } from "../../style/MeusEstilos"
import { endWS } from "../../Config";

const Login = ({ navigation }) => {
    const [tipoAcesso, setTipoAcesso] = useState('supervisor')
    const [usuario, setUsuario] = useState('supervisor')
    const [senha, setSenha] = useState('1')
    const [mensagemLogin, setMensagemLogin] = useState('')
    const [permanecerConectado, setPermanecerConectado] = useState(false);

    const verificarLoginRealizado = async () => {
        let dadosLogado = await AsyncStorage.getItem('UsuLogado');
        if (dadosLogado) {
            dadosLogado = JSON.parse(dadosLogado);
            if (dadosLogado.permanecerConectado) 
                navigation.navigate('MenuNavegacao', { tipo_usuario: dadosLogado.tipoAcesso })
        }
    }

    useEffect(() => {
        verificarLoginRealizado();
    }, []);

    const botaoEntrar = () => {
        fetch(`${endWS}/colaboradores/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: usuario,
                senha: senha,
                cargo: tipoAcesso
            })
        })
        .then(resposta => {
            if (!resposta.ok) {
                if (resposta.status == 404)
                    throw new Error(`404. API não encontrada (${resposta.url})`)
                else if (resposta.status == 500)
                    throw new Error(`500. Erro interno na API (${resposta.url})`)
            }
            return resposta.json();
        })
        .then(json => {
            if (json.length === 0) {
                setMensagemLogin('Usuário e/ou senha não encontrado');
            } else {
                AsyncStorage.setItem('UsuLogado', JSON.stringify({
                    usuario: usuario,
                    nome: json[0].nome,
                    tipoAcesso: tipoAcesso,
                    permanecerConectado: permanecerConectado,
                    id_usuario: json[0].id_colaborador,
                })).then(() => {
                    navigation.navigate('MenuNavegacao', { tipo_usuario: tipoAcesso, nome: json.nome });
                }).catch(error => {
                    console.error('Erro ao salvar no AsyncStorage:', error);
                    setMensagemLogin('Erro ao realizar o login: ' + error);
                });
            }
        })
        .catch(error => {
            console.error('Erro ao realizar o login:', error);
            setMensagemLogin('Erro ao realizar o login: ' + error);
        });
    };
    

    return (
        <View style={meusEstilos.conteudoHeader}>
            <Animar.View animation='fadeInLeft' delay={500} style={styles.header} >
                <Image source={require('../../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain" />
                <Text style={styles.headerText}>Bem-vindo(a) </Text>
            </Animar.View>
            <Animar.View animation={'fadeInUp'} style={meusEstilos.conteudoCorpo}>

                <Text style={styles.label}> Tipo acesso:</Text>
                <View style={styles.picker}>
                    <Picker
                        selectedValue={tipoAcesso}
                        onValueChange={setTipoAcesso}
                    >
                        <Picker.Item label="Supervisor" value="supervisor" />
                        <Picker.Item label="Colaborador" value="colaborador" />
                    </Picker>
                </View>
                <Text style={styles.label}> Email:</Text>
                <TextInput 
                    placeholder="Digite um email..." 
                    style={styles.inputLogin} 
                    value={usuario}
                    onChangeText={setUsuario}/>
                <Text style={styles.label}> Senha:</Text>
                <TextInput 
                    placeholder="Digite sua senha" 
                    style={styles.inputLogin} 
                    secureTextEntry={true} 
                    value={senha}
                    onChangeText={setSenha}/>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                    <Checkbox value={permanecerConectado} onValueChange={setPermanecerConectado} />
                    <Text> Permanecer conectado</Text>
                </View>
                <TouchableOpacity style={meusEstilos.botao}
                    onPress={botaoEntrar}>
                    <Text style={meusEstilos.textoBotao}> Acessar </Text>
                </TouchableOpacity>
                <Text>{mensagemLogin}</Text>
            </Animar.View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%',
        flexDirection: 'row'
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: corBranco
    },
    logo : {
        width: 30, 
        height: 30, 
        marginRight: 20
    },
    picker: {
        backgroundColor: corBranco,
        height: 40,
        justifyContent: 'center',
        borderBottomWidth: 1,
    },
    label: {
        fontSize: 20,
        marginTop: 28
    },
    inputLogin: {
        borderBottomWidth: 1,
        height: 40,
        fontSize: 16
    },
})

export default Login
