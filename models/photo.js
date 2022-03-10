module.exports = (bookshelf) => {
    return bookshelf.model('photo', {
        tableName: 'photos',
        users() {
            return this.belongsTo('user');
        }, 
        tableName: 'photos',
        albums() {
            return this.belongsToMany('album');
        },
    }, {
        async fetchById(id, fetchOptions = {}) {
            return await new this({ id }).fetch(fetchOptions);
        }
    }, 
    );
};