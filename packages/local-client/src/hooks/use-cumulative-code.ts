import { useTypedSelector } from "./use-typed-selector";

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);

    const showFunc = `
        import _React from 'react';
        import _ReactDOM from 'react-dom';

        var show = (value) => {
          const rootEl = document.querySelector('#root');

          if (typeof value === 'object') {
            if (value.$$typeof && value.props) {
              _ReactDOM.render(value, rootEl);
            } else {
              rootEl.innerHTML = JSON.stringify(value);
            }
          } else {
            rootEl.innerHTML = value;
          }
        }
      `;

    const showFuncNoOp = "var show = () => {}";
    const cc = [];

    for (let c of orderedCells) {
      if (c.type === "code") {
        if (c.id === cellId) {
          cc.push(showFunc);
        } else {
          cc.push(showFuncNoOp);
        }

        cc.push(c.content);
      }

      if (c.id === cellId) break;
    }

    return cc;
  }).join("\n");
};
