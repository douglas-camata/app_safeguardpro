import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StatusBar } from 'react-native'
import { corPrincipal } from '../../style/MeusEstilos'
import { MaterialIcons, FontAwesome6 } from '@expo/vector-icons';

//Importando telas para o Menu Bottom Tabs
import HomeSup from '../HomeSup'
import HomeColab from '../HomeColab'
import ConsColaboradores from '../ConsColaboradores'
import ConsEPIs from '../ConsEPIs'

const Tab = createBottomTabNavigator()

const MenuNavegacao = ({ route }) => {
    return (
        <>
            <StatusBar backgroundColor={corPrincipal} />
            <Tab.Navigator>
                {route.params.tipo_usuario == 'supervisor' ?
                    <Tab.Screen name="HomeSup" component={HomeSup}
                        options={{
                            headerShown: false,
                            tabBarLabelStyle: { fontSize: 14 },
                            
                            tabBarLabel: 'Home',
                            tabBarIcon: ({ color }) => (<MaterialIcons name="home" color={color} size={24} />)
                        }} /> :
                    <Tab.Screen name="HomeColab" component={HomeColab}
                        options={{
                            headerShown: false,
                            tabBarLabelStyle: { fontSize: 14 },
                            tabBarLabel: 'Home',
                            tabBarIcon: ({ color }) => (<MaterialIcons name="home" color={color} size={24} />)
                        }} />
                }
                {route.params.tipo_usuario == 'supervisor' ?
                    <Tab.Screen name="EPIs" component={ConsEPIs}
                        options={{
                            headerShown: false,
                            tabBarLabelStyle: { fontSize: 14 },
                            tabBarLabel: 'EPIs',
                            tabBarIcon: ({ color }) => (<FontAwesome6 name="helmet-safety" color={color} size={24} />)
                        }} /> :
                    null
                }
                {route.params.tipo_usuario == 'supervisor' ?
                    <Tab.Screen name="Colaborador" component={ConsColaboradores}
                        options={{
                            headerShown: false,
                            tabBarLabelStyle: { fontSize: 14 },
                            tabBarLabel: 'Colaboradores',
                            tabBarIcon: ({ color }) => (<FontAwesome6 name="id-card" color={color} size={24} />)
                        }} /> :
                    null
                }

            </Tab.Navigator>
        </>
    )
}

export default MenuNavegacao