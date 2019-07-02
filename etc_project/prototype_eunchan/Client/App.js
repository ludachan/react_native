import {createStackNavigator, createAppContainer} from 'react-navigation';

import NationCode from './src/screen/NationCodeScreen';
import PhoneAuth from './src/screen/PhoneAuthScreen';


const MainNavigator = createStackNavigator({
  
  NationCode:{screen:NationCode},
  PhoneAuth : {screen:PhoneAuth}
},{
  initialRouteName: "NationCode"
}
);




const App = createAppContainer(MainNavigator);



export default App;




