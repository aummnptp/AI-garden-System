import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export async function downloadImage(imageUrl: string, filename: string): Promise<string> {
  const response = await axios({
    url: imageUrl,
    method: 'GET',
    responseType: 'stream',
  });
  
  const uploadDir = path.join(process.cwd(), 'uploads', 'profiles');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const filepath = path.join(uploadDir, filename);
  const writer = fs.createWriteStream(filepath);
  response.data.pipe(writer);
  
  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(`/uploads/profiles/${filename}`));
    writer.on('error', reject);
  });
}