const { uploadImage } = require('./_helpers');

module.exports = async function uploadAvatars () {
  let ids = Array.from({length: 70}, (_, i) => i + 1);
  await Promise.all(ids.map(async id => {
    const fileUrl = `https://i.pravatar.cc/400?img=${id}`;
    const fileName = `user-${id}`;
    const folder = '/Nextmeal/Users';
    return await uploadImage(fileUrl, fileName, folder, false);
  }));
};

