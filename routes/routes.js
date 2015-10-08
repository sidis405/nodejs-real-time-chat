module.exports = function(express, app, passport){
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
        response.render('chatrooms', {title:'Chatrooms', user:request.user});
    })

    router.get('/logout', function(request, response, next){
        request.logout();
        response.redirect('/');
    })


    app.use('/', router);
}