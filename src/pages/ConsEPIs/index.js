
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { corBorda, corBranco, corPrincipal, meusEstilos } from '../../style/MeusEstilos';
import { endWS } from '../../Config';

const ConsEPIs = ({ navigation }) => {
    const [dadosLista, setDadosLista] = useState([]);
    const [txtPesquisa, setTxtPesquisa] = useState('');
    const [ordenacao, setOrdenacao] = useState('nome');
    const [nrItens, setNrItens] = useState(0)

    const isFocused = useIsFocused()

    const buscarDadosAPI = () => {
        if (txtPesquisa == '') {
            setDadosLista([])
            return
        }
        fetch(`${endWS}/epis/epis/${txtPesquisa}`)
            .then(response => {
                if (!response.ok) {
                    if (response.status == 404)
                        throw new Error(`404. API não encontrada (${response.url})`)
                    else if (response.status == 500)
                        throw new Error(`500. Erro interno na API (${response.url})`)
                }
                return response.json();
            })
            .then(dados => {
                if (ordenacao == 'nome') {
                    dados.sort((a, b) => a.nome_epi.localeCompare(b.nome_epi));
                } else if (ordenacao == 'validade') {
                    dados.sort((a, b) => a.validade - b.validade);
                }
                setDadosLista(dados);
                setNrItens(dados.length);
            })
            .catch(error => alert('Erro ao buscar dados: ' + error))
    };

    const exibirItemLista = ({ item }) => {
        return (
            <TouchableOpacity style={meusEstilos.itemLista}
                onPress={() => navigation.navigate('CadEPI', { Alterar: item })}
            >
                <Image source={{ uri: item.foto }} style={meusEstilos.imagemLista} />
                <View style={meusEstilos.textContainer}>
                    <Text style={meusEstilos.NomeLista}>{item.nome_epi}</Text>
                    <Text>Validade: {item.validade} dias</Text>
                    <Text>{item.categoria}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('CadEPI', { Alterar: item })}>
                    <MaterialIcons name="edit" size={24} color={corPrincipal} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => botaoExcluirProduto(item.id_epi)}>
                    <MaterialIcons name="delete" size={24} color={corPrincipal} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }

    const botaoExcluirProduto = async (id) => {
        try {
            const resposta = await fetch(`${endWS}/epis/epi/${id}`,
                { method: 'DELETE' })
            if (resposta.ok)
                buscarDadosAPI()
        } catch (error) {
            console.error('Erro ao excluir EPI:', error)
        }
    }

    useEffect(() => {
        if (isFocused)
            buscarDadosAPI()
    }, [isFocused]);

    return (
        <View style={meusEstilos.conteudoHeader}>
            <View style={meusEstilos.controles}>
                <View style={{ flex: 1 }}>
                    <Text style={meusEstilos.labelControle}> Pesquisar por: </Text>
                    <TextInput
                        style={meusEstilos.inputPesquisa}
                        placeholder="Pesquisar"
                        value={txtPesquisa}
                        onChangeText={setTxtPesquisa}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={meusEstilos.labelControle}> Ordenar por: </Text>
                    <View style={meusEstilos.picker}>
                        <Picker
                            selectedValue={ordenacao}
                            onValueChange={setOrdenacao}
                        >
                            <Picker.Item label="Nome" value="nome" />
                            <Picker.Item label="Validade" value="validade" />
                        </Picker>
                    </View>
                </View>


                <TouchableOpacity style={meusEstilos.botaoIcone2}
                    onPress={buscarDadosAPI}>
                    <MaterialIcons name="search" size={24} color={corBranco} />
                </TouchableOpacity>
            </View>

            <View style={[meusEstilos.conteudoCorpo, { paddingHorizontal: 0 }]}>
                <View style={meusEstilos.tituloLista}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: corPrincipal }}>
                        {nrItens} EPI's listados </Text>
                    <TouchableOpacity style={meusEstilos.botaoIcone}
                        onPress={() => navigation.navigate('CadEPI')}>
                        <MaterialIcons name="add" size={24} color={corPrincipal} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={dadosLista}
                    renderItem={exibirItemLista}
                    keyExtractor={(item) => item.id_epi.toString()}
                />
            </View>

        </View>
    );
};

export default ConsEPIs
