const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\NIVETHA\\.gemini\\antigravity-ide\\brain\\ddc7fb9e-d95f-406b-9fe7-8086703b3f39';
const destBaseDir = 'd:\\new resert\\assets\\images';

const mappings = {
  // Branding
  'wave_zen_logo_1781178306901.png': ['logo.png'],
  'wave_zen_favicon_1781178330057.png': ['favicon.png'],

  // Banners
  'home_hero_1781178348291.png': ['banners/home_hero.png', 'gallery/grid_4.png'],
  'home2_hero_1781178370007.png': ['banners/home2_hero.png', 'gallery/grid_7.png'],
  'about_hero_1781178386591.png': ['banners/about_hero.png', 'packages/beach_yoga.png', 'gallery/featured_yoga.png', 'gallery/grid_2.png'],
  'instructors_hero_1781178407016.png': ['banners/instructors_hero.png', 'instructors/marcus.png', 'gallery/featured_surf.png', 'gallery/grid_8.png'],
  'tides_hero_1781178426068.png': ['banners/tides_hero.png', 'packages/junior_surf.png', 'gallery/grid_9.png'],
  'packages_hero_1781178447947.png': ['banners/packages_hero.png', 'packages/intermediate_surf.png', 'gallery/grid_5.png'],
  'gallery_hero_1781178471065.png': ['banners/gallery_hero.png', 'gallery/grid_1.png'],
  'booking_hero_1781178495849.png': ['banners/booking_hero.png', 'packages/full_retreat.jpg', 'packages/full_retreat.png', 'gallery/grid_3.png'],
  'contact_hero_1781178540367.png': ['banners/contact_hero.png', 'packages/corporate_surf.png', 'gallery/featured_retreat.png', 'gallery/grid_6.png'],

  // CTAs
  'home_cta_1781178557217.png': ['cta/home_cta.png', 'cta/booking_cta.png', 'auth/login.png', 'instructors/elena.png', 'instructors/priya_testimonial.png'],
  'home2_cta_1781178575314.png': ['cta/home2_cta.png', 'cta/gallery_cta.png', 'instructors/kai.png', 'instructors/sarah_testimonial.png'],
  'about_cta_1781178599453.png': ['cta/about_cta.png', 'packages/beginner_surf.png', 'instructors/amara.png', 'instructors/james_testimonial.png'],
  'instructors_cta_1781178616285.png': ['cta/instructors_cta.png'],
  'tides_cta_1781178639621.png': ['cta/tides_cta.png', 'cta/contact_cta.png'],
  'packages_cta_1781178661424.png': ['cta/packages_cta.png', 'auth/register.png']
};

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Ensure subfolders
ensureDir(destBaseDir);
ensureDir(path.join(destBaseDir, 'banners'));
ensureDir(path.join(destBaseDir, 'cta'));
ensureDir(path.join(destBaseDir, 'gallery'));
ensureDir(path.join(destBaseDir, 'instructors'));
ensureDir(path.join(destBaseDir, 'packages'));
ensureDir(path.join(destBaseDir, 'auth'));

// Copy files
Object.entries(mappings).forEach(([srcFile, destFiles]) => {
  const srcPath = path.join(srcDir, srcFile);
  if (!fs.existsSync(srcPath)) {
    console.error(`Source file not found: ${srcPath}`);
    return;
  }
  
  destFiles.forEach(destRelPath => {
    const destPath = path.join(destBaseDir, destRelPath);
    ensureDir(path.dirname(destPath));
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${srcFile} -> ${destRelPath}`);
  });
});

console.log('Asset localization structure setup complete!');
