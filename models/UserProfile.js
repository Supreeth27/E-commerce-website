//Model for UserProfile
class UserProfile{
  constructor(userId){
    this.userId= userId;
    this.userItems=[];
  }
  //function for adding item to user profile
  addItem(userItem){
    flag = 0;
    if(this.userItems.includes(userItem));
      flag = 1;
    if(!flag){
      this.userItems.push(userItem);
    }
    return this.userItems;
  }
  //function for removing item in user profile
  removeItem(item){
    for(i = 0 ; i < this.userItems.length; i++){
      if(this.userItems[i].itemCode == item.itemCode){
        this.userItems.splice(i, 1);
      }
    }
  }
  //function for updating item in user profile
  updateItem(userItem){
    for (i=0;i<this.userItems.length;i++){
      if(this.userItems[i].item.itemCode == userItem.item.itemCode){
        this.userItems[i].rating = userItem.rating;
        this.userItems[i].yourItem = userItem.yourItem;
        return 'the following'+ userItem.item +' is updated';
      }
    }
  }
  //function for retrieving all items in user profile
  getItems(){
      return this.userItems;
  }
  //function for deleting data in user profile
  emptyProfile(){
    delete this.UserId;
    delete this.UserItems;
  }
}
  
module.exports=UserProfile;
  