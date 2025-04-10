import { User } from "lucide-react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ALERT_CLASSES } from "../constants";
import { useAlert } from "../contexts/AlertContext";

export default function NavBar({ searchQuery, setSearchQuery }) {
  const { showAlert } = useAlert();
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    try {
      await logout();
      history.push("/login");
      showAlert(ALERT_CLASSES.SUCCESS, "Successfully logged out.");
    } catch {
      showAlert(ALERT_CLASSES.ERROR, "Failed to log out.");
    }
  }

  return (
    <div className="navbar bg-base-200 px-4 shadow">
      <div className="flex-1">
        <a className="ml-2 text-xl font-medium whitespace-nowrap">
          Personal Cloud Storage
        </a>
      </div>

      <div className="flex-none flex items-center gap-4">
        {/* Search Input */}
        <div className="form-control">
          <input
            type="text"
            placeholder="Search files ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-48 md:w-64"
          />
        </div>

        {/* User Dropdown */}
        {currentUser && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="avatar btn btn-circle btn-ghost"
            >
              <User />
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
