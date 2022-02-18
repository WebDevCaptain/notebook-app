import ReactDOM from "react-dom";
import "bulmaswatch/superhero/bulmaswatch.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Provider } from "react-redux";

import CellList from "./components/cell-list";
import { store } from "./state";

const App = () => {
  return (
    <div>
      <Provider store={store}>
        <div>
          <CellList />
        </div>
      </Provider>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
