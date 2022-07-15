

exports.validateInput =(schema, ctx)=>{
    
    const result = schema.validate(ctx.request.body);
    
    if(result.error){
        ctx.status = 400;
        ctx.body = result.error.details[0].message; //메세지가 detailes배열안에들어잇음
        return;
    } 
};

