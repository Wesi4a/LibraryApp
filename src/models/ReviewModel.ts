class ReviewModel{
    id:number;
    userEmail:string;
    date:string;
    rating:number;
    book_id:number;
    reviewDescription?:string;

    constructor(id:number,userEmail:string,date:string,rating:number,book_id:number,reviewDescription:string){
        this.date = date;
        this.id = id;
        this.userEmail = userEmail;
        this.rating = rating;
        this.reviewDescription = reviewDescription;
        this.book_id = book_id;
    }
}

export default ReviewModel;