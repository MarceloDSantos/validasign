import { ConfigProvider } from "antd";
import locale from "antd/lib/locale/pt_BR";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";

import SignReceita from "./pages/ValidaSignDocs";

// Componente principal que irá conter todo o App
const App = () => {
    return (

        // Componente de roteamento
        <Router>

            {/* Componente de linguagem da biblioteca ANTD */}
            <ConfigProvider locale={locale}>

                {/* Componente de troca de rotas */}
                <Switch>

                    {/* Define as rotas que serão renderizadas sem o layout com menu */}
                    <Route path="/" exact component={SignReceita} />

                </Switch>

            </ConfigProvider>

        </Router>
    );
};

export default App;
