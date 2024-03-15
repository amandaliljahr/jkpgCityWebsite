document.addEventListener('DOMContentLoaded', () => {
    fetchStores();
});

let storesData;

function fetchStores() {
    fetch("http://localhost:3000/stores")
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

        storeBox.setAttribute('data-id', store.id);

        const storeName = document.createElement('h3');
        storeName.classList.add('store-name');
        storeName.textContent = store.name;

        const moreInfoButton = document.createElement('button');
        moreInfoButton.textContent = 'More Info';
        moreInfoButton.classList.add('more-info-button'); 
        moreInfoButton.addEventListener('click', function(event) {
            event.stopPropagation();
            console.log('More Info button clicked for store:', store.id);
            toggleStoreInfo(store.id);
        });

        const infoContainer = document.createElement('div');
        infoContainer.classList.add('store-info');
        infoContainer.style.display = 'none';

        const districtInfo = document.createElement('p');
        districtInfo.textContent = `District: ${store.district}`;

        const descriptionInfo = document.createElement('p');
        descriptionInfo.textContent = `Description: ${store.description}`;

        infoContainer.appendChild(districtInfo);
        infoContainer.appendChild(descriptionInfo);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', function(event) {
            event.stopPropagation(); 
            editStore(store.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function(event) {
            event.stopPropagation(); 
            deleteStore(store.id);
        });

        storeBox.appendChild(storeName);
        storeBox.appendChild(moreInfoButton);
        storeBox.appendChild(infoContainer);
        storeBox.appendChild(editButton);
        storeBox.appendChild(deleteButton);
        storeListContainer.appendChild(storeBox);

        storeBox.addEventListener('click', function(event) {
            event.preventDefault();
            if (store.url) {
                window.open(store.url.startsWith("http://") || store.url.startsWith("https://") ? store.url : "http://" + store.url, '_blank');
            }
        });
    });
}


function toggleStoreInfo(storeid) {
    const storeInfo = document.querySelector(`.store-box[data-id="${storeid}"] .store-info`);
    if (storeInfo.style.display === 'none') {
        storeInfo.style.display = 'block';
    } else {
        storeInfo.style.display = 'none';
    }

}

function editStore(storeid) {
    const store = storesData.find(store => store.id === storeid);
    console.log(store)
    if (store) {
        document.getElementById('editStoreId').value = storeid;
        document.getElementById('editStoreName').value = store.name;
        document.getElementById('editStoreUrl').value = store.url;
        document.getElementById('editStoreDistrict').value = store.district;
        document.getElementById('editStoreDescription').value = store.description;
        document.getElementById('editStoreContainer').classList.add('open');
    }
}

async function submitEditForm(event) {
    event.preventDefault();
    const storeId = document.getElementById('editStoreId').value;
    const name = document.getElementById('editStoreName').value;
    const url = document.getElementById('editStoreUrl').value;
    const district = document.getElementById('editStoreDistrict').value;
    const description = document.getElementById('editStoreDescription').value;
    await editStoreDetails(storeId, name, url, district, description);
};

async function editStoreDetails(storeid, name, url, district, description) {
    console.log("Store ID:", storeid);
    console.log("Name:", name);
    console.log("URL:", url);
    console.log("District:", district);
    console.log("Description:", description);
    try {
        const response = await fetch(`http://localhost:3000/store?storeid=${storeid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({storeid, name, url, district, description })
        });
        if (response.ok) {
            console.log('Store details updated successfully');
            fetchStores();
            document.getElementById('editStoreContainer').classList.remove('open');
        } else {
            console.error('Failed to update store details');
        }
    } catch (error) {
        console.error('Error updating store details:', error);
    }
}

function deleteStore(storeid) {
    fetch(`http://localhost:3000/store?storeid=${storeid}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('Store deleted successfully');
            fetchStores(); 
        } else {
            console.error('Failed to delete store');
        }
    })
    .catch(error => {
        console.error('Error deleting store:', error);
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
    const description = document.getElementById('storeDescription').value;

    fetch("http://localhost:3000/store", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, url, district, description })
    })
    .then(response => {
        if (response.ok) {
            console.log('New store added successfully');
            document.getElementById('storeName').value = '';
            document.getElementById('storeUrl').value = '';
            document.getElementById('storeDistrict').value = '';
            document.getElementById('storeDescription').value = '';
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
    document.getElementById('editStoreForm').addEventListener('submit', submitEditForm);

    toggleFormButton.addEventListener('click', () => {
        addStoreFormContainer.classList.toggle('open');
        if (addStoreFormContainer.classList.contains('open')) {
            toggleFormButton.textContent = 'Close Form';
        } else {
            toggleFormButton.textContent = 'Add a New Store';
        }
    });
});
