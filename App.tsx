import { NavigationContainer } from "@react-navigation/native";

import Home from "./src/navigation/Home";
import { AuthProvider } from "./src/auth/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Home />
      </NavigationContainer>
    </AuthProvider>
  );
}