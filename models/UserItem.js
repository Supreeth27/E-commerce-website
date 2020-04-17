//Model for UserItem
class UserItem {
    constructor(itemCode, itemName, categoryName, rating, yourItem) {
        this.itemCode = itemCode;
        this.itemName = itemName;
        this.categoryName = categoryName;
        this.rating = rating;
        this.yourItem = yourItem;
    }
    /**
     *
     * Getter and Setters
     */
    get itemName() {
        return this._itemName;
    }
    set itemName(value) {
        this._itemName = value;
    }

    get itemCode() {
        return this._itemCode;
    }
    set itemCode(value) {
        this._itemCode = value;
    }

    get categoryName() {
        return this._categoryName;
    }
    set categoryName(value) {
        this._categoryName = value;
    }

    get rating() {
        return this._rating;
    }
    set rating(value) {
        this._rating = value;
    }

    get yourItem() {
        return this._yourItem;
    }
    set yourItem(value) {
        this._yourItem = value;
    }
}
module.exports = UserItem;