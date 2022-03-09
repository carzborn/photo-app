/**
 * Example model
 */

 module.exports = (bookshelf) => {
	return bookshelf.model('album', {
		tableName: 'albums',
		photos(){
			return this.hasMany('photo');
		},
		user(){
			return this.belongsTo('user');
		}
	});
};