import Background from "@/assets/login2.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import apiClient from "@/lib/api-client";
import { setUserInfo } from "@/store/slices/authSlice";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateSignup = () => {
    if (!email || !password || !confirmPassword) {
      toast.error("Please fill all the fields");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const validateLogin = () => {
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        setLoading(true);
        const response = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.data.user.id) {
          dispatch(setUserInfo(response.data.user));
          if (response.data.user.profileSetup) {
            navigate("/chat");
          } else {
            navigate("/profile");
          }
        }
        toast.success("Logged in successfully!");
      } catch (error) {
        toast.error("Login failed. Please try again.");
        console.error("Login error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      try {
        setLoading(true);
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          {
            email,
            password,
          },
          { withCredentials: true }
        );
        if (response.status === 201) {
          dispatch(setUserInfo(response.data.user));
          navigate("/profile");
        }
        toast.success("Signed up successfully!");
      } catch (error) {
        toast.error("Signup failed. Please try again.");
        console.error("Signup error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-cover">
      <div className="border-2 border-white text-opacity-90 shadow-2xl w-[80vw] h-[80vh] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 p-4">
        <div className="flex flex-col items-center justify-center gap-10 p-4">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome</h1>
            </div>
            <p className="font-medium text-center">
              Fill in your details to get started
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Sign Up
                </TabsTrigger>
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Log In
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6 outline-none focus:outline-purple-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6 outline-none focus:outline-purple-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6 outline-none focus:outline-purple-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  className="rounded-full p-6"
                  onClick={handleSignup}
                  disabled={loading}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6 outline-none focus:outline-purple-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6 outline-none focus:outline-purple-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  className="rounded-full p-6"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Logging In..." : "Log In"}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background} alt="Background" className="h-[500px]" />
        </div>
      </div>
    </div>
  );
}

export default Auth;
