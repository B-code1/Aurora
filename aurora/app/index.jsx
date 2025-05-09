
import { SafeAreaView } from "react-native-safe-area-context";
import { Image,Text , TouchableOpacity} from "react-native";
import Button from "../components/button";
import {router} from "expo-router";




const index = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#161622", marginTop: 30, marginHorizontal:1 }}>
      <Image resizeMode="contain"  source={require('../assets/images/aura.png')} style={{width:100,height:30,alignSelf:'center',marginTop:40}}/>
      <Image resizeMode="contain"  source={require('../assets/images/img.png')} style={{width:370,height:300,alignSelf:'center'}}/>
      <Text style={{color:'white',fontSize:34,textAlign:'center',marginTop:20,fontFamily:'Poppins-Medium', marginLeft: 20}}>
        Discover Endless Possibilities with <Text style={{color:'#FF8E01',fontStyle:'italic'}}>Aora</Text>
      </Text>
      <Text style={{color:'#CDCDE0',fontSize:17,textAlign:'center',fontFamily:'Poppins-Medium', marginLeft: 20}}>
        Where Creativity Meets Innovation: Embark on a Journey of Limitless Exploration with Aora
        </Text>

        <Button onPress={()=>{
    router.navigate('/(auth)/signup')

            
        
        }} text={'Continue With Email'}/>
        
   

    </SafeAreaView>
    
  )
}
const styles = {
  button: {
    backgroundColor: '#FF8C00',
    width: 327,
    height: 58,
    alignSelf: 'center',
    borderRadius: 8,
    marginTop: 30,
    justifyContent: 'center',
    padding: 10,
  },
  buttonText: {
    color: '#161622',
    fontSize: 20,
    alignSelf: 'center',
    fontFamily: 'Poppins-Medium',
  },
   input: {
    height: 40,
    borderColor: '#D9D9D9',
    borderWidth: 1,
    backgroundColor: '#E8DEFE',
    marginBottom: 9,
    paddingLeft: 10,
    borderRadius: 8,
    textcolor: 'white',
  },
  texts: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#CDCDE0',

  },
}
 

        
   
export default index;
