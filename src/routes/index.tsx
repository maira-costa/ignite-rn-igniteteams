import { NavigationContainer } from "@react-navigation/native"; //usando o core de navegação
import { AppRoutes } from "./app.routes";
import { View } from "react-native";
import { useTheme } from "styled-components";

export function Routes() {
  const { COLORS } = useTheme();

  //O backgroundColor na View evita que ao navegar entre telas pisque uma tela branca
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.GRAY_600 }}>
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </View>
  );
}
