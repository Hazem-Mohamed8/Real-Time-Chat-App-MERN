import { useState, useEffect } from "react";
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
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";
import apiClient from "@/lib/api-client";
import { CREATE_GROUP_ROUTE, GET_ALL_CONTACTS_ROUTE } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addGroup } from "@/store/slices/chatSlice";

export default function CreateGroup() {
  const [newGroupModel, setNewGroupModel] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  // Fetch contacts on component load
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {
          withCredentials: true,
        });
        if (response.data.contacts) {
          setContacts(response.data.contacts);
        }
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };
    fetchContacts();
  }, []);

  const createGroup = async () => {
    try {
      setLoading(true);
      if (!groupName || !selectedContact.length) {
        return;
      }
      const response = await apiClient.post(
        CREATE_GROUP_ROUTE,
        {
          name: groupName,
          members: selectedContact.map((contact) => contact.value),
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        setNewGroupModel(false);
        setGroupName("");
        setSelectedContact([]);
        setContacts(response.data.contacts);
        dispatch(addGroup(response.data.group));
      }
    } catch (error) {
      console.error("Failed to create group:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-500 font-light text-opacity-90 hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setNewGroupModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-3 p-2 text-white">
            Create New Group
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={newGroupModel} onOpenChange={setNewGroupModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-auto flex flex-col">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Please fill in the details below to create a new group.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Group Name"
              className="rounded-lg p-4 border-none bg-[#2c2e3b] text-white"
              onChange={(e) => setGroupName(e.target.value)}
              value={groupName}
              disabled={loading}
            />
            <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] text-white border-none p-2"
              defaultOptions={contacts}
              placeholder="Select Contacts"
              value={selectedContact}
              onChange={setSelectedContact}
              emptyIndicator={
                <p className=" text-center text-gray-600">No results found</p>
              }
            />
          </div>
          <div className="mt-4">
            <Button
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              disabled={loading}
              onClick={createGroup}
            >
              {loading ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
