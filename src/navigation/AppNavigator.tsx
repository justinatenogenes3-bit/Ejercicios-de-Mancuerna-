import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useApp, C } from '../context/AppContext';

import SplashScreen      from '../screens/SplashScreen';
import LoginScreen       from '../screens/auth/LoginScreen';
import RegisterScreen    from '../screens/auth/RegisterScreen';
import HomeScreen        from '../screens/main/HomeScreen';
import ExploreScreen     from '../screens/main/ExploreScreen';
import RoutinesScreen    from '../screens/main/RoutinesScreen';
import ProgressScreen    from '../screens/main/ProgressScreen';
import ExerciseDetailScreen from '../screens/shared/ExerciseDetailScreen';
import TechniqueScreen   from '../screens/shared/TechniqueScreen';
import RoutineDetailScreen from '../screens/shared/RoutineDetailScreen';
import TimerScreen       from '../screens/shared/TimerScreen';
import CompletedScreen   from '../screens/shared/CompletedScreen';
import ProfileScreen     from '../screens/shared/ProfileScreen';

export type RootStackParamList = {
  Splash:          undefined;
  Login:           undefined;
  Register:        undefined;
  MainTabs:        undefined;
  ExerciseDetail:  { exerciseId: string };
  Technique:       { exerciseId: string };
  RoutineDetail:   { routineId: string };
  Timer:           { routineId: string; exerciseIndex: number };
  Completed:       { routineId: string; durationMin: number };
  Profile:         undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator();

const TAB_ICONS: Record<string, [string, string]> = {
  Home:     ['home',         'home-outline'         ],
  Explore:  ['search',       'search-outline'       ],
  Routines: ['calendar',     'calendar-outline'     ],
  Progress: ['bar-chart',    'bar-chart-outline'    ],
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor:   C.acc,
      tabBarInactiveTintColor: C.muted,
      tabBarStyle: {
        backgroundColor: 'rgba(19,19,24,0.97)',
        borderTopColor: C.border,
        paddingTop: 4,
        height: 68,
      },
      tabBarLabelStyle: { fontSize: 10, fontWeight: '600', paddingBottom: 4 },
      tabBarIcon: ({ focused, color }) => {
        const [a, b] = TAB_ICONS[route.name] ?? ['apps', 'apps-outline'];
        return <Ionicons name={(focused ? a : b) as any} size={22} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home"     component={HomeScreen}     options={{ title: 'Inicio'   }} />
    <Tab.Screen name="Explore"  component={ExploreScreen}  options={{ title: 'Explorar' }} />
    <Tab.Screen name="Routines" component={RoutinesScreen} options={{ title: 'Rutinas'  }} />
    <Tab.Screen name="Progress" component={ProgressScreen} options={{ title: 'Progreso' }} />
  </Tab.Navigator>
);

export default function AppNavigator() {
  const { currentUser } = useApp();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          <>
            <Stack.Screen name="Splash"   component={SplashScreen}   />
            <Stack.Screen name="Login"    component={LoginScreen}    />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="ExerciseDetail"
              component={ExerciseDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Technique"
              component={TechniqueScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RoutineDetail"
              component={RoutineDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Timer"
              component={TimerScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Completed"
              component={CompletedScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
