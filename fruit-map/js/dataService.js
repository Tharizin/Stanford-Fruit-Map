import { supabase } from './supabaseClient.js';

// One row per species: icon, image, ripening window, months, description,
// usage, plus any extra admin-uploaded photos beyond the cover `image`.
export async function fetchPlantInfo() {
  let { data, error } = await supabase.from('plant_info').select('*, plant_photos(id, photo_path, credit, sort_order)');
  if (error) {
    // plant_photos won't exist until migration 004 has been run — degrade
    // to the cover-image-only view rather than taking the whole map down.
    console.warn('plant_photos join failed, falling back to plain plant_info:', error.message);
    ({ data, error } = await supabase.from('plant_info').select('*'));
  }
  if (error) throw error;

  const byName = {};
  for (const row of data) {
    row.plant_photos = [...(row.plant_photos || [])].sort((a, b) => a.sort_order - b.sort_order);
    byName[row.common_name] = row;
  }
  return byName;
}

// Individual tree locations that are live on the public map.
export async function fetchApprovedPlants() {
  const { data, error } = await supabase
    .from('plants')
    .select('id, common_name, lat, lng')
    .eq('status', 'approved');
  if (error) throw error;
  return data;
}

// Plants worth knowing about that aren't tied to a specific mapped tree
// location, each with zero or more photos.
export async function fetchEdiblePlants() {
  const { data, error } = await supabase
    .from('edible_plants')
    .select('*, edible_plant_photos(id, photo_path, credit, sort_order)')
    .order('common_name');
  if (error) throw error;
  return data.map(plant => ({
    ...plant,
    edible_plant_photos: [...(plant.edible_plant_photos || [])].sort((a, b) => a.sort_order - b.sort_order),
  }));
}

export function plantPhotoUrl(photoPath) {
  if (!photoPath) return null;
  return supabase.storage.from('plant-photos').getPublicUrl(photoPath).data.publicUrl;
}

export async function submitSighting({ commonName, lat, lng, note, photoFile }) {
  let photoPath = null;

  if (photoFile) {
    const ext = photoFile.name.includes('.') ? photoFile.name.split('.').pop() : 'jpg';
    photoPath = `submissions/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('plant-photos')
      .upload(photoPath, photoFile);
    if (uploadError) throw uploadError;
  }

  const { error } = await supabase.from('plants').insert({
    common_name: commonName,
    lat,
    lng,
    submitter_note: note || null,
    photo_path: photoPath,
  });
  if (error) throw error;
}

// A visitor-submitted photo — either an ID photo for a specific species
// (targetType/targetId set, from that plant's detail modal) or a fun photo
// for the community gallery (caption via `note`, photographerName).
// Always lands as 'pending'; an admin has to approve it before an ID photo
// is filed into plant_photos/edible_plant_photos, or a fun photo appears
// in the public gallery.
export async function submitPhoto({ kind, targetType, targetId, note, photographerName, photoFile }) {
  const ext = photoFile.name.includes('.') ? photoFile.name.split('.').pop() : 'jpg';
  const photoPath = `photo-submissions/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from('plant-photos').upload(photoPath, photoFile);
  if (uploadError) throw uploadError;

  const { error } = await supabase.from('photo_submissions').insert({
    photo_path: photoPath,
    kind,
    target_type: targetType || null,
    target_id: targetId || null,
    submitter_note: note || null,
    photographer_name: photographerName || null,
  });
  if (error) throw error;
}

// Approved community fun photos — haul shots, group photos, etc. — shown
// on the "What Other Foragers Have Found" gallery.
export async function fetchApprovedFunPhotos() {
  const { data, error } = await supabase
    .from('photo_submissions')
    .select('id, photo_path, submitter_note, photographer_name, created_at')
    .eq('kind', 'fun_photo')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
