import { useState } from "react";
import { PostNewMessage } from "./components/PostNewMessage";
import { Messages } from "./components/Messages";

export const MessagesPage = () =>{
    //state to track whether "Submit Question" or "Q/A Response/Pending" tab is active
    const[messagesClick,setMessagesClick] = useState(false);
    
    
    return(
        <div className="container">
            <div className="mt-3 mb-2">
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        {/* "Submit Question" tab */}
                        <button onClick={()=>setMessagesClick(false)} className="nav-link active"
                        id="nav-send-message-tab" data-bs-toggle='tab' data-bs-target='#nav-send-message'
                        type="button" role="tab" aria-controls="nav-send-message" aria-selected='true'>
                            Submit Question
                        </button>
                         {/* "Q/A Response/Pending" tab */}
                        <button onClick={()=>setMessagesClick(true)} className="nav-link"
                        id="nav-message-tab" data-bs-toggle='tab' data-bs-target='#nav-message'
                        type="button" role="tab" aria-controls="nav-message" aria-selected='false'>
                            Q/A Response/Pending
                        </button>
                    </div>
                </nav> 
                {/* Tab content */}
                <div className="tab-content" id="nav-tabContent">
                    {/* "Submit Question" tab content */}
                    <div className="tab-pane fade show active" id="nav-send-message" role="tabpanel"
                    aria-labelledby="nav-send-message-tab">
                        <PostNewMessage/>
                    </div>
                    {/* "Q/A Response/Pending" tab content */}
                    <div className="tab-pane fade"id="nav-message" role="tabpanel" aria-labelledby="nav-meesage-tab">
                        {/* Display the content based on the active tab */}
                        {messagesClick? <Messages/> : <></>}
                    </div>
                </div>
            </div>
        </div>
    );
    
}