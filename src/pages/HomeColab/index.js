import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { corBorda, corBranco, corPrincipal, meusEstilos } from '../../style/MeusEstilos'
import * as Animar from 'react-native-animatable'

const Home = ({ navigation }) => {
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
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Colaborador:</Text>
                    <Text style={[meusEstilos.NomeLista, { fontSize: 20 }]}>Nome do colaborador</Text>
                    <Text></Text>
                    <Text>EPI's vinculadas à você:</Text>
                    <View style={styles.itemEPI}>
                        <Text >EPI: Nome EPI </Text>
                        <Text>Validade 31/12/2024</Text>
                    </View>
                    <View style={styles.itemEPI}>
                        <Text >EPI: Nome EPI </Text>
                        <Text>Validade 31/12/2024</Text>
                    </View>
                    <View style={styles.itemEPI}>
                        <Text >EPI: Nome EPI </Text>
                        <Text>Validade 31/12/2024</Text>
                    </View>
                    <View style={styles.itemEPI}>
                        <Text >EPI: Nome EPI </Text>
                        <Text>Validade 31/12/2024</Text>
                    </View>
                    
                    <Text>Notificações:</Text>
                    <View style={{backgroundColor:corBranco, height:'100%'}} >
                        <Text style={{textAlign:'center', marginTop: 50}}> Nenhuma Notificação</Text>
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
        marginVertical: 5,
        padding: 10,
        borderColor: corBorda,
        borderWidth: 1,
        backgroundColor: corBranco
    },
    validade: {
        fontWeight: 'bold'
    }
})

export default Home