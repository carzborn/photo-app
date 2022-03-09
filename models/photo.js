/**
 * Photo model
 */

 module.exports = (bookshelf) => {
	return bookshelf.model('photo', {
		tableName: 'photos',
		albums(){
			return this.belongsToMany('album');
		},
		users(){
			return this.belongsTo('user');
		}
	});
};