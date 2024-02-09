import { Link, Outlet } from 'react-router-dom';
import NotificationManager from './components/NotificationManager';

function App() {
  const displayNotificationManager = 'Notification' in window;
  return (
    <div className="App">
      <Link to="/">
        <h1 className="text-center">Emeline's tweets</h1>
      </Link>

      <Outlet />

      <div className="text-center fixed-bottom">
        <div
          className="rounded-pill px-3 py-1 mb-2 bg-info-subtle d-inline-block"
        >
          Créé par Emeline Lecourt
          {displayNotificationManager && <NotificationManager/>}
        </div>
      </div>
    </div>
  );
}

export default App;
