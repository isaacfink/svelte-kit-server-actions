export async function sampleServerAction({id, name}:{id:number, name:string}){
    console.log(`Function called from server with id: ${id} and name: ${name}`)

    return {
        success:true
    }
}

// export function sampleServerAction2(){
//     console.log(`Function called from server`)
//     return {
//         success:true
//     }
// }