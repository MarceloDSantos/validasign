import React, { useContext } from 'react';
import { Redirect, Route, Routes } from 'react-router';

import ValidaSignDocs from '../pages/ValidaSignDocs';

// Componente exibido caso não localize alguma rota
const NotFound = () => {
  return <h1>Conteúdo não localizado</h1>;
};

// Componente de rotas
const Routes = () => {
  return (
    <Routes>

      {/* <CustomRoute
        path="/receita"
        exact
        isPrivate
        component={ValidaSignDocs}
      /> */}

    </Routes>
  );
};

export default Routes;
