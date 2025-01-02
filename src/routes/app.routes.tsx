import { createNativeStackNavigator } from "@react-navigation/native-stack"; //npm i @react-navigation/native-stack@6.8.0 @react-navigation/native@6.0.12
import { Groups } from "@/screens/Groups";
import { Players } from "@/screens/Players";
import { NewGroup } from "@/screens/NewGroup";

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="groups" component={Groups} />

      <Screen name="new" component={NewGroup} />

      <Screen name="players" component={Players} />
    </Navigator>
  );
}
