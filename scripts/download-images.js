import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the images directory if it doesn't exist
const imageDir = path.join(__dirname, '../public/images/collegetips');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Image URLs to download
const images = [
  {
    url: 'https://collegetips.in/wp-content/uploads/2024/03/collegetips-team.jpg',
    filename: 'collegetips-team.jpg'
  },
  {
    url: 'https://collegetips.in/wp-content/uploads/2024/03/collegetips-mentorship.jpg',
    filename: 'collegetips-mentorship.jpg'
  },
  {
    url: 'https://collegetips.in/wp-content/uploads/2024/03/collegetips-workshop.jpg',
    filename: 'collegetips-workshop.jpg'
  },
  {
    url: 'https://collegetips.in/wp-content/uploads/2024/03/collegetips-event.jpg',
    filename: 'collegetips-event.jpg'
  },
  {
    url: 'https://collegetips.in/wp-content/uploads/2024/03/collegetips-campaign.jpg',
    filename: 'collegetips-campaign.jpg'
  },
  {
    url: 'https://collegetips.in/wp-content/uploads/2024/03/collegetips-community.jpg',
    filename: 'collegetips-community.jpg'
  },
  {
    url: 'https://www.instagram.com/p/CN-aBDqpIb7/media/?size=l',
    filename: 'collegetips-instagram-1.jpg'
  }
];

// Function to download an image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(imageDir, filename);
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file if there's an error
      reject(err);
    });
  });
}

// Download all images
async function downloadAllImages() {
  console.log('Starting image downloads...');
  
  for (const image of images) {
    try {
      await downloadImage(image.url, image.filename);
    } catch (error) {
      console.error(`Error downloading ${image.filename}:`, error.message);
    }
  }
  
  console.log('Download process completed!');
}

downloadAllImages(); 