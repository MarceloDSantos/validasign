import React from 'react';
import { Grid, Tag } from 'antd';

const { useBreakpoint } = Grid;

// Componente para exibir os breakpoints de grid da biblioteca ANTD
// Usado somente para fins de debug no ajuste de colunas do grid
const CurrentBreakpoint = () => {
  const screens = useBreakpoint();

  return (
    <>
      {Object.entries(screens)
        .filter((screen) => !!screen[1])
        .map((screen) => (
          <Tag color="blue" key={screen[0]}>
            {screen[0]}
          </Tag>
        ))}
    </>
  );
};

export default CurrentBreakpoint;
