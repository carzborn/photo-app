module.exports = (bookshelf) => {
	return bookshelf.model('album_photo', {
		tableName: 'albums_photos',
		// albums() {
		// 	return this.hasMany('album');
		// },
        // photos() {
        //     return this.hasMany('photo');
        // }
	});
};