import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import apiClient from "./lib/api-client";
import { setUserInfo } from "./store/slices/authSlice";
import { USERINFO } from "./utils/constants";
import { SocketProvider } from "./context/SocketContext";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const isAuth = !!userInfo;

  return isAuth ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const isAuth = !!userInfo;

  return isAuth ? <Navigate to="/chat" /> : children;
};

function App() {
  const [loading, setLoading] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(USERINFO, {
          withCredentials: true,
        });
        if (response.data.user.id) {
          dispatch(setUserInfo(response.data.user));
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, [userInfo, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/auth"
            element={
              <AuthRoute>
                <Auth />
              </AuthRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
