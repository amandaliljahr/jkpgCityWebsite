console.log('Hello')

fetch("http://localhost:3005/stores")
.then(response => response.json())
.then(stores => {

    console.log(stores)
    
    
})