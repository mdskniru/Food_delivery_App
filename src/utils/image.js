const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 2 * 1024 * 1024;

export function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Please choose an image file'));
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      reject(new Error('Only JPG, PNG or WEBP images are allowed'));
      return;
    }
    if (file.size > MAX_SIZE) {
      reject(new Error('Image must be 2MB or smaller'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read that image'));
    reader.readAsDataURL(file);
  });
}
