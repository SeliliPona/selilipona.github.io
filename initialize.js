// thank you Gemini :3

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
console.log('Archiver type:', typeof archiver);
console.log('Archiver content:', archiver);
const music_metadata = require('music-metadata');

const argv = process.argv;
console.log('argv:', argv)

async function initialize(message) {
    const clPath = './changelog/content.json';
    const content = JSON.parse(fs.readFileSync('./work/content.json', 'utf8'));
    const baseDir = './assets/audio';
    const sourceDir = './assets/source';
    const fileMeta = {}


    for (const album of content.albums) {
        const albumPath = path.join(baseDir, album.path);
        const outputPath = path.join(albumPath, `${album.title.replace(/\s+/g, '_')}.zip`);
        const albumFormats = {};

        fileMeta[album.path] = {};

        console.log(`Creating ZIP for: ${album.title}...`);

        const output = fs.createWriteStream(outputPath);
        const archive = archiver('zip', { zlib: { level: 0 } });

        archive.pipe(output);

        album.songs.forEach((song, idx) => {
            const name = song.files[0][0];
            const filePath = path.join(albumPath, name);
            const songFormats = {};
            if (fs.existsSync(filePath)) {
                archive.file(filePath, { name: getFilename(song, idx + 1, album) });

                const extension = filePath.slice(filePath.lastIndexOf('.') + 1).toUpperCase();
                if (!(extension in albumFormats)) albumFormats[extension] = 0;
                albumFormats[extension] += 1;

                if (song.source) {
                    if (song.source.length > 1) {
                        const zipFileName = name.slice(0, name.lastIndexOf('.')) + '.zip';
                        const sourceZipPath = path.join(sourceDir, zipFileName);

                        console.log(`making source zip for ${name}: ${sourceZipPath}`);
                        const sourceOutput = fs.createWriteStream(sourceZipPath);
                        const sourceArchive = archiver('zip', { zlib: { level: 0 } });

                        // error handling for the stream
                        sourceOutput.on('error', (err) => console.error("Stream Error:", err));
                        sourceArchive.on('error', (err) => { throw err; });
                        sourceArchive.on('finish', () => {
                            let formatString = [];
                            Object.keys(songFormats).sort().forEach(format => {
                                formatString.push(`${songFormats[format]}x ${format}`);
                            })
                            const sourceStats = fs.statSync(sourceZipPath);
                            fileMeta[album.path][`/${sourceZipPath}`] = {
                                size: sourceStats.size,
                                mtime: sourceStats.mtime,
                                format: `ZIP (${formatString.join(", ")})`
                            };
                        })

                        sourceArchive.pipe(sourceOutput);

                        song.source.forEach(file => {
                            const extension = file.slice(file.lastIndexOf('.') + 1).toUpperCase();
                            if (!(extension in songFormats)) songFormats[extension] = 0;
                            songFormats[extension] += 1;

                            const individualFilePath = path.join(sourceDir, file);
                            if (fs.existsSync(individualFilePath)) {
                                sourceArchive.file(individualFilePath, { name: file });
                            } else {
                                console.warn(`Warning: Source file not found: ${individualFilePath}`);
                            }
                        });

                        sourceArchive.finalize();
                        console.log("filled zip")
                    } else {
                        const sourcePath = `/assets/source/${song.source[0]}`
                        const sourceStats = fs.statSync('.' + sourcePath);
                        fileMeta[album.path][sourcePath] = {
                            size: sourceStats.size,
                            mtime: sourceStats.mtime
                        };
                    }
                } else {
                    console.log(`song has no source: ${path.join(baseDir, album.path, name)}`)
                }
                const stats = fs.statSync(path.join(baseDir, album.path, name));
                fileMeta[album.path][name] = {
                    size: stats.size,
                    mtime: stats.mtime
                };
                // get file duration
                // modified from music-metadata's README
                (async () => {
                    try {
                        const metadata = await music_metadata.parseFile(filePath, { duration: true });

                        fileMeta[album.path][name].duration = metadata.format.duration
                    } catch (error) {
                        console.error('Error parsing metadata:', error.message);
                    }
                })();
            }
        });

        await archive.finalize();

        const albumStats = fs.statSync(outputPath);
        let formatString = [];
        Object.keys(albumFormats).sort().forEach(format => {
            formatString.push(`${albumFormats[format]}x ${format}`);
        })
        fileMeta[album.path]['/' + outputPath] = {
            size: albumStats.size,
            mtime: albumStats.mtime,
            format: `ZIP (${formatString.join(", ")})`
        }

        console.log('Finished creating ZIPs')
    }
    fs.writeFileSync(`${baseDir}/stats.json`, JSON.stringify(fileMeta, null, 4));

    // append to changelog
    const commit = {
        title: message.shift()
    };
    var section = [];
    var sectionName = '';

    message[0] = "# desc";
    message.push('#');

    message.join("\n").split(/#\s*/).forEach(sect => {
        sect = sect.split("\n");
        if (section.length > 0) {
            commit[sectionName] = section
        };

        sectionName = sect.shift();
        section = [];
        const groups = [section];
        let group = section;
        let levels = 0;
        sect.forEach(line => {
            if (line.length === 0) return;

            const level = /^\t*/.exec(line)[0].length;
            if (level > levels) {
                group = [];
                groups.push(group);
            } else if (level < levels) {
                group = groups[level];
                group.push(groups.pop());
            }
            levels = level;

            group.push(line.slice(levels));
        })
    });

    const changelog = JSON.parse(fs.readFileSync(clPath, 'utf8'));
    commit.timestamp = (new Date()).toISOString();
    changelog.push(commit);
    fs.writeFileSync(clPath, JSON.stringify(changelog, null, 4));
}

/*
    determine filename to use for a song
    song: entry in album.songs
    idx: song's position in album
    album: the album the song is part of
*/
function getFilename(song, idx, album) {
    var file = "";
    let count = (album.count || album.songs.length).toString();
    const i = idx.toString();
    if (count.length > i.length) {
        file = "0".repeat(count.length - i.length);
    }
    file += i + " " + ((song.title_tl && song.title_tl[0]) || song.title || song.files[0][0])
    file += song.files[0][0].slice(song.files[0][0].lastIndexOf('.'));

    return file;
}
argv.shift(); argv.shift();
initialize(argv.join(" ").split("\n"));