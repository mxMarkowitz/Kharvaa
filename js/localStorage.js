function localStorage(){

	this.init = function(){
		var tempStore = this.getStore();
		if (tempStore == undefined){
			this.createLocalStore();
		} else {
			this.dataStore = tempStore;
		}
	}

	this.createLocalStore = function(){
		store.set('store', {});
	}
	this.getLocalStore = function(){
		return store.get('store');
	}
	this.destroy = function(){
		store.clear();
		dataStore = {};
	}
	this.addStoreTable = function(storeName){
		var tempStore = this.getLocalStore();
		tempStore[storeName] = {};
		this.dataStore = tempStore;
	}
	this.removeStoreTable = function(storeName){
		var tempStore = this.getLocalStore();
		delete tempStore[storeName];
		store.set('store', tempStore);
	}
}
