
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { corBorda, corBranco, corPrincipal, meusEstilos } from '../../style/MeusEstilos';
import { endWS } from '../../Config';

const ConsColaboradores = ({ navigation }) => {
    const [dadosLista, setDadosLista] = useState([]);
    const [txtPesquisa, setTxtPesquisa] = useState('');
    const [ordenacao, setOrdenacao] = useState('nome');
    const [nrColaboradores, setNrColaboradores] = useState(0)

    const isFocused = useIsFocused()

    const buscarDadosAPI = async () => {
        if (txtPesquisa == '') {
            setDadosLista([])
            return
        }
        try {
            const response = await fetch(`${endWS}/colaboradores/colaborador/${txtPesquisa}`);
            const dados = await response.json();

            if (ordenacao === 'nome') {
                dados.sort((a, b) => a.nome.localeCompare(b.nome));
            }
            //console.log(dados)
            setDadosLista(dados);
            setNrColaboradores(dados.length);

        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    };

    const vincularEPI = async (item) => {
        await AsyncStorage.setItem('ColaboradorSelecionado',
            JSON.stringify({
                id_colaborador: item.id_colaborador,
                nome: item.nome
            })
        )
        navigation.navigate("VincularEPI")
    }

    const exibirItemLista = ({ item }) => {
        return (
            <TouchableOpacity style={meusEstilos.itemLista}
                onPress={() => vincularEPI(item)}
            >
                <View style={meusEstilos.textContainer}>
                    <Text style={meusEstilos.NomeLista}>{item.nome}</Text>
                    <Text>{item.cargo}</Text>
                    <Text>{item.setor}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => vincularEPI(item)}>
                    <MaterialIcons name="link" size={24} color={corPrincipal} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('CadColaborador', { Alterar: item })}>
                    <MaterialIcons name="edit" size={24} color={corPrincipal} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => botaoExcluirProduto(item.id_colaborador)}>
                    <MaterialIcons name="delete" size={24} color={corPrincipal} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }

    const botaoExcluirProduto = async (id) => {
        try {
            const resposta = await fetch(`${endWS}/colaboradores/colaborador/${id}`,
                { method: 'DELETE' })
            if (resposta.ok)
                buscarDadosAPI()
        } catch (error) {
            console.error('Erro ao excluir Produto:', error)
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
                        {nrColaboradores} Colaboradores listados </Text>
                    <TouchableOpacity style={meusEstilos.botaoIcone}
                        onPress={() => navigation.navigate('CadColaborador')}>
                        <MaterialIcons name="add" size={24} color={corPrincipal} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={dadosLista}
                    renderItem={exibirItemLista}
                    keyExtractor={(item) => item.id_colaborador.toString()}
                />
            </View>

        </View>
    );
};

export default ConsColaboradores
