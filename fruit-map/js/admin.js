import { supabase } from './supabaseClient.js';
import { plantPhotoUrl } from './dataService.js';

const MONTHS =['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

// Supabase auth accounts always need an email, but this login is really
// just "one shared admin password" — this fixed address is never emailed
// anywhere, it only exists to satisfy that requirement. The real access
// control is the password itself plus this address being listed in the
// `admins` table (enforced server-side via is_admin()/RLS).
const ADMIN_LOGIN_EMAIL = 'admin@stanfordfruitmap.local';

// Client-side gate only controls what the UI shows — the database's
// is_admin()-based RLS policies (supabase/schema.sql) are the real
// enforcement, so a mismatch here can't grant extra access.
async function isAdmin(email) {
  if (!email) return false;
  const { data } = await supabase.from('admins').select('email').eq('email', email).maybeSingle();
  return !!data;
}

const LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. (Placeholder — full description coming soon!)`;
const LOREM_USAGE = `Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
      (Placeholder — usage info coming soon!)`;

let plantInfoByName = {};

// ─── Auth ───────────────────────────────────────────────────

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const passwordInput = document.getElementById('loginPassword');
  const statusEl = document.getElementById('loginStatus');
  statusEl.textContent = 'Logging in...';

  const { error } = await supabase.auth.signInWithPassword({
    email: ADMIN_LOGIN_EMAIL,
    password: passwordInput.value,
  });

  statusEl.textContent = error ? `Error: ${error.message}` : '';
  passwordInput.value = '';
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.reload();
});

document.getElementById('wrongUserLogoutBtn').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.reload();
});

supabase.auth.onAuthStateChange((_event, session) => {
  renderAuthState(session);
});

async function renderAuthState(session) {
  const loginSection = document.getElementById('loginSection');
  const dashboard = document.getElementById('dashboard');

  if (session?.user && await isAdmin(session.user.email)) {
    loginSection.style.display = 'none';
    dashboard.style.display = 'block';
    document.getElementById('loggedInAs').textContent = 'Logged in as admin';
    await loadDashboard();
  } else if (session?.user) {
    loginSection.style.display = 'flex';
    dashboard.style.display = 'none';
    document.getElementById('loginStatus').textContent =
      `Signed in as ${session.user.email}, which isn't an admin account.`;
    document.getElementById('wrongUserLogoutBtn').style.display = 'inline-block';
  } else {
    loginSection.style.display = 'flex';
    dashboard.style.display = 'none';
    document.getElementById('wrongUserLogoutBtn').style.display = 'none';
  }
}

// ─── Pending sightings ──────────────────────────────────────

async function loadDashboard() {
  await Promise.all([loadPending(), loadSpeciesEditor(), loadAdminsList(), loadEdiblePlantsEditor(), loadPhotoSubmissions()]);
}

async function loadPending() {
  const list = document.getElementById('pendingList');
  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) {
    list.innerHTML = `<p class="empty-state">Error loading submissions: ${error.message}</p>`;
    return;
  }

  if (!data.length) {
    list.innerHTML = '<p class="empty-state">No pending submissions.</p>';
    return;
  }

  list.innerHTML = '';
  data.forEach(plant => {
    const item = document.createElement('div');
    item.className = 'pending-item';
    const photoUrl = plantPhotoUrl(plant.photo_path);
    const mapLink = `https://www.google.com/maps?q=${plant.lat},${plant.lng}`;

    item.innerHTML = `
      <strong>${plant.common_name}</strong><br>
      <a href="${mapLink}" target="_blank" rel="noopener">${plant.lat.toFixed(5)}, ${plant.lng.toFixed(5)}</a><br>
      ${plant.submitter_note ? `<em>"${plant.submitter_note}"</em><br>` : ''}
      ${photoUrl ? `<img src="${photoUrl}" alt="Submitted photo">` : ''}
      <div class="actions">
        <button class="approve-btn">Approve</button>
        <button class="reject-btn">Reject</button>
      </div>
    `;

    item.querySelector('.approve-btn').addEventListener('click', () => approvePlant(plant));
    item.querySelector('.reject-btn').addEventListener('click', () => reviewPlant(plant.id, 'rejected'));

    list.appendChild(item);
  });
}

