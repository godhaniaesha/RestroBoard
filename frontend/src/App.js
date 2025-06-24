import logo from './logo.svg';
import './App.css';
import RestaurantAdminPanel from './Component/RestaurantAdminPanel';
import AdminRoutes from './route/admin.route';


import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <>
      {/* <RestaurantAdminPanel></RestaurantAdminPanel> */}
      <BrowserRouter>
        <AdminRoutes />
      </BrowserRouter>

    </>
  );
}

export default App;