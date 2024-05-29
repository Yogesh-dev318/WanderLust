const mongoose=require("mongoose")
const initdata=require("./data.js")
const Listing=require("../models/listing.js")
main().then((result)=>{
    console.log("DB Connected")
})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
const initdb=async()=>{
    await Listing.deleteMany({})
    initdata.data= initdata.data.map((obj)=>({...obj,owner:"66548f8903028f4b176aa7ae"}))
    await Listing.insertMany(initdata.data)
    console.log("Data was saved")
}
initdb()