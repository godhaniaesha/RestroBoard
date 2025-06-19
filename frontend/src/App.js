import logo from './logo.svg';
import './App.css';
import AdminRoutes from './route/admin.route';

import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <AdminRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;