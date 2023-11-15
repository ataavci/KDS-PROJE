const router=require('express').Router()
const{login,register}=require('../controllers/controller')
router.post("/login",login)
router.post("/login")
router.post("/register")
// post veri gondermek get vefri almak put veri güncelleme patch veri günclelleme delete veri silme 
module.exports=router