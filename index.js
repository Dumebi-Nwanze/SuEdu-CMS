const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

const app = express()
dotenv.config()
const port = process.env.PORT || 80

try {
    mongoose.connect(process.env.MONGO_URL_REMOTE).then(()=>{
        console.log("Connected to MongoDB successfully");
    })

} catch (error) {
    console.log("Could not connect to MongoDB");
    console.log("Error: ", error)
}

const authRouter = require("./controllers/AuthController")
const userRouter = require("./controllers/UserController")
const productsRouter = require("./controllers/ProductController")


app.use(express.json())

const router = express.Router()
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/products", productsRouter);


router.get("/health",(req, res)=>{
    res.status(200).json({
        status: 200,
        message: "The CMS server is running",
    })
})

router.get("/",(req, res)=>{
    res.status(200).json({
        status: 200,
        message: "Welcome to SuEdu CMS API by Dumebi",
    })
})

app.use(router)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use("*",(req, res)=>{
    res.status(404).json({
        status: 404,
        message: "This route doesn't exist"
    })
})



app.listen(port, ()=>{
    console.log("Server is running on port ", port);
})