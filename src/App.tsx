import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Route, BrowserRouter } from 'react-router-dom';

import { AuthContextProvider } from './contexts/AuthContext';

function App() {

  return (
    <BrowserRouter>
      <AuthContextProvider>
          <Route 
            path="/"
            component={Home}
            //falando que para acessar essa rota, o endereco precisa ser exatamente esse, que no caso é /
            exact
          />
          <Route 
            path="/rooms/new"
            component={NewRoom}
          />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
