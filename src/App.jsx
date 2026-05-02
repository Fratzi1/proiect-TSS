import Header from "./components/Header";
import { MealsContextProvider } from "./components/meals-context";
import Meals from "./components/Meals";
function App() {
  return (
    <MealsContextProvider>
      <Header />
      <main>
        <Meals />
      </main>
    </MealsContextProvider>
  );
}

export default App;
