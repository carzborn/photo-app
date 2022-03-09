/**
 * User model
 */

 module.exports = (bookshelf) => {
	return bookshelf.model('user', {
		tableName: 'users',
		albums(){
			return this.hasMany('photo')
		}
	});
};