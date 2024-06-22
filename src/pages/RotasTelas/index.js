import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'react-native'

import { corBranco, corPrincipal } from '../../style/MeusEstilos'

//Importar aqui todas as telas de navegação Stack
import BemVindo from '../BemVindo'
import Login from '../Login'
import MenuNavegacao from '../MenuNavegacao'
import CadEPI from '../CadEPI'
import CadColaborador from '../CadColaborador'
import VincularEPI from '../VincularEPI'

const Stack = createNativeStackNavigator()

const RotasTelas = () => {
    return (
        <NavigationContainer>
            <StatusBar backgroundColor={corPrincipal} />
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: corPrincipal
                    },
                    headerTintColor: corBranco
                }}
                >
                <Stack.Screen name="BemVindo" component={BemVindo} options={{ headerShown:false }}/>
                <Stack.Screen name="Login" component={Login} options={{ headerShown:false }}/>
                <Stack.Screen name="MenuNavegacao" component={MenuNavegacao} options={{ headerShown: false }} />
                <Stack.Screen name="CadColaborador" component={CadColaborador} options={{title: 'Cadastro de Colaboradores'}} />
                <Stack.Screen name="CadEPI" component={CadEPI} options={{title: 'Cadastro de EPIs'}} />
                <Stack.Screen name="VincularEPI" component={VincularEPI} options={{title: 'Vincular EPI'}} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RotasTelas
