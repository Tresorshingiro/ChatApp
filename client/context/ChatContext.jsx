import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({ children}) => {
    const [message, setMessage] = useState([]);
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({})

    const {socket, axios} = useContext(AuthContext)

    //function to get all users for sidebar
    const getUsers = async () => {
        try{
            const {data} = await axios.get('/api/messages/users');
            if(data.success) {
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch(error){
            toast.error(error.message)
        }
    }

    //function to get message for selected user
    const getMessages = async (userId) => {
        try{
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success) {
                setMessage(data.messages)
            }
        } catch(error) {
            toast.error(error.message)
        }
    }

    //function to send message to selected user
    const sendMessage = async (messageData) => {
        try{
            const { data } = await axios.post(`/api/messages/${selectedUser._id}`, messageData);
            if(data.success){
                setMessage((prevMessage) => [...prevMessage, data.newMessage])
            }else{
                toast
            }
        } catch(error){
            toast.error(error.message)
        }
    }

    // function to subscribe to message for selected user
    const subscribeToMessages = async () => {
        if(!socket) return;

        socket.on('newMessage', (newMessage) => {
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessage((prevMessages) => [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else {
                setUnseenMessages((prevUnseenMessages)=> ({
                    ...prevUnseenMessages,
                    [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })

    }
    
    //function to unsubscribe from message for selected user
    const unsubscribeFromMessages = () => {
        if(socket) socket.off('newMessage');
    }

    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [socket, selectedUser])


    const value = {
        message,
        setMessage,
        users,
        selectedUser,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        getUsers,
        getMessages,
        sendMessage
    }
    return(
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}