module.exports = function () {
    String.prototype.format = function() {
        var args = Array.prototype.slice.call(arguments);
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match;
        });
    };

    HTMLElement.prototype.__removeChild = HTMLElement.prototype.removeChild;
    HTMLElement.prototype.removeChild = function(...args) {
        try {
            this.__removeChild(...args);
        } catch (e) {
            console.log("Error removing children: " + e);
        }
    }   

    Node.prototype.__removeChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function(...args) {
        try {
            this.__removeChild(...args);
        } catch (e) {
            console.log("Error removing children: " + e);
        }
    }

}