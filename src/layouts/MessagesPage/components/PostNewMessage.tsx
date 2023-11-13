import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import MessageModel from "../../../models/MessageModel";

export const PostNewMessage =()=>{

    const{authState} = useOktaAuth();

    //State variable for managing title,question and display messages
    const[title,setTitle] = useState('');
    const[question,setQuestion] = useState('');
    const[displayWarning,setDisplayWarning] = useState(false);
    const[displaySuccess,setDisplaySuccess] = useState(false);

    async function submitNewQuestion(){
        const url = `http://localhost:8080/api/messages/secure/add/message`;
        if(authState?.isAuthenticated && title !== '' && question !== ''){
            const messageRequestModel:MessageModel = new MessageModel(title,question);
            const requestOptions ={
                method:'POST',
                headers:{
                    Authorization:`Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(messageRequestModel)
            };
            const submitNewQuestionResponse = await fetch(url,requestOptions);
            if(!submitNewQuestionResponse.ok){
                throw new Error('Something went wrong!');
            }

            setTitle('');
            setQuestion('');
            setDisplayWarning(false);
            setDisplaySuccess(true);
        }else{
            setDisplayWarning(true);
            setDisplaySuccess(false)
        }
    }


    return(
        <div className="card mt-3">
            {/* Display success message when displaySuccess is true */}
            {displaySuccess &&
                <div className="alert alert-success" role="alert">
                    Question added successfully
                </div>
            }
             {/* Card header for the new message form */}
            <div className="card-header">
                Ask question to admin
            </div>
            {/* Card body containing the form */}
            <div className="card-body">
                  {/* Form for submitting a new question */}
                <form method="Post">
                     {/* Display warning message when displayWarning is true */}
                    {displayWarning && 
                    <div className="alert alert-danger" role="alert">
                        All fields must be filled out
                    </div>
                    }
                    {/* Input field for the title */}
                    <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Title"
                        onChange={e=>setTitle(e.target.value)} value={title}/>
                    </div>
                    {/* Textarea for entering the question */}
                    <div className="mb-3">
                        <label className="form-label">Question</label>
                        <textarea className="form-control" id="exampleFormControlArea" rows={3} onChange={
                            e=>setQuestion(e.target.value)} value={question}></textarea>
                    </div>
                    {/* Submit button for the form */}
                    <div>
                            <button type="button" className="btn btn-primary mt-3" onClick={submitNewQuestion}>Submit Question</button>
                    </div>
                </form> 
            </div>
        </div>

    );
}