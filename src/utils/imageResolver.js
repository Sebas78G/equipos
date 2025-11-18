/**
 * Resolves the equipment model name to a public image path.
 * NOTE: This requires the 'img' folder to be inside the 'public' folder.
 * @param {string} referencia_cpu - The model name from the database (e.g., "OptiPlex 3080").
 * @returns {string|null} The public path to the image or null if not found.
 */
const resolveEquipmentImage = (referencia_cpu) => {
  if (!referencia_cpu) {
    return null; // No model name provided.
  }

  const model = referencia_cpu.toLowerCase();

  // Add mappings from model names to image filenames here.
  // The key should be a lowercase, easily identifiable part of the model name.
  const imageMap = {
    'optiplex 3080': 'Optiplex_3080.jpg',
    'probook': 'hp_probook.jpg',
  };

  // Find the corresponding key in our map
  const matchingKey = Object.keys(imageMap).find(key => model.includes(key));

  if (matchingKey) {
    const filename = imageMap[matchingKey];
    return `/img/${filename}`; // Construct the path relative to the public folder.
  }

  return null; // Return null if no mapping is found.
};

export default resolveEquipmentImage;
