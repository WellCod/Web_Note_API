const mongoose = require('mongoose')


mongoose.connect(
    'mongodb://127.0.0.1/javascriptNote',
    async(err)=>{
        if(err) throw err;
        console.log("Connection succesful")
    }
)