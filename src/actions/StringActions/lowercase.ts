export async function lowercase(data:{payload:string}){
    return{
        result: data.payload.toLowerCase()
    };
}