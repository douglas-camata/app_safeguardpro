import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { corBranco, meusEstilos } from '../../style/MeusEstilos';
import { Picker } from '@react-native-picker/picker';
import {endWS} from '../../Config'

const CadColaborador = ({ navigation, route }) => {
    const [inputNome, setInputNome] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [inputSenha, setInputSenha] = useState('')
    const [inputCargo, setInputCargo] = useState('colaborador')
    const [inputCPF, setInputCPF] = useState('')
    const [inputCEP, setInputCEP] = useState('')
    const [inputEndereco, setInputEndereco] = useState('')
    const [inputNr, setInputNr] = useState('')
    const [inputBairro, setInputBairro] = useState('')
    const [inputCidade, setInputCidade] = useState('')
    const [inputEstado, setInputEstado] = useState('')
    const [inputSetor, setInputSetor] = useState('')

    useEffect(
        () => {
            if (route.params && route.params.Alterar) {
                setInputNome(route.params.Alterar.nome)
                setInputEmail(route.params.Alterar.email)
                setInputSenha(route.params.Alterar.senha)
                setInputCargo(route.params.Alterar.cargo)
                setInputCPF(route.params.Alterar.cpf)
                setInputCEP(route.params.Alterar.cep)
                setInputEndereco(route.params.Alterar.endereco)
                setInputNr(route.params.Alterar.nr)
                setInputBairro(route.params.Alterar.bairro)
                setInputCidade(route.params.Alterar.cidade)
                setInputEstado(route.params.Alterar.estado)
                setInputSetor(route.params.Alterar.setor)
            } else {
                setInputNome('')
                setInputEmail('')
                setInputSenha('')
                setInputCargo('')
                setInputCPF('')
                setInputCEP('')
                setInputEndereco('')
                setInputNr('')
                setInputBairro('')
                setInputCidade('')
                setInputEstado('')
                setInputSetor('')
            }
        }, [route.params]
    )

    const botaoSalvarProduto = async () => {
        try {
            //Criando variável para apontar qual endpoint deve ir
            let endpoint = `${endWS}/colaboradores/colaborador`
            let metodo = 'POST'

            if (route.params && route.params.Alterar) {
                endpoint = `${endWS}/colaboradores/colaborador/${route.params.Alterar.id_colaborador}`
                metodo = 'PUT'
            }

            //Endereço do endpoint do POST
            const resposta = await fetch(endpoint,
                {
                    method: metodo,  //Qual é o método do endpoint
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nome: inputNome,
                        email: inputEmail,
                        senha: inputSenha,
                        cargo: inputCargo,
                        setor: inputSetor,
                        cpf: inputCPF,
                        cep: inputCEP,
                        nr: inputNr,
                        bairro: inputBairro,
                        cidade: inputCidade,
                        estado: inputEstado
                    })
                }
            )
            if (resposta.ok) {
                alert('Colaborador salvo com sucesso')
                //Redirecionando para a tela com todos os produtos
                navigation.goBack()
            }

        } catch (error) {
            console.error('Erro ao salvar colaborador:', error)
        }
    }

    return (
        <View style={{ padding: 20 }}>

            <ScrollView>

                <Text style={styles.label}> Nome:</Text>
                <TextInput placeholder='Nome do colaborador' value={inputNome}
                    onChangeText={setInputNome} style={meusEstilos.inputCad} />
                <Text style={styles.label}> Email:</Text>
                <TextInput placeholder='Email' value={inputEmail}
                    onChangeText={setInputEmail} style={meusEstilos.inputCad} />
                <Text style={styles.label}> Senha:</Text>
                <TextInput placeholder='Senha' value={inputSenha}
                    onChangeText={setInputSenha} style={meusEstilos.inputCad} secureTextEntry={true} />
                <Text style={styles.label}> Tipo acesso:</Text>
                <View style={styles.picker}>
                    <Picker
                        selectedValue={inputCargo}
                        onValueChange={setInputCargo}
                    >
                        <Picker.Item label="Supervisor" value="supervisor" />
                        <Picker.Item label="Colaborador" value="colaborador" />
                    </Picker>
                </View>
                <Text style={styles.label}> CEP:</Text>
                <TextInput placeholder='CEP' value={inputCEP}
                    onChangeText={setInputCEP} style={meusEstilos.inputCad} />
                <Text style={styles.label}> Endereço:</Text>
                <TextInput placeholder='Endereco' value={inputEndereco}
                    onChangeText={setInputEndereco} style={meusEstilos.inputCad} />
                <Text style={styles.label}> Nr:</Text>
                <TextInput placeholder='Nr' value={inputNr}
                    onChangeText={setInputNr} style={meusEstilos.inputCad} />
                <Text style={styles.label}> Bairro:</Text>
                <TextInput placeholder='Bairro' value={inputBairro}
                    onChangeText={setInputBairro} style={meusEstilos.inputCad} />
                <Text style={styles.label}> Cidade:</Text>
                <TextInput placeholder='Cidade' value={inputCidade}
                    onChangeText={setInputCidade} style={meusEstilos.inputCad} />
                <Text style={styles.label}> Estado:</Text>
                <TextInput placeholder='Estado' value={inputEstado}
                    onChangeText={setInputEstado} style={meusEstilos.inputCad} />
                <Text style={styles.label}> Setor:</Text>
                <TextInput placeholder='Setor' value={inputSetor}
                    onChangeText={setInputSetor} style={meusEstilos.inputCad} />

                <TouchableOpacity style={meusEstilos.botao}
                    onPress={botaoSalvarProduto}>
                    <Text style={meusEstilos.textoBotao}> Salvar </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    imagem: {
        width: 200,
        height: 200,
    },
    picker: {
        backgroundColor: corBranco,
        height: 40,
        justifyContent: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
})

export default CadColaborador
