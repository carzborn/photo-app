/**
 * User model
 */

 module.exports = (bookshelf) => {
	return bookshelf.model('user', {
		tableName: 'users',
		albums(){
			return this.hasMany('album');
		},
		photos(){
			return this.hasMany('photo');
		}
	},

	{
		async fetchById(id, fetchOptions = {}) {
			return await new this({ id }).fetch(fetchOptions);
		},
	});

};