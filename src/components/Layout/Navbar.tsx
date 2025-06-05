/** @format */

import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
// import { useDashboardStore } from "@/stores/dashboardStore";

const Navbar = () => {
  // const { stats } = useDashboardStore();

  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-4 lg:px-6">
      <div className="navbar-start">
        <label
          htmlFor="drawer-toggle"
          className="btn btn-square btn-ghost lg:hidden"
        >
          <Bars3Icon className="h-6 w-6" />
        </label>
      </div>

      <div className="navbar-center">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a>Sistem Deteksi Penyakit Sapi</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="navbar-end">
        {/* Quick Stats */}
        <div className="hidden lg:flex items-center space-x-4 mr-4">
          <div className="stats stats-horizontal shadow">
            <div className="stat py-2 px-4">
              <div className="stat-title text-xs">Total Sapi</div>
              <div className="stat-value text-lg">
                {/* {stats?.quick_stats.total_sapi || 0} */}
              </div>
            </div>
            <div className="stat py-2 px-4">
              <div className="stat-title text-xs">Pemeriksaan Hari Ini</div>
              <div className="stat-value text-lg">
                {/* {stats?.quick_stats.pemeriksaan_hari_ini || 0} */}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <div className="indicator">
              <BellIcon className="h-5 w-5" />
              {/* {stats?.alerts && stats.alerts.length > 0 && (
                <span className="badge badge-xs badge-primary indicator-item"></span>
              )} */}
            </div>
          </label>
          <div
            tabIndex={0}
            className="dropdown-content z-[1] card card-compact w-64 p-2 shadow bg-base-100"
          >
            {/* <div className="card-body">
              <h3 className="font-bold text-lg">Notifikasi</h3>
              {stats?.alerts && stats.alerts.length > 0 ? (
                <div className="space-y-2">
                  {stats.alerts.slice(0, 3).map((alert, index) => (
                    <div
                      key={index}
                      className={`alert alert-${alert.type} alert-sm`}
                    >
                      <div>
                        <h4 className="font-semibold">{alert.title}</h4>
                        <p className="text-xs">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm opacity-70">Tidak ada notifikasi</p>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
