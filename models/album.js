/**
 * Album model
 */

 module.exports = (bookshelf) => {
	return bookshelf.model('album', {
		tableName: 'albums',
		user(){
			return this.belongsTo('user');
		},
		photos(){
			return this.belongsToMany('photo');
		}
	},{
		async fetchById(id, fetchOptions = {}) {
			return await new this({ id }).fetch(fetchOptions);
		},
	});
};