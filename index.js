var i = require('./js/appInit')
i.app.get('/clients',(req,res)=>{
  /*i.auth.checkLogin({
    req:req,res:res,redirpath:'clients/table',title:'Pelanggan',pagename:'Pelanggan'
  })*/
  res.render('clients/table',{title:'Pelanggan',pagename:'Penggalan',email:'ciluukbaa'})
})
i.app.get('/dataclients',(req,res)=>{
  i.con.doQuery('select id,name,location_id,address,picname,picwa,description,kdfb,concat("_",ou,"_") ou from qiscus.clients',result=>{
    res.send({data:result.map(obj=>{
      return [obj.id,obj.name,obj.location_id,obj.address,obj.picname,obj.picwa,obj.description,obj.kdfb,obj.ou]
    })})
  })
  res.send({data:[
    ["1","abc","loc1","sidaorjo","joko","123456","hehe","hdfsdjkfds","SBY"],
    ["2","bcd","loc2","sidaorjo","joni","231231","hoho","ddddd","SBY"]
  ]})
})
i.app.get('/kelurahanjatim',(req,res)=>{
  res.render('kelurahanjatim',{
    title:'kampret'
  })
})
i.app.listen(i.setting.port,_=>{
    console.log('QisCus API Server start at port ',i.setting.port)
})