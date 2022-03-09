/**
 * Photo model
 */

 module.exports = (bookshelf) => {
	return bookshelf.model('photo', {
		tableName: 'photos',
		user(){
			return this.belongsTo('user');
		},
		albums(){
			return this.belongsToMany('album');
		}
	});
};