async function approvePlant(plant) {
  // If this is a brand-new species, create a placeholder info entry so the
  // site doesn't break — it can be filled in properly below.
  if (!plantInfoByName[plant.common_name]) {
    const { error: infoError } = await supabase.from('plant_info').insert({
      common_name: plant.common_name,
      icon_key: null,
      image: null,
      ripening: 'TBD',
      months: [],
      description: LOREM,
      usage: LOREM_USAGE,
    });
    if (infoError && infoError.code !== '23505') {
      alert(`Could not create species info: ${infoError.message}`);
      return;
    }
  }

  await reviewPlant(plant.id, 'approved');
}

async function reviewPlant(id, status) {
  const { error } = await supabase
    .from('plants')
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    alert(`Error: ${error.message}`);
    return;
  }
  await loadDashboard();
}

// ─── Species info editor ────────────────────────────────────

async function loadSpeciesEditor(selectName) {
  const { data, error } = await supabase
    .from('plant_info')
    .select('*, plant_photos(id, photo_path, sort_order)')
    .order('common_name');
  if (error) return;

  plantInfoByName = {};
  data.forEach(row => {
    row.plant_photos = [...(row.plant_photos || [])].sort((a, b) => a.sort_order - b.sort_order);
    plantInfoByName[row.common_name] = row;
  });

  const select = document.getElementById('speciesSelect');
  select.innerHTML = data.map(row => `<option value="${row.common_name}">${row.common_name}</option>`).join('');

  const monthsContainer = document.getElementById('monthsCheckboxes');
  if (!monthsContainer.children.length) {
    monthsContainer.innerHTML = MONTHS.map(m =>
      `<label><input type="checkbox" name="month" value="${m}"> ${m}</label>`
    ).join('');
  }

  const targetName = selectName && plantInfoByName[selectName] ? selectName : (data.length ? data[0].common_name : null);
  if (targetName) {
    select.value = targetName;
    populateSpeciesForm(targetName);
  }

  select.onchange = () => populateSpeciesForm(select.value);
}

function populateSpeciesForm(commonName) {
  const info = plantInfoByName[commonName];
  if (!info) return;

  document.getElementById('speciesIconKey').value = info.icon_key || '';
  document.getElementById('speciesScientificName').value = info.scientific_name || '';
  document.getElementById('speciesImage').value = info.image || '';
  document.getElementById('speciesRipening').value = info.ripening || '';
  document.getElementById('speciesDescription').value = (info.description || '').trim();
  document.getElementById('speciesUsage').value = (info.usage || '').trim();

  document.querySelectorAll('input[name="month"]').forEach(cb => {
    cb.checked = (info.months || []).includes(cb.value);
  });

  const photosEl = document.getElementById('speciesPhotos');
  const photos = info.plant_photos || [];
  photosEl.innerHTML = photos.length
    ? photos.map(p => `
        <div class="photo-thumb">
          <img src="${plantPhotoUrl(p.photo_path)}" alt="">
          <button class="delete-photo-btn" data-photo-id="${p.id}" data-photo-path="${p.photo_path}">✕</button>
        </div>`).join('')
    : '<p class="empty-state">No extra photos yet.</p>';

  photosEl.querySelectorAll('.delete-photo-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteSpeciesPhoto(btn.dataset.photoId, btn.dataset.photoPath, commonName));
  });
}

