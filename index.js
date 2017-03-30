const jdenticon = require('jdenticon');
const fs = require('fs');
const svg2png = require('svg2png');
const crypto = require('crypto');
const slugify = require('slugify');
const path = require('path');
const del = require('del');
const mkdirp = require('mkdirp');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 'config', alias: 'c', type: String, defaultValue: './config.default.json' },
    { name: 'builddir', alias: 'o', type: String, defaultValue: './build' }
];
const options = commandLineArgs(optionDefinitions);
const config = JSON.parse(fs.readFileSync(options.config));


// Clear build dir
del.sync([path.join(options.builddir, '**')]);
mkdirp(options.builddir);

// Make stuff
for (let identicon of config.identicons) {
	const hexOfName = crypto.createHash('md5').update(identicon).digest('hex');
	const filename = slugify(identicon);

	console.log(`Making ${identicon} into ${path.join(options.builddir, `${filename}-*.png`)}`);

	for (let size of config.sizes){
		const svgcon = jdenticon.toSvg(hexOfName, size);
		const pngcon = svg2png.sync(svgcon);

		fs.writeFileSync(path.join(options.builddir, `${filename}-${size}.png`), pngcon);
	}
}
