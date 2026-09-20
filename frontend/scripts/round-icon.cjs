const fs = require('fs');
const PNG = require('pngjs').PNG;

fs.createReadStream('assets/icon.png')
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
    const width = this.width;
    const height = this.height;
    const radius = Math.min(width, height) * 0.22; // 22% radius for squircle-like shape

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (width * y + x) << 2;
        
        // Calculate distance from corners
        let isOutside = false;
        if (x < radius && y < radius) {
            isOutside = Math.pow(radius - x, 2) + Math.pow(radius - y, 2) > radius * radius;
        } else if (x > width - radius && y < radius) {
            isOutside = Math.pow(x - (width - radius), 2) + Math.pow(radius - y, 2) > radius * radius;
        } else if (x < radius && y > height - radius) {
            isOutside = Math.pow(radius - x, 2) + Math.pow(y - (height - radius), 2) > radius * radius;
        } else if (x > width - radius && y > height - radius) {
            isOutside = Math.pow(x - (width - radius), 2) + Math.pow(y - (height - radius), 2) > radius * radius;
        }

        if (isOutside) {
            // Set alpha to 0 for pixels outside the rounded corners
            this.data[idx + 3] = 0; 
        }
      }
    }

    this.pack().pipe(fs.createWriteStream('assets/icon.png'));
    console.log('Successfully rounded corners of icon.png');
  })
  .on('error', function(err) {
    console.error('Error processing image:', err);
  });
