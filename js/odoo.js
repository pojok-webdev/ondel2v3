auth = callback => {
    var axios = require('axios');
    var data = JSON.stringify({
    "params": {
        "login": "apipadi@gmail.com",
        "password": "Totol1nk",
        "db": "padish"
    }
    });

    var config = {
    method: 'post',
    url: 'https://demo.kapesolusi.work/auth',
    headers: { 
        'Content-Type': 'application/json', 
//        'Cookie': 'session_id=077bdf6d2c569eb6ea4955d57387bdf42425a800'
    },
    data : data
    };

    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      callback(response.headers)
    })
    .catch(function (error) {
        console.log(error);
        callback(error)
    });

}
kelurahan = _ => {
    var axios = require('axios');

    var config = {
    method: 'get',
    url: 'demo.kapesolusi.work/api/vit.kelurahan?query={id,display_name,kecamatan_id,name}',
    headers: { 
        'Cookie': 'session_id=077bdf6d2c569eb6ea4955d57387bdf42425a800'
    }
    };

    axios(config)
    .then(function (response) {
    console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
    console.log(error);
    });

}
module.export = {
    auth:auth,
    kelurahan:kelurahan
}