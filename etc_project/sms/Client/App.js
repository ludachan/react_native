import {createStackNavigator, createAppContainer} from 'react-navigation';
import CreateAcount from './src/screen/CreateAcount'
import AuthScreen from './src/screen/AuthScreen';
import NationCode from './src/screen/NationCodeScreen';
import PhoneAuth from './src/screen/PhoneAuthScreen';


const MainNavigator = createStackNavigator({
  Auth: {screen: AuthScreen},
  Acount: {screen: CreateAcount},
  NationCode:{screen:NationCode},
  PhoneAuth : {screen:PhoneAuth}
},{
  initialRouteName: "Auth"
}
);




const App = createAppContainer(MainNavigator);



export default App;




