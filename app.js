const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);    
}

app.set("view engine", "ejs");
app.set(("views", path.join(__dirname, "views")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/",  async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

//Index Route
app.get("/listings", async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

//test
app.get("/test", async (req, res) => {
    const allListings = await Listing.find({}).lean();
    console.log(allListings[0].image); // check this prints correctly
    res.render("listings/test", { allListings });
  });
  

//New Route (keeping it above show route to avoid any confusion beteen id and new)
app.get("/listings/new", (req, res)=>{
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

//Create Route
app.post("/listings", async (req, res)=>{
    //let {title, description, image, price, location, country} = req.params;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

//Update Route
app.put("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//Delete Route
app.delete("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

// app.get("/testListing", async (req, res)=>{
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         discription: "By the beach",
//         price: 1200,
//         location: "Sitapur, UP",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("samplewas saved");
//     res.send("successful testing");
// });


app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});