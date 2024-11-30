import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationOption, getColor } from "@/lib/utils";
import apiClient from "@/lib/api-client";
import { HOST, SEARCH_CONTACT_ROUTE } from "@/utils/constants";
import debounce from "lodash.debounce";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useDispatch } from "react-redux";
import {
  setSelectedChatData,
  setSelectedChatType,
} from "@/store/slices/chatSlice";

export default function NewDm() {
  const [openNewContact, setOpenNewContact] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const searchContacts = debounce(async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        setLoading(true);
        const response = await apiClient.post(
          SEARCH_CONTACT_ROUTE,
          { searchTerm },
          { withCredentials: true }
        );

        if (response.status === 200 && response.data.contacts) {
          setContacts(response.data.contacts);
        } else {
          setContacts([]);
        }
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error("Error searching contacts:", error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    return () => {
      searchContacts.cancel();
    };
  }, []);

  const addContact = (contact) => {
    dispatch(setSelectedChatType("contact"));
    dispatch(setSelectedChatData(contact));

    setOpenNewContact(false);
    setContacts([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-500 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContact(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-3 p-2 text-white">
            Select new contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContact} onOpenChange={setOpenNewContact}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-6 border-none bg-[#2c2e3b] text-white"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          {loading ? (
            <div className="flex-1 flex flex-col justify-center items-center">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationOption}
              />
            </div>
          ) : contacts.length > 0 ? (
            <ScrollArea className="flex-1 h-[250px] overflow-y-auto no-scrollbar rounded-lg mt-4">
              <div className="space-y-2">
                {contacts.map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-white p-2 border-none hover:bg-[#2c2e3b] cursor-pointer rounded-lg transition-all duration-300"
                  >
                    <div className="flex items-center">
                      <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                        {contact.image ? (
                          <AvatarImage
                            src={`${HOST}${contact.image}`}
                            alt="Profile"
                            className="w-full h-full object-cover bg-black"
                            onError={(e) =>
                              (e.target.src = "/fallback-avatar.png")
                            }
                          />
                        ) : (
                          <div
                            className={`w-12 h-12 uppercase text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                              contact.color
                            )}`}
                          >
                            {contact.firstName
                              ? contact.firstName[0].toUpperCase()
                              : contact.email[0].toUpperCase()}
                          </div>
                        )}
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="ml-4">
                          {contact.firstName && contact.lastName ? (
                            <span className="text-lg font-semibold">
                              {contact.firstName} {contact.lastName}
                            </span>
                          ) : (
                            <span className="text-lg font-semibold">
                              {contact.email}
                            </span>
                          )}
                        </span>
                        <span className="ml-4 text-gray-500 text-xs">
                          {contact.email}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => addContact(contact)}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationOption}
              />
              <div className="text-opacity-80 flex text-white flex-col gap-5 items-center mt-5 lg:text-2xl text-xl text-center">
                <h3 className="poppins-medium">
                  Hi<span className="text-purple-500">!</span> Search new
                  <span className="text-purple-500"> Contact</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
