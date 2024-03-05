document.addEventListener('DOMContentLoaded', () => {
    fetchStores();
});

let storesData;

function fetchStores() {
    fetch("http://localhost:3005/stores")
        .then(response => response.json())
        .then(stores => {
            storesData = stores;
            displayStores(stores);
        })
        .catch(error => {
            console.error('Error fetching stores:', error);
        });
}

function applyFilters() {
    const districtFilter = document.getElementById('districtFilter').value;
    const sortOrder = document.getElementById('sortOrder').value;

    let filteredStores = storesData;

    if (districtFilter !== 'all') {
        filteredStores = filteredStores.filter(store => store.district === districtFilter);
    }
    if (sortOrder === 'asc') {
        filteredStores.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'desc') {
        filteredStores.sort((a, b) => b.name.localeCompare(a.name));
    }
    displayStores(filteredStores);
}

function displayStores(stores) {
    const storeListContainer = document.getElementById('storeList');
    storeListContainer.innerHTML = '';

    stores.forEach(store => {
        const storeBox = document.createElement('div');
        storeBox.classList.add('store-box');

        const storeName = document.createElement('h3');
        storeName.classList.add('store-name');
        storeName.textContent = store.name;

        const storeLink = document.createElement('a');
        storeLink.classList.add('store-link');
        storeLink.textContent = store.url ? store.url : 'No URL provided';
        if (store.url) {
            storeLink.href = store.url.startsWith("http://") || store.url.startsWith("https://") ? store.url : "http://" + store.url;
            storeLink.target = '_blank';
        }

        storeBox.appendChild(storeName);
        storeBox.appendChild(storeLink);
        storeListContainer.appendChild(storeBox);
    });
}

document.getElementById('applyFiltersButton').addEventListener('click', applyFilters);
