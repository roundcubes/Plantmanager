async function fetchJSON(url, options) {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

// Load initial data
async function load() {
    await loadGroups();
    await loadPlants();
    await loadWaterings();
    await loadFertilizations();
}

async function loadGroups() {
    const groups = await fetchJSON('/api/groups');
    const list = document.getElementById('group-list');
    list.innerHTML = '';
    groups.forEach(g => {
        const li = document.createElement('li');
        li.textContent = `${g.id}: ${g.name}`;
        list.appendChild(li);
    });
}

async function addGroup() {
    const name = document.getElementById('group-name').value;
    await fetchJSON('/api/groups', { method: 'POST', body: JSON.stringify({ name }) });
    document.getElementById('group-name').value = '';
    loadGroups();
}

async function loadPlants() {
    const plants = await fetchJSON('/api/plants');
    const list = document.getElementById('plant-list');
    list.innerHTML = '';
    plants.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.id}: ${p.name} (Gruppe ${p.group_id})`; 
        list.appendChild(li);
    });
}

async function addPlant() {
    const name = document.getElementById('plant-name').value;
    const group_id = Number(document.getElementById('plant-group').value);
    const water_frequency = Number(document.getElementById('water-frequency').value);
    const fertilizer_frequency = Number(document.getElementById('fertilizer-frequency').value);
    await fetchJSON('/api/plants', { method: 'POST', body: JSON.stringify({ name, group_id, water_frequency, fertilizer_frequency }) });
    document.getElementById('plant-name').value = '';
    document.getElementById('plant-group').value = '';
    document.getElementById('water-frequency').value = '';
    document.getElementById('fertilizer-frequency').value = '';
    loadPlants();
}

async function loadWaterings() {
    const entries = await fetchJSON('/api/waterings');
    const list = document.getElementById('watering-list');
    list.innerHTML = '';
    entries.forEach(e => {
        const li = document.createElement('li');
        li.textContent = `${e.id}: Pflanze ${e.plant_id} am ${e.date}`;
        list.appendChild(li);
    });
}

async function addWatering() {
    const plant_id = Number(document.getElementById('watering-plant').value);
    const date = document.getElementById('watering-date').value;
    await fetchJSON('/api/waterings', { method: 'POST', body: JSON.stringify({ plant_id, date }) });
    document.getElementById('watering-plant').value = '';
    loadWaterings();
}

async function loadFertilizations() {
    const entries = await fetchJSON('/api/fertilizations');
    const list = document.getElementById('fertilization-list');
    list.innerHTML = '';
    entries.forEach(e => {
        const li = document.createElement('li');
        li.textContent = `${e.id}: Pflanze ${e.plant_id} am ${e.date}`;
        list.appendChild(li);
    });
}

async function addFertilization() {
    const plant_id = Number(document.getElementById('fertilization-plant').value);
    const date = document.getElementById('fertilization-date').value;
    await fetchJSON('/api/fertilizations', { method: 'POST', body: JSON.stringify({ plant_id, date }) });
    document.getElementById('fertilization-plant').value = '';
    loadFertilizations();
}

load();
