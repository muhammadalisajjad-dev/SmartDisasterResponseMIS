import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import OperationalStrip from './OperationalStrip';

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-surface-950">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden border-l border-slate-800/60">
        <Header />
        <OperationalStrip />
        <main className="app-main-bg p-5 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
