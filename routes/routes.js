module.exports = function(express, app, passport, config, rooms){
    var router = express.Router();

    router.get('/', guestPages, function(request, response, next){
        response.render('index', {title:'Welcome to ChatCat'});
    });

    function securePages(request, response, next){
        if(request.isAuthenticated()){
            next();
        }else{
            response.redirect('/');
        }
    }

    function guestPages(request, response, next){
        if(request.isAuthenticated()){
            response.redirect('/chatrooms');
        }else{
            next();
        }
    }

    router.get('/auth/facebook', passport.authenticate('facebook'));

    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect:'/chatrooms',
        failureRedirect:'/'
    }));

    router.get('/chatrooms', securePages, function(request, response, next){
        response.render('chatrooms', {title:'Chatrooms', user:request.user, config:config});
    })

    router.get('/room/:id', securePages, function(request, response, next){

        var room_name = findTitle(request.params.id);

        response.render('room', { user:request.user, room_number:request.params.id, room_name:room_name, config:config })
    })

    function findTitle(room_id){

        var n = 0;

        while(n < rooms.length){
            if(rooms[n].room_number == room_id){
                return rooms[n].room_name;
            }else{
                n++;
                continue;
            }
        }

    }

    router.get('/logout', function(request, response, next){
        request.logout();
        response.redirect('/');
    })


    app.use('/', router);
}