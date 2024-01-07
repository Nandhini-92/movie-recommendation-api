const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const https = require("https");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.use(express.static(path.join(__dirname + "")))

var movie_array;

app.get("/", function(req, res){
    res.render("list", {movie_array: movie_array});
});

app.post("/", function(req, res){
    var movie = req.body.film;
    if(movie != "")
    {
        var url = process.env.API + movie;

        var request = https.request(url, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data = data + chunk.toString();
            });

            response.on('end', () => {
                var movieData = JSON.parse(data);
                var n = movieData.total_results;
                movie_array = movieData.results;

                if(n == 0)
                {
                    movie_array = [
                        {
                            title: "Data Not Found!!",
                            original_title: "Data Not Found!!",
                            release_date : "Data Not Found!!",
                            id : "Data Not Found!!",
                            popularity : "Data Not Found!!",
                            poster_path : null,
                            overview : "We will upadate the data soon if such a movie exists 🙄"
                        }
                    ]
                }            
                res.redirect("/");
            });
            
        })
    }
    else{
        res.redirect("/");
    }
    request.on('error', (error) => {
        console.log('An error', error);
    });

    request.end()
})


app.listen(3000, function(){
    console.log("Server running on port 3000");
});