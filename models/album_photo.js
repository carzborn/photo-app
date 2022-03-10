/**
 * album_photo model 
 */

module.exports = (bookshelf) => {
	return bookshelf.model('album_photo', {
		tableName: 'albums_photos',
	});
};