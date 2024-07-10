class APIFeatures{

    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
}

 filter(){
    const queryObj = {...this.queryString} //Since in javascript, when we assign a variable the value of an object, the variable contains the reference of teh object. Since we need the hard copy of the query object, we will destructure the object in the variable, giving us a new object, queryObj
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field)=> delete(queryObj[field])); //Deleting all the extra fields that will not be required during filtering

    //Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr =  queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); //It will find the operators in the query string and replace them with the same operations but with a dollar sign
    
    
   this.query =  this.query.find(JSON.parse(queryStr));
   // let query =  Tour.find(JSON.parse(queryStr));

   return this; //Returning the entire object after the function has been executed

}

sort(){
    if(this.queryString.sort){
        const sortBy = this.queryString.sort.split(',').join(' '); 
        this.query  = query.sort(sortBy); 
    }else {
        this.query = this.query.sort('-createdAt'); 
    }

    return this;
}

limitFields(){
    if(this.queryString.fields){
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields); //Mutating the this.query

    }
    else{
        this.query = this.query.select('-__v'); //Excluding the __v field using the - operator
    }

    return this;
}

paginate(){
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit; //This formula will allow the user to pagniate
    this.query = this.query.skip(skip).limit(limit);


    return this;
}
}

module.exports = APIFeatures;