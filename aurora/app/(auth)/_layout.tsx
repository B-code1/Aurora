import { Stack } from "expo-router"



const AuthScreenLayout=()=>{
    return (
        <Stack>
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
           
        </Stack>

    )
    
    }
export default AuthScreenLayout