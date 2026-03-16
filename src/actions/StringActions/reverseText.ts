export async function reversetext(data:{payload:string}){
    const arr:string[]=data.payload.split('');
    arr.reverse(); 
    return {result: arr.join('')};
};