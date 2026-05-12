async function downloadAlbum(albumPath) {
    const response = await fetch('/work/content.json');
    const data = await response.json();
    const album = data.albums.find(a => a.path === albumPath);

    if (album) {
        // The script names files like "Album_Name.zip"
        const zipName = `${album.title.replace(/\s+/g, '_')}.zip`;
        const zipPath = `/assets/audio/${album.path}/${zipName}`;
        
        // Trigger the download directly
        downloadFile(zipPath, zipName);
    }
}

async function downloadSong(song, album) {
    console.log('download requested');
    let file = `${((song.title_tl && song.title_tl[0]) || song.title).replace(/\s+/g, '_')}`;
    if (song.subtitle) {
        file += `_${((song.subtitle_tl && song.subtitle_tl[0]) || song.subtitle).replace(/\s+/g, '_')}`;
    }
    file += song.files[0][0].slice(song.files[0][0].lastIndexOf('.'));

    console.log('trying to download file:', file)

    downloadFile(`/assets/audio/${album.path}/${song.files[0][0]}`, file);
}

function downloadFile(path, name) {
    console.log('downloading file "'+path+'" with name '+name);
    const link = document.createElement('a');
    link.href = path;
    link.download = name;
    link.click();
}