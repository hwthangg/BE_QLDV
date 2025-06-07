import Account from "../../model/account.model.js"
import { onlineUsers } from "./access"
import Notification from "../../model/notification.model.js"
export const register = async(io, socket)=>{
  const admin = await Account.findOne({role:'admin'})
  socket.on('register', ()=>{
    const notification = new Notification({
      text:'Bạn có yêu cầu phê duyệt tài khoản mới',
      
    })
  })
}