import { environment } from "../environments/environment.development";

export const apiUrls = {
    authServiceApi:environment.backend_api+'api/auth/',
    profileServie:environment.backend_api+'api/profile/',
    PostService:environment.backend_api+"api/post",
    EventService:environment.backend_api+"api/event",
    userService:environment.backend_api+"api/user",
    searchservice:environment.backend_api+'api/search',
    convoservice:environment.backend_api+'api/convo',
    messageService:environment.backend_api+'api/message',
    io:environment.backend_api+''
}
export const liveUrl={
    PostUrl:environment.frontend_url+'posts/'
}
