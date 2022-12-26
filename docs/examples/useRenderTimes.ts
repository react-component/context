import React from 'react';

const useRenderTimes = () => {
  const renderRef = React.useRef(0);
  renderRef.current += 1;

  return renderRef.current;
};

export default useRenderTimes;
