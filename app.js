import express from "express";
import axios from "axios";
import bodyParser from "body-parser";


const app = express();
const port = 3000;
let steps = 0;
let result;


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    try {
        const response = await axios.get("https://shadify.dev/api/sudoku/generator");
        const sudokuTask = response.data.task;
        // const sudokuGrid = response.data.grid;
        // console.log(sudokuGrid);
        res.render("index.ejs", {
            sudokuTask
        })
    }
    catch (error) {
        console.log("Error: ", error.message);
    }

})


app.get("/about", (req, res)=>{
    res.render("about.ejs");
})


app.post("/result",async (req, res) => {
    const userData = [];

    for (let i = 0; i < 9; i++) {
        userData.push([]);
        for (let j = 0; j < 9; j++) {
            const field = `sudokuCell-${i}-${j}`;
            const cellValue = parseInt(req.body[field]);
            userData[i].push(cellValue);
        }
    }

    try{
        const response = await axios.post("https://shadify.dev/api/sudoku/verifier", 
        {task: userData} );
         result = response.data;
         steps++;
            res.render("result.ejs", {
                result: result.isValid,
                steps,
                 position: result.position
                   }
                )
        }
    
    catch(error){
        console.log("Error: ", error.message);
    }
})



app.listen(process.env.PORT || port, () => {
    console.log(`Listening on port ${port}`);
})