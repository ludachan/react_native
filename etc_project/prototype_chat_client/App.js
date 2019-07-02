import { createAppContainer, createStackNavigator } from 'react-navigation';
import chatRoomListScreen from './components/chatRoomList';
import chatTestScreen from './components/chatTest';

const AppNavigator = createStackNavigator({
    chatRoomList: {
    screen: chatRoomListScreen,
    },
    chatTest: {
    screen: chatTestScreen,
    },
});

export default createAppContainer(AppNavigator);