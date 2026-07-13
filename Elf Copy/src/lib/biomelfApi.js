const SPACE_URL = 'https://sunwind19-biomelf.hf.space';

/**
 * Upload a File/Blob to the Gradio space's file server.
 * Returns the server-side path string.
 */
async function uploadToGradio(file) {
  const formData = new FormData();
  formData.append('files', file, file.name || 'image.jpg');
  const res = await fetch(`${SPACE_URL}/gradio_api/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(`Upload failed (${res.status})`);
  const paths = await res.json();
  if (!Array.isArray(paths) || !paths[0]) throw new Error('Upload returned no path');
  return paths[0];
}

function makeFileData(filePath, fileName) {
  return {
    path: filePath,
    url: `${SPACE_URL}/file=${filePath}`,
    orig_name: fileName,
    mime_type: 'image/jpeg',
    is_stream: false,
    meta: { _type: 'gradio.FileData' },
  };
}

/**
 * Call a Gradio endpoint via the raw HTTP API.
 * endpoint: e.g. "reporter_analyze"
 * data: array of input values
 * Returns the parsed data array from the "complete" SSE event.
 */
async function callGradio(endpoint, data) {
  // Step 1: initiate the call
  const initRes = await fetch(`${SPACE_URL}/gradio_api/call/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });
  if (!initRes.ok) throw new Error(`Gradio init failed (${initRes.status})`);
  const { event_id } = await initRes.json();
  if (!event_id) throw new Error('Gradio returned no event_id');

  // Step 2: read the SSE result stream
  const resultRes = await fetch(`${SPACE_URL}/gradio_api/call/${endpoint}/${event_id}`, {
    headers: { Accept: 'text/event-stream' },
  });
  const resultText = await resultRes.text();

  // Parse SSE — find the "complete" event
  const lines = resultText.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === 'event: complete') {
      const dataLine = lines[i + 1] || '';
      if (dataLine.startsWith('data: ')) {
        return JSON.parse(dataLine.slice(6));
      }
    }
    if (lines[i].trim() === 'event: error') {
      throw new Error('Gradio returned an error event');
    }
  }
  throw new Error('Gradio response had no complete event');
}

/**
 * Reporter: analyze a trash photo.
 * Returns { total_weight_kg, seeds_potential, f, ba, sa, hazard_score, raw_counts }
 */
export async function reporterAnalyze(imageFile) {
  const filePath = await uploadToGradio(imageFile);
  const result = await callGradio('reporter_analyze', [
    makeFileData(filePath, imageFile.name || 'image.jpg'),
  ]);
  return Array.isArray(result) ? result[0] : result;
}

/**
 * Volunteer: verify cleanup photo against original counts.
 * Returns merged result object with weight, messages, earned seeds, etc.
 */
export async function volunteerVerify(imageFile, beforeCountsJson) {
  const filePath = await uploadToGradio(imageFile);
  const result = await callGradio('volunteer_verify', [
    makeFileData(filePath, imageFile.name || 'image.jpg'),
    beforeCountsJson,
  ]);
  if (!Array.isArray(result)) return result;
  const merged = {};
  result.forEach(item => {
    if (item && typeof item === 'object' && !Array.isArray(item)) Object.assign(merged, item);
  });
  return Object.keys(merged).length > 0 ? merged : result[0];
}