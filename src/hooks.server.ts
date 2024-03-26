import { error, type Handle } from "@sveltejs/kit";
import {mapper} from './hookMapper'
export const handle:Handle = async ({event, resolve}) => {
    if(event.url.pathname.startsWith('/_server_actions')){
        const func = event.url.pathname.split('/').pop()
        if(!func){
            throw error(400, 'No function name provided')
        }
        const handler = mapper[func]
        if(!handler) {
            console.log('No handler found')
            throw error(404, 'No handler found')}
        const response = await handler(await event.request.json())
        return new Response(JSON.stringify(response), {
            headers: {
                'content-type':'application/json'
            }
        })
        
    }else{
        return await resolve(event)
    }

}