# 🏋️ RepForce Dumbbell — Expo Go

App de entrenamiento con mancuernas para React Native + Expo Go.

## Estructura (basada en AutolavadoPro)

```
RepForceDumbbell/
├── App.tsx                          # Entry point
├── app.json
├── package.json
├── babel.config.js
├── tsconfig.json
└── src/
    ├── context/
    │   └── AppContext.tsx            # Estado global, tipos, datos iniciales
    ├── navigation/
    │   └── AppNavigator.tsx          # Stack + Bottom Tabs
    ├── components/
    │   └── UI.tsx                    # Átomos: Badge, Card, PrimaryButton, etc.
    └── screens/
        ├── SplashScreen.tsx          # Pantalla inicial
        ├── auth/
        │   ├── LoginScreen.tsx       # UC-06 Login
        │   └── RegisterScreen.tsx    # UC-05 Registro
        ├── main/                     # Bottom tabs
        │   ├── HomeScreen.tsx        # Inicio
        │   ├── ExploreScreen.tsx     # UC-01/02 Buscar ejercicios
        │   ├── RoutinesScreen.tsx    # UC-10 Rutinas
        │   └── ProgressScreen.tsx   # UC-14/15/16/17 Progreso
        └── shared/                  # Pantallas de stack
            ├── ExerciseDetailScreen.tsx  # UC-03 Detalle ejercicio
            ├── TechniqueScreen.tsx       # UC-04 Técnica correcta
            ├── RoutineDetailScreen.tsx   # UC-11 Detalle rutina
            ├── TimerScreen.tsx           # UC-12 Temporizador
            ├── CompletedScreen.tsx       # UC-11 Completada
            └── ProfileScreen.tsx         # Perfil usuario
```

## Instalación y uso

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar con Expo Go
npx expo start

# 3. Escanear QR con la app Expo Go en tu celular
```

## Dependencias principales

| Paquete | Uso |
|---|---|
| `expo ~51` | Runtime |
| `@react-navigation/native` | Navegación |
| `@react-navigation/bottom-tabs` | Bottom nav |
| `@react-navigation/native-stack` | Stack navigator |
| `@expo/vector-icons` | Iconos Ionicons |
| `react-native-svg` | Timer circular |
| `react-native-safe-area-context` | SafeArea |

## Pantallas y flujo

```
Splash → Register / Login
           ↓
         Home (tab) ────→ RoutineDetail → Timer → Completed
         Explore (tab) ──→ ExerciseDetail → Technique
         Routines (tab) ─→ RoutineDetail
         Progress (tab)
                          ↕
                        Profile
```

## Colores (design tokens)

```ts
bg:     '#0c0c0f'   // Fondo oscuro
acc:    '#e8ff47'   // Amarillo lima (primario)
acc2:   '#ff4d6d'   // Coral (peligro/alerta)
acc3:   '#7c6aff'   // Violeta (secundario)
text:   '#f0f0f8'   // Texto principal
muted:  '#6b6b80'   // Texto secundario
card:   '#18181f'   // Fondo tarjeta
```

## Usuarios de prueba

La app acepta cualquier usuario/contraseña no vacíos (demo mode).
Para producción, conectar con backend real en `AppContext.tsx → login()`.
