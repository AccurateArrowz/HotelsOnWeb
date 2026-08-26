import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AdminPage() {
  return (
    <div>
      <Sidebar />
      <Outlet />
    </div>
  );
}
