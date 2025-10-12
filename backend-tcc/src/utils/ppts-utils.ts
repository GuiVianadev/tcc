import Decompressor from 'decompress';

async function extractTextFromPPTX(buffer: Buffer): Promise<string> {
  const files = await Decompressor(buffer);
  
  const slideFiles = files.filter(f => 
    f.path.startsWith('ppt/slides/slide')
  );
  
  let text = '';
  for (const file of slideFiles) {
    const xml = file.data.toString();
    text += xml.replace(/<[^>]*>/g, ' ');
  }
  
  return text.replace(/\s+/g, ' ').trim();
}