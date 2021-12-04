import "./Messenger.css";
import Topbar from "../../components/Topbar/Topbar";
import Conversations from "../../components/Conversations/Conversations";
import Message from "../../components/Message/Message";
import ChatOnline from "../../components/ChatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";


const Messenger = () => {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const scrollRef = useRef();


    const { user } = useContext(AuthContext);

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("/conversations/" + user._id);
                setConversations(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        getConversations();
    }, [user._id]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get("/messages/" + currentChat?._id)
                setMessages(res.data);
            } catch (error) {
                console.log(error)
            }
        };
        getMessages();
    }, [currentChat]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sneder: user._id,
            text: newMessage,
            conversationId: currentChat._id,
        };

        try {
            const res = await axios.post("/messages", message);
            setMessages([...messages, res.data])
            setNewMessage("");

        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])


    return (
        <>
            <Topbar />
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input type="text" className="chatMenuInput" placeholder="Search for friends" />
                        {conversations.map((c) => (
                            <div onClick={() => setCurrentChat(c)}>
                                <Conversations conversation={c} currentUser={user} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {
                            currentChat ?
                                <>
                                    <div className="chatBoxTop">
                                        {messages.map((m) => (
                                            <div ref={scrollRef}>
                                                <Message message={m} own={m.sender === user._id} />
                                            </div>
                                        ))}

                                    </div>
                                    <div className="chatBoxBottom">
                                        <textarea
                                            placeholder="Write something..."
                                            className="chatMessageInput"
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            value={newMessage}
                                        >
                                        </textarea>
                                        <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                                    </div>
                                </>
                                :
                                <span className="noConversationText">Open a conversation to start a chat.</span>
                        }
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Messenger
