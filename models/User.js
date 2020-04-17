//Model for User
class User {
    constructor(userID, firstName, lastName, emailID,password) {
        this._userID = userID;
        this.firstName = firstName;
        this._lastName = lastName;
        this._emailID = emailID;
        this.password = password;
    }
    /**
     *
     * Getter and Setters
     */
    get userID() {
        return this._userID;
    }
    set userID(value) {
        this._userID = value;
    }
    
    get firstName() {
        return this._firstName;
    }
    set firstName(value) {
        this._firstName = value;
    }
    
    get lastName() {
        return this._lastName;
    }
    set lastName(value) {
        this._lastName = value;
    }
    
    get emailID() {
        return this._emailID;
    }
    set emailID(value) {
        this._emailID = value;
    }

    get password() {
        return this._emailID;
    }
    set password(value) {
        this._emailID = value;
    }
}
module.exports = User;