document.getElementById('speciesPhotoUpload').addEventListener('change', async (e) => {
  const files = [...e.target.files];
  const commonName = document.getElementById('speciesSelect').value;
  if (!files.length || !commonName) return;

  const statusEl = document.getElementById('speciesStatus');
  const existing = plantInfoByName[commonName]?.plant_photos || [];
  let nextSortOrder = existing.length ? Math.max(...existing.map(p => p.sort_order)) + 1 : 0;

  for (const file of files) {
    const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
    const photoPath = `plants/${encodeURIComponent(commonName)}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from('plant-photos').upload(photoPath, file);
    if (uploadError) {
      statusEl.textContent = `Error uploading photo: ${uploadError.message}`;
      continue;
    }

    const { error: insertError } = await supabase
      .from('plant_photos')
      .insert({ common_name: commonName, photo_path: photoPath, sort_order: nextSortOrder++ });
    if (insertError) statusEl.textContent = `Error saving photo: ${insertError.message}`;
  }

  e.target.value = '';
  await loadSpeciesEditor(commonName);
});

async function deleteSpeciesPhoto(photoId, photoPath, commonName) {
  const statusEl = document.getElementById('speciesStatus');
  const { error: storageError } = await supabase.storage.from('plant-photos').remove([photoPath]);
  if (storageError) {
    statusEl.textContent = `Error deleting photo: ${storageError.message}`;
    return;
  }
  const { error } = await supabase.from('plant_photos').delete().eq('id', photoId);
  statusEl.textContent = error ? `Error: ${error.message}` : 'Photo removed.';
  if (!error) await loadSpeciesEditor(commonName);
}

document.getElementById('speciesForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const commonName = document.getElementById('speciesSelect').value;
  const statusEl = document.getElementById('speciesStatus');

  const months = [...document.querySelectorAll('input[name="month"]:checked')].map(cb => cb.value);

  const { error } = await supabase.from('plant_info').update({
    icon_key: document.getElementById('speciesIconKey').value.trim() || null,
    scientific_name: document.getElementById('speciesScientificName').value.trim() || null,
    image: document.getElementById('speciesImage').value.trim() || null,
    ripening: document.getElementById('speciesRipening').value.trim() || null,
    months,
    description: document.getElementById('speciesDescription').value.trim(),
    usage: document.getElementById('speciesUsage').value.trim(),
  }).eq('common_name', commonName);

  statusEl.textContent = error ? `Error: ${error.message}` : 'Saved!';
  if (!error) await loadSpeciesEditor(commonName);
});

// ─── Manage Admins ──────────────────────────────────────────

async function loadAdminsList() {
  const list = document.getElementById('adminsList');
  const { data, error } = await supabase.from('admins').select('*').order('created_at');

  if (error) {
    list.innerHTML = `<p class="empty-state">Error loading admins: ${error.message}</p>`;
    return;
  }

  list.innerHTML = '';
  data.forEach(admin => {
    const item = document.createElement('div');
    item.className = 'admin-list-item';
    item.innerHTML = `<span>${admin.email}</span><button class="remove-admin-btn">Remove</button>`;
    item.querySelector('.remove-admin-btn').addEventListener('click', () => removeAdmin(admin.email));
    list.appendChild(item);
  });
}

async function removeAdmin(email) {
  if (!confirm(`Remove ${email} as an admin?`)) return;
  const statusEl = document.getElementById('adminsStatus');
  const { error } = await supabase.from('admins').delete().eq('email', email);
  statusEl.textContent = error ? `Error: ${error.message}` : `Removed ${email}.`;
  if (!error) await loadAdminsList();
}

document.getElementById('addAdminForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const emailInput = document.getElementById('newAdminEmail');
  const statusEl = document.getElementById('adminsStatus');
  const email = emailInput.value.trim();

  const { data: { session } } = await supabase.auth.getSession();
  const { error } = await supabase.from('admins').insert({ email, added_by: session?.user?.email || null });

  if (error) {
    statusEl.textContent = error.code === '23505' ? `${email} is already an admin.` : `Error: ${error.message}`;
  } else {
    statusEl.textContent = `Added ${email} as an admin.`;
    emailInput.value = '';
    await loadAdminsList();
  }
});

// ─── Edible Plants (Not on Map) editor ───────────────────────

let ediblePlantsById = {};
let currentEdiblePlantId = null;

async function loadEdiblePlantsEditor(selectId) {
  const { data, error } = await supabase
    .from('edible_plants')
    .select('*, edible_plant_photos(id, photo_path, sort_order)')
    .order('common_name');
  if (error) return;

  ediblePlantsById = {};
  data.forEach(row => {
    row.edible_plant_photos = [...(row.edible_plant_photos || [])].sort((a, b) => a.sort_order - b.sort_order);
    ediblePlantsById[row.id] = row;
  });

  const select = document.getElementById('ediblePlantSelect');
  select.innerHTML =
    '<option value="__new__">+ Add new entry</option>' +
    data.map(row => `<option value="${row.id}">${row.common_name}</option>`).join('');
  select.onchange = () => populateEdiblePlantForm(select.value);

  const targetId = selectId && ediblePlantsById[selectId] ? selectId : (data.length ? data[0].id : '__new__');
  select.value = targetId;
  populateEdiblePlantForm(targetId);
}

function populateEdiblePlantForm(id) {
  currentEdiblePlantId = id === '__new__' ? null : id;
  const info = currentEdiblePlantId ? ediblePlantsById[currentEdiblePlantId] : null;

  document.getElementById('ediblePlantCommonName').value = info?.common_name || '';
  document.getElementById('ediblePlantScientificName').value = info?.scientific_name || '';
  document.getElementById('ediblePlantLocationNotes').value = info?.location_notes || '';
  document.getElementById('ediblePlantUsage').value = info?.usage || '';

  const photosEl = document.getElementById('ediblePlantPhotos');
  const photos = info?.edible_plant_photos || [];
  photosEl.innerHTML = photos.length
    ? photos.map(p => `
        <div class="photo-thumb">
          <img src="${plantPhotoUrl(p.photo_path)}" alt="">
          <button class="delete-photo-btn" data-photo-id="${p.id}" data-photo-path="${p.photo_path}">✕</button>
        </div>`).join('')
    : '<p class="empty-state">No photos yet.</p>';

  photosEl.querySelectorAll('.delete-photo-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteEdiblePlantPhoto(btn.dataset.photoId, btn.dataset.photoPath));
  });

  const uploadInput = document.getElementById('ediblePlantPhotoUpload');
  uploadInput.disabled = !currentEdiblePlantId;
  uploadInput.title = currentEdiblePlantId ? '' : 'Save the entry first, then add photos.';
}

document.getElementById('ediblePlantForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const statusEl = document.getElementById('ediblePlantStatus');

  const fields = {
    common_name: document.getElementById('ediblePlantCommonName').value.trim(),
    scientific_name: document.getElementById('ediblePlantScientificName').value.trim() || null,
    location_notes: document.getElementById('ediblePlantLocationNotes').value.trim() || null,
    usage: document.getElementById('ediblePlantUsage').value.trim() || null,
  };

  if (!fields.common_name) {
    statusEl.textContent = 'Common name is required.';
    return;
  }

  let error;
  if (currentEdiblePlantId) {
    ({ error } = await supabase
      .from('edible_plants')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', currentEdiblePlantId));
  } else {
    const { data, error: insertError } = await supabase.from('edible_plants').insert(fields).select().single();
    error = insertError;
    if (!error) currentEdiblePlantId = data.id;
  }

  statusEl.textContent = error ? `Error: ${error.message}` : 'Saved!';
  if (!error) await loadEdiblePlantsEditor(currentEdiblePlantId);
});

document.getElementById('ediblePlantPhotoUpload').addEventListener('change', async (e) => {
  const files = [...e.target.files];
  if (!files.length || !currentEdiblePlantId) return;

  const statusEl = document.getElementById('ediblePlantStatus');
  const existing = ediblePlantsById[currentEdiblePlantId]?.edible_plant_photos || [];
  let nextSortOrder = existing.length ? Math.max(...existing.map(p => p.sort_order)) + 1 : 0;

  for (const file of files) {
    const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
    const photoPath = `edible-plants/${currentEdiblePlantId}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from('plant-photos').upload(photoPath, file);
    if (uploadError) {
      statusEl.textContent = `Error uploading photo: ${uploadError.message}`;
      continue;
    }

    const { error: insertError } = await supabase
      .from('edible_plant_photos')
      .insert({ edible_plant_id: currentEdiblePlantId, photo_path: photoPath, sort_order: nextSortOrder++ });
    if (insertError) statusEl.textContent = `Error saving photo: ${insertError.message}`;
  }

  e.target.value = '';
  await loadEdiblePlantsEditor(currentEdiblePlantId);
});

