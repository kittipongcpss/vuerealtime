var database = firebase.database();
var messageRef = database.ref('message');

new Vue({
  el:"#comment",
  data:{
    messageText:'',
    messages:[],
    name:'สมาชิกท่านหนึ่ง',
    editText:null
  },methods:{
    storeMessage:function(){
          messageRef.push({
          text:this.messageText,
          name:this.name
        })
        this.messageText=''
        console.log(this.messages);
    },
    deleteMessage:function(message){
        //ลบข้อมูล
        messageRef.child(message.id).remove();
    },
    editMessage:function(message){
      //แก้ไข
      this.editText = message
      this.messageText=message.text
    },
    cancelMessage:function(message){
      //ยกเลิกการแก้ไข
      this.editText = null
        this.messageText= ''
    },
    updateMessage:function(message){
      //อัพเดทที่ฐานข้อมูล
      messageRef.child(this.editText.id).update({
        text:this.messageText
      })
      this.cancelMessage()
    }
  },created(){
    //เมือมีการเพิ่มข้อมูลลงไปใน firebase จะทำคำสังหลัง ,
      messageRef.on("child_added",snapshot=>{
        //เก็บใน messages และ key มาเก็บ
        this.messages.push({...snapshot.val(),id:snapshot.key})
      })
      messageRef.on("child_removed",snapshot=>{
        const deleteText = this.messages.find(message=>message.id == snapshot.key) //หา ID ใน array messages
        const index = this.messages.indexOf(deleteText); //เก็บค่าที่หามาได้ใน ตัวแปร index
        this.messages.splice(index,1) //ลบค่าใน Array ลบช่อง index
      })
      messageRef.on("child_changed",snapshot=>{
        const updateText = this.messages.find(message=>message.id == snapshot.key) //หาค่าที่มีการเปรียนแปรงข้อมูล
        updateText.text = snapshot.val().text //นำเอาค่านั้นมาใส่
      })
  }

})
