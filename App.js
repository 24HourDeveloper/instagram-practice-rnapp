import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator
} from "react-navigation";
import FeedScreen from "./components/Feed";
import ProfileScreen from "./components/Profile";
import UploadScreen from "./components/Upload";
import LogInForm from "./components/LogInForm";
import userProfile from "./components/UserProfile";
import comments from "./components/Comments";

const TabStack = createBottomTabNavigator({
  Feed: { screen: FeedScreen },
  Profile: { screen: ProfileScreen },
  Upload: { screen: UploadScreen },
  LogIn: { screen: LogInForm }
});

const MainStack = createStackNavigator(
  {
    Home: { screen: TabStack },
    User: { screen: userProfile },
    Comments: { screen: comments }
  },
  {
    initialRouteName: "Home",
    mode: "modal",
    headerMode: "none"
  }
);

export default createAppContainer(MainStack);
