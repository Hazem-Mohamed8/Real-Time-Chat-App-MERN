import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "@/utils/constants";
import { setUserInfo } from "@/store/slices/authSlice";

// InputField component remains the same
const InputField = ({ value, placeholder, onChange, disabled }) => (
  <div className="w-full">
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
      className="rounded-lg p-4 bg-[#2c2e3b] border-none w-full"
    />
  </div>
);

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [userColor, setUserColor] = useState(0);

  const validateProfile = () => {
    if (!firstName || !lastName || userColor === undefined) {
      toast.error("Please fill in all fields.");
      return false;
    }
    return true;
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const response = await apiClient.post(
          ADD_PROFILE_IMAGE_ROUTE,
          formData,
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.user.image) {
          const updatedImage = `${HOST}${response.data.user.image}`;

          toast.success("Profile image updated successfully.");

          setImage(updatedImage);

          dispatch(
            setUserInfo({ ...userInfo, image: response.data.user.image })
          );
        } else {
          toast.error("Failed to update profile image.");
        }
      } catch (error) {
        toast.error("Failed to update profile image.");
        console.error("Error updating profile image:", error);
      }
    }
  };

  const removeImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success("Profile image removed successfully.");

        setImage(null);

        dispatch(setUserInfo({ ...userInfo, image: null }));
      } else {
        toast.error("Failed to remove profile image.");
      }
    } catch (error) {
      toast.error("Failed to remove profile image.");
      console.error("Error removing profile image:", error);
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    }
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      const data = JSON.stringify({
        firstName,
        lastName,
        color: userColor,
      });

      try {
        const response = await apiClient.post(UPDATE_PROFILE_ROUTE, data, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        dispatch(
          setUserInfo({
            ...userInfo,
            firstName,
            lastName,
            color: userColor,
            profileSetup: true,
          })
        );
        toast.success("Profile updated successfully!");
      } catch (error) {
        console.error("Error saving changes:", error.response?.data || error);
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (userInfo) {
      setLoading(false);
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
      setUserColor(userInfo.color);

      if (userInfo.image) {
        setImage(`${HOST}${userInfo.image}`);
      } else {
        setImage(null);
      }
    }
  }, [userInfo]);

  if (loading) {
    return <p>Loading user info...</p>;
  }

  if (!userInfo) {
    return <p>No user info available</p>;
  }

  return (
    <div className="bg-[#1b1c24] h-screen flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <IoArrowBack
            className="text-white/90 text-4xl lg:text-5xl cursor-pointer"
            onClick={handleNavigate}
          />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="flex items-center justify-center h-full w-32 md:w-48 md:h-48 relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="Profile"
                  className="w-full h-full object-cover bg-black"
                />
              ) : (
                <div
                  className={`w-32 h-32 md:w-48 md:h-48 uppercase text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    userColor
                  )}`}
                >
                  {firstName
                    ? firstName[0].toUpperCase()
                    : userInfo.email[0].toUpperCase()}
                </div>
              )}
            </Avatar>

            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                {image ? (
                  <FaTrash
                    className="text-white text-3xl cursor-pointer"
                    onClick={removeImage}
                  />
                ) : (
                  <label>
                    <FaPlus className="text-white text-3xl cursor-pointer" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      name="avatar"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center gap-5 text-white min-w-32 md:min-w-64">
            <InputField
              value={userInfo.email || ""}
              placeholder="Email"
              disabled
            />
            <InputField
              value={firstName}
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <InputField
              value={lastName}
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
            />
            <div className="w-full flex gap-2 md:gap-5">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full transition-all duration-300 cursor-pointer ${color} ${
                    userColor === index ? "border-4" : ""
                  }`}
                  onClick={() => setUserColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <button
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 text-white rounded-lg font-semibold"
            onClick={saveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
