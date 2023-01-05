import React from 'react';

export const useRenderTimes = () => {
  const renderRef = React.useRef(0);
  renderRef.current += 1;

  return renderRef.current;
};

export function RenderTimer({ id }: { id?: string }) {
  const renderTimes = useRenderTimes();

  return (
    <div id={id} className="render-times">
      {renderTimes}
    </div>
  );
}

export function Value({ id, value }: { id?: string; value: any }) {
  const str = JSON.stringify(value);

  return (
    <div id={id} className="value">
      {(str || '').replace(/^"/, '').replace(/"$/, '')}
    </div>
  );
}
