import {TouchableOpacity, Text} from 'react-native';

const Button=({text, onPress})=>{
    return(
        <TouchableOpacity onPress={onPress} style={{backgroundColor:'#FF8C00', padding:10, borderRadius:8, height:60, margin:10, justifyContent:'center', alignItems:'center', marginTop:20}}>
            <Text style={{color:'#161622', fontSize:20, textAlign:'center', fontWeight:'bold'}}>
                {text}
            </Text>
        </TouchableOpacity>
    )
}
export default Button;