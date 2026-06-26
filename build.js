const esbuild = require('esbuild');
const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

async function ensureDir(filePath) {
    await fs.mkdirp(path.dirname(filePath));
}

async function build() {
    const out = path.resolve(__dirname, 'dist');
    await fs.remove(out);
    await fs.mkdirp(out);

    // Copy static assets (other images, fonts, etc.)
    if (await fs.pathExists(path.join(__dirname, 'assets'))) {
        await fs.copy(path.join(__dirname, 'assets'), path.join(out, 'assets'));
    }

    // Convert profile image to webp and create optimized copies
    const profileSrc = path.join(__dirname, 'assets', 'images', 'profile.jpg');
    const profileDest = path.join(out, 'assets', 'images');
    if (await fs.pathExists(profileSrc)) {
        await fs.mkdirp(profileDest);
        // small webp
        await sharp(profileSrc).resize(800).webp({ quality: 80 }).toFile(path.join(profileDest, 'profile.webp'));
        // keep original (copied)
        await fs.copyFile(profileSrc, path.join(profileDest, 'profile.jpg'));
    }

    // Build JS
    await ensureDir(path.join(out, 'assets', 'js', 'script.js'));
    await esbuild.build({
        entryPoints: [path.join('assets', 'js', 'script.js')],
        bundle: true,
        minify: true,
        sourcemap: false,
        outfile: path.join(out, 'assets', 'js', 'script.js')
    });

    // Build CSS
    await ensureDir(path.join(out, 'assets', 'css', 'style.css'));
    await esbuild.build({
        entryPoints: [path.join('assets', 'css', 'style.css')],
        bundle: true,
        minify: true,
        outfile: path.join(out, 'assets', 'css', 'style.css')
    });

    // Copy HTML
    await fs.copyFile(path.join(__dirname, 'index.html'), path.join(out, 'index.html'));

    console.log('Build complete — output in', out);
}

build().catch(err => {
    console.error(err);
    process.exit(1);
});
