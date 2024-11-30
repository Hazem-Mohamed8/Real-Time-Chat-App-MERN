import { useEffect } from "react";
import NewDm from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import apiClient from "@/lib/api-client";
import {
  GET_ALL_CONTACT_ROUTE,
  GET_USER_GROUPS_ROUTE,
} from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setdirectContacts, setGroups } from "@/store/slices/chatSlice";
import ContactsList from "@/components/ui/contactsList";
import CreateGroup from "./components/create-group";

export default function ContactsContainer() {
  const { directContacts, groups } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await apiClient.get(GET_ALL_CONTACT_ROUTE, {
          withCredentials: true,
        });
        if (response.data.contacts) {
          dispatch(setdirectContacts(response.data.contacts));
        }
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    const getGroups = async () => {
      try {
        const response = await apiClient.get(GET_USER_GROUPS_ROUTE, {
          withCredentials: true,
        });
        if (response.data.groups) {
          dispatch(setGroups(response.data.groups));
        }
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    getContacts();
    getGroups();
  }, [dispatch]);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex justify-between items-center pr-10">
          <Title text="Direct Messages" />
          <NewDm />
        </div>
        <div className="max-h-[38vh] overflow-y-auto no-scrollbar">
          <ContactsList contacts={directContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex justify-between items-center pr-10">
          <Title text="Groups" />
          <CreateGroup />
        </div>
        <div className="max-h-[38vh] overflow-y-auto no-scrollbar">
          <ContactsList contacts={groups} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
}

const Logo = () => {
  return (
    <div className="flex p-5  justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>{" "}
      </svg>
      <span className="text-3xl font-semibold ">Raghy</span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="text-neutral-400 pl-10 font-light text-opacity-90 uppercase tracking-widest text-sm ">
      {text}
    </h6>
  );
};
