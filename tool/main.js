const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const TurndownService = require('@joplin/turndown');
const { gfm } = require('@joplin/turndown-plugin-gfm');
const crypto = require('crypto'); // For generating unique image names
const { Buffer } = require('buffer');

// Helper function to save Base64 images to disk with unique filenames
function saveBase64Image(base64Data, outputDir) {
  const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) {
    console.error('Invalid Base64 data:', base64Data);
    return null;
  }

  const ext = matches[1]; // Get file extension (e.g., png, jpg)
  const imageBuffer = Buffer.from(matches[2], 'base64'); // Decode base64 data

  // Generate a unique file name using hash to avoid duplicate names
  const hash = crypto.createHash('md5').update(base64Data).digest('hex');
  const imageFileName = `image_${hash}.${ext}`;
  const imageFilePath = path.join(outputDir, imageFileName);

  try {
    fs.writeFileSync(imageFilePath, imageBuffer);
    console.log(`Image saved: ${imageFilePath}`);
    return imageFileName;
  } catch (error) {
    console.error(`Error writing image to file: ${error.message}`);
    return null;
  }
}

// Function to convert a single .docx file to markdown and output HTML for checking
async function convertDocxToMarkdownAndHtml(docxFilePath, outputDir) {
  try {
    const imageDir = path.join(outputDir, 'images');
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }

    // Convert .docx to HTML using mammoth
    const result = await mammoth.convertToHtml({ path: docxFilePath });
    let html = result.value;

    // Find and replace base64 images with file paths
    html = html.replace(/<img src="data:image\/(png|jpeg|jpg);base64,([^"]+)"/g, (match, mimeType, base64Data) => {
      const fullBase64Data = `data:image/${mimeType};base64,${base64Data}`;
      const imageFileName = saveBase64Image(fullBase64Data, imageDir);
      if (imageFileName) {
        return `<img src="images/${imageFileName}" />`; // Replace with file path
      }
      return match; // If something went wrong, leave the original img tag unchanged
    });

    // Save the modified HTML content for checking
    const htmlFilePath = path.join(outputDir, 'output.html');
    fs.writeFileSync(htmlFilePath, html);
    console.log(`HTML file created at: ${htmlFilePath}`);

    // Initialize Turndown and use the @joplin/turndown-plugin-gfm for handling tables and strikethrough
    const turndownService = new TurndownService();
    turndownService.use(gfm);

    // Convert HTML to Markdown
    const markdown = turndownService.turndown(html);

    // Save the Markdown content
    const markdownFilePath = path.join(outputDir, 'output.md');
    fs.writeFileSync(markdownFilePath, markdown);
    console.log(`Markdown file created at: ${markdownFilePath}`);

  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

// Function to traverse the input directory and convert all .docx files
async function processAllDocxFiles(inputDir, outputBaseDir) {
  const files = fs.readdirSync(inputDir);

  for (const file of files) {
    const filePath = path.join(inputDir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isFile() && path.extname(file) === '.docx') {
      const fileNameWithoutExt = path.basename(file, '.docx');
      const outputDir = path.join(outputBaseDir, fileNameWithoutExt);

      // Create the output directory for this file
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      console.log(`Processing: ${file}`);
      await convertDocxToMarkdownAndHtml(filePath, outputDir);
    }
  }
}

// Example usage
const inputDir = 'input'; // The input directory where .docx files are located
const outputBaseDir = 'output'; // The base output directory for converted files

processAllDocxFiles(inputDir, outputBaseDir);
