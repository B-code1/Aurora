import { SafeAreaView } from "react-native-safe-area-context"
import { Image, Text, View, TextInput,TouchableOpacity,ScrollView} from "react-native"
import React from "react"
import {router} from "expo-router";

const Signup = () => {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#161622", marginTop: 30, marginHorizontal:1 }}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                  <Image resizeMode="contain"  source={require('../../assets/images/aura.png')} style={{width:100,height:30,marginTop:60, marginLeft:20}}/>
                  <Text style={{color:'white',fontSize:25,marginTop:20,fontFamily:'Poppins-Medium', marginLeft: 20,fontWeight:'600'}}>
                     Sign Up
                  </Text>
                  <View >
                      <Text style={{color:'#CDCDE0',fontSize:20,fontWeight:'500',marginLeft:20,marginTop:20}}>Username</Text>
                  <TextInput style={styles.input} placeholderTextColor={'#7B7B8B'} placeholder="Your Unique username"></TextInput>
      
                  </View>
                 < View >
                      <Text style={{color:'#CDCDE0',fontSize:20,fontWeight:'500',marginLeft:20,}}>Email</Text>
                  <TextInput style={styles.input} placeholderTextColor={'white'} placeholder="andrian@jdmastery.pro"></TextInput>
      
                  </View>
                  <View >
                      <Text style={{color:'#CDCDE0',fontSize:20,fontWeight:'500',marginLeft:20}}>Password</Text>
                  <TextInput style={styles.input2} placeholderTextColor={'#7B7B8B'} placeholder="JSM@stery134X|" ></TextInput>
      
                  </View>
                  <TouchableOpacity style={{backgroundColor:'#FF8C00',width:327,height:58,alignSelf:'center',borderRadius:8,marginTop:30,justifyContent:'center', padding: 10}}>
                      <Text style={{color:'#161622',fontSize:20,alignSelf:'center',fontFamily:'Poppins-Medium'}}>
                      Sign up
                      </Text>
                  </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>{
                      router.navigate('/login')}}>

                    <Text style={{color:'#CDCDE0',fontSize:17,alignSelf:'center',fontFamily:'Poppins-Medium', marginLeft: 20,marginTop:20}}>
                      Already have an account? <Text style={{color:'#FF8C00'}}>Login</Text>
                  </Text>

                  </TouchableOpacity>
                  
                  </ScrollView>
      
      
      
              </SafeAreaView>
    )
}
export default Signup;
const styles = {
    input: {
    height: 58,
    borderColor: '#1E1E2D',
    borderWidth: 1,
    backgroundColor: '#232533',
    marginBottom: 9,
    paddingLeft: 16,
    borderRadius: 8,
    color: 'white',
    marginLeft: 20,
  },
  texts: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#CDCDE0',

  },
  input2: {
    height: 58,
    borderColor: '#FF9C01',
    borderWidth: 2,
    backgroundColor: '#1E1E2D',
    marginBottom: 9,
    paddingLeft: 16,
    borderRadius: 8,
    marginLeft: 20,
    color: 'white',
  },
}