module.exports = {
  age: function(timestamp) {
    const today = new Date();
    const birthDate = new Date(timestamp);
    const month = today.getMonth() - birthDate.getMonth();
    let age = today.getFullYear() - birthDate.getFullYear();
  
    if(month < 0 || month == 0 && today.getDate() < birthDate.getDate()) {
      age = age - 1;
    }
  
    return age;
  }
}