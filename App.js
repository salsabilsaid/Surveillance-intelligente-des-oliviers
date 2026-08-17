import { PaperProvider } from "react-native-paper";
import Navigation from "./src/navigation/Navigation";
import { TreeProvider } from "./src/context/TreeContext";
import { AuthProvider } from "./src/context/AuthContext";

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <TreeProvider>
          <Navigation />
        </TreeProvider>
      </AuthProvider>
    </PaperProvider>
  );
}