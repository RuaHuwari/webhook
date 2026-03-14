export async function uppercase(data:{payload:string}){
    return{
        result: data.payload.toUpperCase()
    };
}