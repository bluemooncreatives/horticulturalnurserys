import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { showToast } from "@/lib/showToast";
import { ADMIN_LOGIN } from "@/routes/AdminPanelRoute";
import { logout } from "@/store/reducer/authReducer";
import { persistor } from "@/store/store";

import axios from "axios";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";

const LogoutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        "/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      dispatch(logout());
      await persistor.purge();

      showToast("success", data.message);
      window.location.replace(ADMIN_LOGIN);
    } catch (error) {
      showToast("error", error.message || "Logout failed");
    }
  };

  return (
    <DropdownMenuItem
      onClick={handleLogout}
      className="cursor-pointer"
    >
      <LogOut className="size-4 text-red-500" />
      Logout
    </DropdownMenuItem>
  );
};

export default LogoutButton;
