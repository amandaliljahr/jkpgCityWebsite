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

        function applyFilters() {
            const districtFilter = document.getElementById('districtFilter').value;
            const sortOrder = document.getElementById('sortOrder').value;

            let filteredStores = stores;

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
                const storeElement = document.createElement('div');

                if (store.url !== null) {
                    const storeLink = document.createElement('a');
                    storeLink.textContent = store.name;

                    if (store.url && !store.url.startsWith("http://") && !store.url.startsWith("https://")) {
                        storeLink.href = "http://" + store.url;
                    } else {
                        storeLink.href = store.url;
                    }

                    storeLink.target = "_blank";
                    storeElement.appendChild(storeLink);
                } else {
                    const storeName = document.createElement('span');
                    storeName.textContent = store.name;
                    storeElement.appendChild(storeName);
                }
                storeListContainer.appendChild(storeElement);

                storeListContainer.appendChild(document.createElement('br'));
            });
        }

        document.getElementById('districtFilter').addEventListener('change', applyFilters);
        document.getElementById('sortOrder').addEventListener('change', applyFilters);
    })
    .catch(error => {
        console.error('Error fetching stores:', error);
    });
