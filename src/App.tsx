import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from "./pages/Room";

import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext';

function App() {

  return (
    <BrowserRouter>
      <AuthContextProvider>
        {/* Evita que duas rotas sejam chamadas ao mesmo tempo */}
        <Switch>
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
          <Route 
            path="/rooms/:id"
            component={Room}
          />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
