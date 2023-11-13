import {useEffect, useState} from 'react';
import { useOktaAuth } from '@okta/okta-react';
import MessageModel from '../../../models/MessageModel';
import { error } from 'console';
import { SpinnerLoading } from '../../Utills/SpinnerLoading';
import { Pagination } from '../../Utills/Pagination';
export const Messages = () => {

    const{authState} = useOktaAuth();
     // State variables for managing loading state and HTTP errors
    const[isLoadingMessages,setIsLoadingMessages] = useState(true);
    const[httpError,setHttpError] = useState(null);

    //Messages
    const[messages,setMessages] = useState<MessageModel[]>([]);

    //Pagination
    const[messagesPerPage] = useState(5);
    const[currentPage,setCurrentPage] = useState(1);
    const[totalPages,setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUserMessages = async () => {
            //authentication check
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/messages/search/findByUserEmail/?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=${messagesPerPage}`;


                 // Request options including authorization header
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization:`Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };

                // Fetch user messages from the API
                const messageResponse = await fetch(url, requestOptions);

                
                if (!messageResponse.ok) {
                    throw new Error('Something went wrong!');
                }

                // Parse the JSON response
                const messageResponseJson = await messageResponse.json();

              // Set messages and total pages based on the API response
                setMessages(messageResponseJson._embedded.messages);
                setTotalPages(messageResponseJson.page.totalPages);
            }
           // Set loading state to false after fetching messages
            setIsLoadingMessages(false);
        }
         // Fetch user messages and handle errors
        fetchUserMessages().catch((error:any)=>{
            setIsLoadingMessages(false);
            setHttpError(error.message)
        })
        // Scroll to the top of the page
        window.scrollTo(0,0);
    },[authState,currentPage]);

    if(isLoadingMessages){
        return (
            <SpinnerLoading/>
        );
    }

    if(httpError){
        return(
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    const paginate = (pageNumber:number) => setCurrentPage(pageNumber);

    return(
        <div className='mt-2'>
            {messages.length > 0?
                 <>
                    <h5>Curremt Q/A:</h5>
                    {messages.map(message => (
                        <div key={message.id}>
                            <div className='card mt-2 shadow p-3 bg-body rounded'>
                                <h5>Case #{message.id}:{message.title}</h5>
                                <h6>{message.userEmail}</h6>
                                <p>{message.question}</p>
                                <hr/>
                                <div>
                                    <h5>Response:</h5>
                                    {message.reponse && message.adminEmail?
                                    <>
                                        <h6>{message.adminEmail}(admin)</h6>
                                        <p>{message.reponse}</p>
                                    </>
                                    :
                                        <p><i>Pending response from administration.Please be patient.</i></p>
                                    }
                                </div>
                            </div>  
                        </div>
                    ))}
                </>
                :
                <h5>All questions submit will be shown here</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}