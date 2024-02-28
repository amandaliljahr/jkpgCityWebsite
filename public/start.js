fetch("http://localhost:3005/stores")
.then(response => response.json())
.then(stores => {
    const storeListContainer = document.getElementById('storeList');
    
    stores.forEach(store => {
        if (store.url !== null) {
            const storeLink = document.createElement('a');
            storeLink.textContent = store.name;
            
            if (store.url && !store.url.startsWith("http://") && !store.url.startsWith("https://")) {
                storeLink.href = "http://" + store.url;
            } else {
                storeLink.href = store.url;
            }
            
            storeLink.target = "_blank"; 
            
            storeListContainer.appendChild(storeLink);
        } else {
            const storeName = document.createElement('span');
            storeName.textContent = store.name;
            storeListContainer.appendChild(storeName);
        }
        storeListContainer.appendChild(document.createElement('br'));
    });
})
.catch(error => {
    console.error('Error fetching stores:', error);
});
