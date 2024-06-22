import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { corBranco, meusEstilos } from '../../style/MeusEstilos';
import {endWS} from '../../Config'

const CadEPI = ({ navigation, route }) => {
    const [inputNome, setInputNome] = useState('')
    const [inputValidade, setInputValidade] = useState('')
    const [inputFoto, setInputFoto] = useState('')
    const [inputDescricao, setInputDescricao] = useState('')
    const [inputCategoria, setInputCategoria] = useState('')

    useEffect(
        () => {
            if (route.params && route.params.Alterar) {
                setInputNome(route.params.Alterar.nome_epi)
                setInputValidade(route.params.Alterar.validade.toString())
                setInputFoto(route.params.Alterar.foto)
                setInputDescricao(route.params.Alterar.descricao)
                setInputCategoria(route.params.Alterar.categoria)
            } else {
                setInputNome('')
                setInputValidade('')
                setInputFoto('')
                setInputDescricao('')
                setInputCategoria('')
            }
        }, [route.params]
    )

    const botaoSalvar = async () => {
        try {
            //Criando variável para apontar qual endpoint deve ir
            let endpoint = `${endWS}/epis/epi`
            let metodo = 'POST'

            if (route.params && route.params.Alterar) {
                endpoint = `${endWS}/epis/epi/${route.params.Alterar.id_epi}`
                metodo = 'PUT'
            }
            //Endereço do endpoint do POST
            const resposta = await fetch(endpoint,
                {
                    method: metodo,  //Qual é o método do endpoint
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nome_epi: inputNome,
                        validade: parseInt(inputValidade),
                        foto: inputFoto,
                        descricao: inputDescricao,
                        categoria: inputCategoria
                    })
                }
            )
            if (resposta.ok) {
                alert('EPI salvo com sucesso')
                //Redirecionando para a tela com todos os produtos
                navigation.goBack()
            }

        } catch (error) {
            console.warn('Erro ao salvar EPI:', error)
        }
    }

    return (
        <View style={{ padding: 20 }}>

            <Text style={styles.label}> Nome do EPI:</Text>
            <TextInput placeholder='Nome do EPI' value={inputNome}
                onChangeText={setInputNome} style={meusEstilos.inputCad} />
            <Text style={styles.label}> Validade (dias):</Text>
            <TextInput placeholder='Validade do EPI em dias' value={inputValidade}
                onChangeText={setInputValidade} style={meusEstilos.inputCad} keyboardType='numeric' />
            <Text style={styles.label}> Descrição do EPI:</Text>
            <TextInput placeholder='Descrição do EPI' value={inputDescricao}
                onChangeText={setInputDescricao} style={meusEstilos.inputCad} />
            <Text style={styles.label}> Categoria:</Text>
            <TextInput placeholder='Categoria do EPI' value={inputCategoria}
                onChangeText={setInputCategoria} style={meusEstilos.inputCad} />
            <Text style={styles.label}> Link da foto:</Text>
            <TextInput placeholder='Link da Foto do EPI' value={inputFoto}
                onChangeText={setInputFoto} style={meusEstilos.inputCad} />
            <View style={{alignItems:'center', paddingBottom:20}}>
                {inputFoto && <Image source={{ uri: inputFoto }} style={styles.imagem} />}
            </View>
            
            <TouchableOpacity style={meusEstilos.botao}
                    onPress={botaoSalvar}>
                    <Text style={meusEstilos.textoBotao}> Salvar </Text>
                </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    imagem: {
        width: 200,
        height: 200,
    },
})

export default CadEPI
