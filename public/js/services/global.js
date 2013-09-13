angular.module('mean.system').factory("Global", [function() {
    var _this = this;
    
    
    // Until the header gets my user (findMe)
    _this._data = {
        user:  null,
        authenticated: false
    };
    

    
    
    return _this._data;
}]);