async function deleteEdiblePlantPhoto(photoId, photoPath) {
  const statusEl = document.getElementById('ediblePlantStatus');
  const { error: storageError } = await supabase.storage.from('plant-photos').remove([photoPath]);
  if (storageError) {
    statusEl.textContent = `Error deleting photo: ${storageError.message}`;
    return;
  }
  const { error } = await supabase.from('edible_plant_photos').delete().eq('id', photoId);
  statusEl.textContent = error ? `Error: ${error.message}` : 'Photo removed.';
  if (!error) await loadEdiblePlantsEditor(currentEdiblePlantId);
}

// ─── Photo Submissions ────────────────────────────────────────
// Visitor-submitted photos, pending review. Approving an "ID Photo" files
// it into plant_photos or edible_plant_photos so it shows up publicly;
// "Fun Photo" submissions are just marked approved/rejected — there's no
// public community-photo display yet.

async function loadPhotoSubmissions() {
  const list = document.getElementById('photoSubmissionsList');
  const { data, error } = await supabase
    .from('photo_submissions')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) {
    list.innerHTML = `<p class="empty-state">Error loading submissions: ${error.message}</p>`;
    return;
  }

  if (!data.length) {
    list.innerHTML = '<p class="empty-state">No pending photo submissions.</p>';
    return;
  }

  const edibleIds = [...new Set(data.filter(s => s.target_type === 'edible_plant').map(s => s.target_id))];
  let edibleNameById = {};
  if (edibleIds.length) {
    const { data: edibleRows } = await supabase.from('edible_plants').select('id, common_name').in('id', edibleIds);
    (edibleRows || []).forEach(row => { edibleNameById[row.id] = row.common_name; });
  }

  list.innerHTML = '';
  data.forEach(sub => {
    const item = document.createElement('div');
    item.className = 'pending-item';
    const photoUrl = plantPhotoUrl(sub.photo_path);
    const kindLabel = sub.kind === 'id_photo' ? 'ID Photo' : 'Fun Photo';
    const targetLabel = sub.target_type === 'plant_info'
      ? sub.target_id
      : sub.target_type === 'edible_plant'
        ? (edibleNameById[sub.target_id] || 'Edible plant')
        : 'Community Finds';

    item.innerHTML = `
      <strong>${kindLabel} — ${targetLabel}</strong><br>
      ${sub.photographer_name ? `By ${sub.photographer_name}<br>` : ''}
      ${sub.submitter_note ? `<em>"${sub.submitter_note}"</em><br>` : ''}
      ${photoUrl ? `<img src="${photoUrl}" alt="Submitted photo">` : ''}
      <div class="actions">
        <button class="approve-btn">Approve</button>
        <button class="reject-btn">Reject</button>
      </div>
    `;

    item.querySelector('.approve-btn').addEventListener('click', () => approvePhotoSubmission(sub));
    item.querySelector('.reject-btn').addEventListener('click', () => reviewPhotoSubmission(sub.id, 'rejected'));

    list.appendChild(item);
  });
}

