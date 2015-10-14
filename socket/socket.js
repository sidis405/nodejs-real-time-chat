module.exports = function(io, rooms){

    var chatrooms = io.of('/roomlist').on('connection', function(socket){

        console.log('connection estabilished on server');

        socket.emit('roomupdate', JSON.stringify(rooms));

        socket.on('newroom', function(data){
            rooms.push(data);
            socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
            socket.emit('roomupdate', JSON.stringify(rooms));
        })

    });

    var messages = io.of('/messages').on('connection', function(socket){

        console.log('connection estabilished on server');

        socket.on('joinroom', function(data){
            socket.user_name = data.user_name;
            socket.user_pic = data.user_pic;
            socket.join(data.room_number);
            updateUserList(data.room_number, true);
        });

        socket.on('newmessage', function(data){
            socket.broadcast.to(data.room_number).emit('messagefeed', JSON.stringify(data));
        })

        function updateUserList(room, updateAll){
            var getUsers = io.of('/messages').clients(room);
            var userlist = [];

            for(var i in getUsers){
                userlist.push({user_name:getUsers[i].user_name, user_pic:getUsers[i].user_pic});
            }

            socket.to(room).emit('updateuserlist', JSON.stringify(userlist));

            if(updateAll){
                socket.broadcast.to(room).emit('updateuserlist', JSON.stringify(userlist));
            }
        }

        socket.on('updatelist', function(data){
            updateUserList(data.room_number);
        });

    })

}