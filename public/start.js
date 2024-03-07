document.addEventListener('DOMContentLoaded', () => {
    fetchStores();
});

let storesData;

function fetchStores() {
    fetch("http://localhost:3005/stores")
        .then(response => response.json())
        .then(stores => {
            storesData = stores.sort((a, b) => a.name.localeCompare(b.name));
            displayStores(storesData);
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

        storeBox.appendChild(storeName);
        storeListContainer.appendChild(storeBox);

        storeBox.addEventListener('click', function(event) {
            event.preventDefault();
            if (store.url) {
                window.open(store.url.startsWith("http://") || store.url.startsWith("https://") ? store.url : "http://" + store.url, '_blank');
            }
        });
    });
}

document.getElementById('applyFiltersButton').addEventListener('click', applyFilters);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));

        window.scrollTo({
            top: target.offsetTop - 100,
            behavior: 'smooth'
        });
    });
});

document.getElementById('addStoreForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('storeName').value;
    const url = document.getElementById('storeUrl').value;
    const district = document.getElementById('storeDistrict').value;

    fetch("http://localhost:3005/store", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, url, district })
    })
    .then(response => {
        if (response.ok) {
            console.log('New store added successfully');
            document.getElementById('storeName').value = '';
            document.getElementById('storeUrl').value = '';
            document.getElementById('storeDistrict').value = '';
            fetchStores();
        } else {
            console.error('Failed to add new store');
        }
    })
    .catch(error => {
        console.error('Error adding new store:', error);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const toggleFormButton = document.getElementById('toggleFormButton');
    const addStoreFormContainer = document.getElementById('addStoreFormContainer');

    toggleFormButton.addEventListener('click', () => {
        addStoreFormContainer.classList.toggle('open');
        if (addStoreFormContainer.classList.contains('open')) {
            toggleFormButton.textContent = 'Close Form';
        } else {
            toggleFormButton.textContent = 'Add a New Store';
        }
    });
});
