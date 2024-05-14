const todos = [
    {
        action: "Wake up",
        dueDate: new Date("2024-05-10"),
        completed: true
    },
    {
        action: "Take a shower",
        dueDate: new Date("2024-05-11"),
        completed: true
    },
    {
        action: "Feed the cats",
        dueDate: new Date("2024-05-12"),
        completed: true
    },
    {
        action: "Have a cuppa",
        dueDate: new Date("2024-05-13"),
        completed: false
    }
]


//import express and cors
const express = require('express')
const cors =  require('cors')

const app = express()
app.use(cors())

const PORT = 3001



//building an endpoint
app.get("/hello", (req,res) => {
    //adding the status and sending the data
    res.status(200).send("<h2>Hello, World!</h2>")
})

//building the todo endpoint
app.get("/todos", (req,res) => {
    res.status(200).json(todos)
})

//building a specified todo from the todos array
// app.get("/todos/:id", (req,res) => {
//     const id = req.params.id
//     const todo = todos[id - 1]
//     res.status(200).json(todo)
// })



//error handler
let todoNotFoundError = {
    status: 404,
    message: "Todo not found!"
}

//building a specified todo from the json
app.get("/todos/:id", (req,res) => {
    let id = req.params.id - 1
    if (id >= todos.length || id < 0){
        res.status(404)
        res.json(todoNotFoundError)
        return
    }
    res.status(200)
    res.json(todos[id])
})

//end point todos
app.get("/todosbyaction/:action", (req,res) => {
    let action = req.params.action
    let index = todos.findIndex(x => x.action.toLocaleLowerCase() == action)
    if(index == -1){
        res.status(404).json(todoNotFoundError)
        return
    }
    res.status(200).json(todos[index])
})


//date error handlers
let dateNotFormattedError = {
    status: 404,
    message: "Date is not properly formatted, please ensure you're using YYYY-MM-DD"
}

let todosNotFoundError = {
    status: 404,
    message: "Could not find any todos with the given condition"
}

//end point todos by date from URL
app.get("/todosbydate/:dueDate", (req, res) => {
    let date = new Date(req.params.dueDate) 
    if(date == NaN) {
        res.status(404)
        res.json(dateNotFormattedError)
        return
    }
    let datedArray = todos.filter(x => x.dueDate.getTime() == date.getTime())
    if(datedArray.length == 0) {
        res.status(404)
        res.json(todosNotFoundError)
        return
    }
    res.status(200)
    res.json(datedArray)
})


//end point todo status
app.get("/todosbycompleted/:completed", (req,res) => {
    let completedBool = false
    if(req.params.completed.toLocaleLowerCase() == "true"){
        completedBool = true
    }
    let filteredArray = todos.filter(x => x.completed == completedBool)
    if(filteredArray.length == 0){
        res.status(404).json(todoNotFoundError)
        return
    }
    res.status(200).json(filteredArray)
})

//end point todo updating the status
app.get("/completetodo/:id", (req,res) => {
    let id = req.params.id
    if(id >= todos.length || id < 0){
        res.status(404).json(todoNotFoundError)
        return
    }
    todos[id].completed = !todos[id].completed
    res.status(200).json(todos[id])
})

//end point delete an item from the list
app.get("/deletetodo/:id", (req,res) => {
    let id = req.params.id
    if(id >= todos.length || id < 0){
        res.status(404).json(todoNotFoundError)
        return
    }
    todos.splice(id, 1)
    res.status(200)
    res.json({ ListUpdate: `Item [${id}] was deleted from your Todo list, please see updated list below.`, todos })
})

//old end point create todos
// app.get("/createtodo/:action/:dueDate", (req,res) => {
//     let action = req.params.action
//     let dueDate = new Date(req.params.dueDate)
//     let completed = req.params.completed
//     let newTodo = {action, dueDate, completed:false}
//     todos.push(newTodo)
//     res.status(200).json(todos)
// })

//end point create todos
app.get("/createtodo/:action/:dueDate", (req,res) => {
    let date = new Date(req.params.dueDate)
    if(date == "Invalid Date"){
        res.status(404).json(dateNotFormattedError)
        return
    }
    let todo = {
        action: req.params.action,
        dueDate: date,
        completed: false
    }
    todos.push(todo)
    res.status(200).json(todos)
})


//listening the port
app.listen(PORT, () => {
    //console.log followed by the colour and the message
    console.log('\x1b[32m%s\x1b[0m',`🟢  Server is listening on http://localhost:${PORT}`)
})