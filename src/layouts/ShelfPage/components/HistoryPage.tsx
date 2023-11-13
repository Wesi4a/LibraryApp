import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import HistoryModel from "../../../models/HistoryModel";
import { error } from "console";
import { SpinnerLoading } from "../../Utills/SpinnerLoading";
import { Link } from "react-router-dom";
import { Pagination } from "../../Utills/Pagination";

export const HistoryPage = () => {
    //Authentication state using Okta
    const { authState } = useOktaAuth();

    //Loading and error state
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [httpError, setHttpError] = useState(null);

    //Histories
    const [histories, setHistories] = useState<HistoryModel[]>([]);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    //Fetch user history when the component mounts or when the authentication state changes
    useEffect(() => {
        const fetchUserHistory = async () => {
            //authentication check
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/histories/search/findBooksByUserEmail/?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=5`;

                //Set up the request options 
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                //Fetch the user history data
                const historyResponse = await fetch(url, requestOptions);

                //Check if the response is successful
                if (!historyResponse.ok) {
                    throw new Error('Something went wrong!');
                }

                //Parse the response to JSON
                const historyResponseJson = await historyResponse.json();

                //Update state with fetched history data
                setHistories(historyResponseJson._embedded.histories);
                setTotalPages(historyResponseJson.page.totalPages);
            }
            //Set loading state to false once data is fetched
            setIsLoadingHistory(false);
        }
        //Call the fetchUserHistory function
        fetchUserHistory().catch((error: any) => {
            //Set loading state to false and capture the error if there is any
            setIsLoadingHistory(false);
            setHttpError(error.message);
        })
    }, [authState, currentPage]);

    if (isLoadingHistory) {
        return (
            <SpinnerLoading />
        );
    }
    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="mt-2">
            {histories.length > 0 ?
            //Display user history if available
                <>
                    <h5> Recent History:</h5>

                    {histories.map(history => (
                        <div key={history.id}>
                            <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
                                <div className="row g-0">
                                    <div className="col-md-2">
                                        {/*display book image*/}
                                        <div className="d-none d-lg-block">
                                            {history.img ?
                                                <img src={history.img} width='123' height='196' alt="Book" />
                                                :
                                                <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                                    width='123' height='196' alt="Default" />
                                            }
                                        </div>
                                        <div className="d-lg-none d-flex justify-content-center align-item-center">
                                            {history.img ?
                                                <img src={history.img} width='123' height='196' alt="Book" />
                                                :
                                                <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                                    width='123' height='196' alt="Default" />
                                            }
                                        </div>
                                    </div>
                                    <div className="col">
                                            <div className="card-body">
                                                <h5 className="card-title">{history.author}</h5>
                                                <h4>{history.title}</h4>
                                                <p className="card-text">{history.description}</p>
                                                <hr/>
                                                <p className="card-text">Checked out on: {history.checkoutDate}</p>
                                                <p className="card-text">Returned on: {history.returnedDate}</p>
                                            </div>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                        </div>
                    ))}
                </>    
                :
                <>
                    <h3 className="mt-3">Currently no history: </h3>
                    <Link className="btn btn-primary" to={'search'}>Search for new book</Link>
                </>
        }
        {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    );
}