async function approvePhotoSubmission(sub) {
  const statusEl = document.getElementById('photoSubmissionsStatus');

  if (sub.kind === 'id_photo' && sub.target_type === 'plant_info' && sub.target_id) {
    const existing = plantInfoByName[sub.target_id]?.plant_photos || [];
    const nextSortOrder = existing.length ? Math.max(...existing.map(p => p.sort_order)) + 1 : 0;
    const { error } = await supabase
      .from('plant_photos')
      .insert({ common_name: sub.target_id, photo_path: sub.photo_path, sort_order: nextSortOrder });
    if (error) {
      statusEl.textContent = `Error filing photo: ${error.message}`;
      return;
    }
  } else if (sub.kind === 'id_photo' && sub.target_type === 'edible_plant' && sub.target_id) {
    const { data: existingPhotos } = await supabase
      .from('edible_plant_photos')
      .select('sort_order')
      .eq('edible_plant_id', sub.target_id);
    const nextSortOrder = existingPhotos?.length ? Math.max(...existingPhotos.map(p => p.sort_order)) + 1 : 0;
    const { error } = await supabase
      .from('edible_plant_photos')
      .insert({ edible_plant_id: sub.target_id, photo_path: sub.photo_path, sort_order: nextSortOrder });
    if (error) {
      statusEl.textContent = `Error filing photo: ${error.message}`;
      return;
    }
  }

  await reviewPhotoSubmission(sub.id, 'approved');
}

async function reviewPhotoSubmission(id, status) {
  const statusEl = document.getElementById('photoSubmissionsStatus');
  const { error } = await supabase
    .from('photo_submissions')
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    statusEl.textContent = `Error: ${error.message}`;
    return;
  }
  statusEl.textContent = '';
  await loadDashboard();
}

// ─── Bootstrap ──────────────────────────────────────────────
supabase.auth.getSession().then(({ data: { session } }) => renderAuthState(session));
