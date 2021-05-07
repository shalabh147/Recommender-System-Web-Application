//const Prod = require('../models/prod');
const pool = require('../utils/database');

/*
exports.get_test = (req,res,next) => {


    res.render('admin/add_product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });


};
*/
exports.get_login_page = (req,res,next) => {


    res.render('admin/login', {
        pageTitle: 'Login',
        path: '/admin/login',
        editing: false
    });


};

exports.post_login_page = async (req,res,next) => {

    try{
        const username = req.body.username;
        const password = req.body.password;
        const str1 = '0';
        const str2 = '1';
        const a = await pool.query("select * from Users where username = $1 and password = $2;" , [username,password])
        req.session.name_ = username;
        if (a.rowCount == 0){
            console.log("user not found: "+username);
            res.redirect('/admin/login');
        }
        else{
            const b = await pool.query("update Users set login = $2 where username = $1",[username,str2]);
            res.redirect('/admin/home');
        }
    }
    catch (e){
        console.log(e);
        res.status(400).redirect('/admin/login')
    }

};
exports.get_signup_page = (req,res,next) => {


    res.render('admin/login', {
        pageTitle: 'Login',
        path: '/admin/login',
        editing: false
    });


};

exports.post_signup_page = async (req,res,next) => {

    //console.log("baba\n");
    const username = req.body.username;
    const name = req.body.name;
    const email_id = req.body.email_id;
    const password = req.body.password;
    const repeat_pass = req.body.repeat_pass;
    try {
        const a = await pool.query("select * from Users where username = $1 or email_id = $2", [username, email_id])
        if (a.rowCount != 0) {
            console.log("username or email_id taken")
            console.log(a.rows)
            res.redirect('/admin/signup')
        }
        else {
            if (password != repeat_pass) {
                console.log("repeat password not same")
                res.redirect('/admin/signup')
            } else {
                const b = await pool.query("Insert into Users values ($1,$2,$3,$4,null,'1',null,null,'0');", [username, name, password, email_id])
                req.session.name_ = username; res.redirect('/admin/preferences');
            }
        }
    } catch (e) {
        console.log(e);
        res.status(400).redirect('/admin/signup')
    }
};

exports.get_preferences_page = async (req,res,next) => {

    const username = req.session.name_;
    const str1 = '1';
    const a = await pool.query("SELECT login from USERS where Username = $1 and login = $2;", [username,str1]);
    if (a.rowCount == 0) res.redirect('/admin/preferences') 
    else {
        const b = await pool.query("SELECT distinct language from movies;");
        const c = await pool.query("SELECT distinct genreid, genrename from movie_genre natural join genre;");
        var list1 = b.rows;
        var list2 = c.rows;
        res.render('admin/preferences', {
            pageTitle: 'Preferences',
            path: '/admin/preferences',
            editing: false,
            list1: list1,
            list2: list2
        });
    }
};

exports.post_preferences_page = async (req, res, next) => {
    try{
        const username = req.session.name_;
        const str1 = '0';
        const str2 = '1';
        const pref1 = req.body.langpref_1;
        const pref2 = req.body.langpref_2;
        const genre_id1 = req.body.genrepref_1;
        const genre_id2 = req.body.genrepref_2;
        const a = await pool.query("SELECT login from Users where username = $1 and login = $2;", [username,str2]);
        if (a.rowCount == 0){
            console.log(username+" not logged in");
            res.redirect('/admin/login');
        }
        else{
            const b = await pool.query("Update Users set language_pref1 = $1, language_pref2 = $2 where username = $3;" , [pref1,pref2,username]);
            if (genre_id1 != ''){
                const c = await pool.query("Insert into User_Genre values ($1,$2); " , [username, genre_id1]);
            }
            if (genre_id2 != '' && genre_id2 != genre_id1){
                const d = await pool.query("Insert into User_Genre values ($1,$2); " , [username, genre_id2]);
            }
            res.redirect('/admin/home');
        }
    }
    catch (e){
        console.log(e);
        res.status(400).redirect('/admin/login')
    }
}

exports.get_search_page = (req,res,next) => {

    var username = req.session.name_;
    var list1;
    var list2;
    try{
        list1 = req.session.search_query1.rows
        list2 = req.session.search_query2.rows
    }
    catch(e){
        list1 = []
        list2 = []
    }
    const str1 = '1';
    const a = pool.query("SELECT login from Users where username = $1 and login = $2;",[username,str1]);
    //const a = Prod.get_all();
    a.then(val => {if (val.rowCount == 0) res.redirect('/admin/login') 
    else res.render('admin/search', {
        pageTitle: 'Search',
        path: '/admin/search',
        editing: false,
        user_name:username,
        list1:list1,
        list2:list2
    }) });
    

    //a.then(value => {res.render('prods', {pageTitle: 'Products', path: '/prods', editing: false, articles:value.rows});});
};

exports.post_search_page = async (req,res,next) => {

    try{
        const username = req.session.name_;
        var keyword = req.body.search.toLowerCase();
        const str1 = '0';
        const str2 = '1';
        const a = await pool.query("SELECT login from Users where username = $1 and login = $2;", [username,str2]);
        if (a.rowCount == 0){
            console.log(username+" not logged in");
            res.redirect('/admin/login');
        }
        else{
            const b = await pool.query("with act_mov as (select m.MovieId, m.language, m.title, m.releaseDate, m.popularity, m.duration, m.avgRating from movies m, Movie_Actor m_a, actor a where a.Id = m_a.ActorId and m.MovieId = m_a.MovieId and lower(a.Name) like '%' || $1 || '%') select * from act_mov order by popularity desc limit 10;" , [keyword]);
            const c = await pool.query("with mov as (select * from Movies where lower(title) like '%' || $1 || '%') select * from mov order by popularity desc limit 10;" , [keyword]);
            req.session.search_query1 = c;
            req.session.search_query2 = b;
            res.redirect('/admin/search');
        }
    }
    catch (e){
        console.log(e);
        res.status(400).redirect('/admin/login')
    }

};

exports.get_home_page = (req,res,next) => {

    var username = req.session.name_;
    const str1 = '1';
    const a = pool.query("SELECT login from Users where username = $1 and login = $2;",[username,str1]);
    var list1;
    var list2;
    var list3;
    var list4;
    var list5;
    var list0;

    a.then(val => {if (val.rowCount == 0) {return res.redirect('/admin/login')}
    else {return pool.query("select * from users, movies where username=$1 and last_watched=movieid;",[username])}})
    .then(val0 => {list0 = val0.rows; return pool.query("select movieid,language,title,to_char(releasedate,'DD MON YYYY') releasedate,duration,avgrating from Movies order by avgRating DESC LIMIT 10;")})
    .then(val1 => {list1 = val1.rows; return pool.query("select l.movieid,language,title,to_char(releasedate,'DD MON YYYY') releasedate,duration,avgrating from Movies l, (select m.MovieId, (select count(*) from Users where last_watched = m.MovieId) as count from Movies m) as foo where l.MovieId = foo.MovieId order by foo.count DESC LIMIT 10;")})
    .then(val2 => {list2 = val2.rows; return pool.query("select m.movieid,language,title,to_char(releasedate,'DD MON YYYY') releasedate,duration,avgrating from Movie_Genre m_g, user_Genre u_g, Movies m where m.MovieId = m_g.MovieId and m_g.GenreId = u_g.GenreId and u_g.username = $1 order by m.avgRating desc LIMIT 10 ; ", [username])})
    .then(val3 => {list3 = val3.rows; return pool.query("select l.movieid,language,title,to_char(releasedate,'DD MON YYYY') releasedate,duration,avgrating from Movies l, Users u, Friends f where (f.username1 = $1 and f.username2 = u.username and u.last_watched = l.MovieId) or (f.username2 = $1 and f.username1 = u.username and u.last_watched = l.MovieId) ;", [username])})
    .then(val4 => {list4 = val4.rows; return pool.query("with g as (select GenreId from Movie_Genre, Users where MovieId = last_watched and username=$1) select m.movieid,language,title,to_char(releasedate,'DD MON YYYY') releasedate,duration,avgrating from Movies m, Movie_Genre m_g, g where m.MovieId = m_g.MovieId and m_g.GenreId = g.GenreId order by m.AvgRating desc limit 10;", [username])})
    .then(val5 => {list5 = val5.rows;
        
        res.render('admin/home', {
            pageTitle: 'Home',
            path: '/admin/home',
            editing: false,
            user_name:username,
            list1:list1,
            list2:list2,
            list3:list3,
            list4:list4,
            list5:list5,
            list0:list0
        })
    }
    
    );
    

    //a.then(value => {res.render('prods', {pageTitle: 'Products', path: '/prods', editing: false, articles:value.rows});});
}

exports.post_home_page = async (req,res,next) => {

    const username = req.session.name_
    const movie_id = req.body.movie_id
    req.session.movie_id = movie_id
    if (req.body.indic == "y"){
        const d = await pool.query("update Users set last_watched = $2 where username = $1;", [username,movie_id])
    }
    return res.redirect('/admin/movies')
}


exports.get_ratings_page = async (req,res,next) => {

    const username = req.session.name_;
    const movie_id = req.session.movie_id;
    const movie_name = req.session.movie_name;
    const num_rating = req.session.num_rating;
    const verbal_rating = req.session.verbal_rating;

    const str1 = '1';
    const a = await pool.query("SELECT login from USERS where Username = $1 and login = $2;", [username,str1]);
    if (a.rowCount == 0) res.redirect('/admin/login') 
    else {
     res.render('admin/ratings', {
        pageTitle: 'Give Ratings',
        path: '/admin/ratings',
        editing: false,
        user_name:username,
        movie_name:movie_name,
        movie_id:movie_id,
        num_rating:num_rating,
        verbal_rating:verbal_rating
    })};

    

    //a.then(value => {res.render('prods', {pageTitle: 'Products', path: '/prods', editing: false, articles:value.rows});});
}


exports.post_ratings_page = async (req,res,next) => {

    try{
        const username = req.session.name_;
        const movie_id = req.body.movie_id;
        const num_rating = req.body.num_rating;
        const verbal_rating = req.body.verbal_rating;
        const str1 = '0';
        const str2 = '1';
        const a = await pool.query("SELECT login from Users where username = $1 and login = $2;", [username,str2]);
        if (a.rowCount == 0){
            console.log(username+" not logged in");
            res.redirect('/admin/login');
        }
        else{
            const b = await pool.query("select * from rating where username = $1 and movieid = $2",[username,movie_id]);
            if(b.rowCount == 0)
            {
                const c = await pool.query("insert into rating values ($1, $2, $3, $4)" ,[movie_id,username,num_rating,verbal_rating]);
            }
            else
            {
                const d = await pool.query("update rating set num_rating = $3, verbal_rating = $4 where username = $1 and movieid = $2 ;",[username,movie_id,num_rating,verbal_rating])
            }
            const e = await pool.query("update movies set avgrating = (select avg(num_rating) from rating where movieid=$1) where movieid=$1;",[movie_id])
            res.redirect('/admin/home');
        }
    }
    catch (e){
        console.log(e);
        res.status(400).redirect('/admin/login')
    }

};


exports.get_movies_page = async (req,res,next) => {

    const username = req.session.name_;
    const movie_id = req.session.movie_id;
    
    const str1 = '1';
    const a = await pool.query("SELECT login from USERS where Username = $1 and login = $2;", [username,str1]);
    if (a.rowCount == 0) res.redirect('/admin/login') 
    else {
        const b = await pool.query("SELECT movieid,language,title,to_char(releasedate,'DD MON YYYY') releasedate,duration,avgrating from MOVIES where movieid = $1", [movie_id]);
        const c = await pool.query("select * from actor, movie_actor where id=actorid and movieid=$1", [movie_id]);
        const d = await pool.query("select * from director, movie_director where id=directorid and movieid=$1", [movie_id]);
        const e = await pool.query("select * from movie_genre natural join genre where movieid=$1", [movie_id]);
        var list1;
        var list2;
        var list3;
        var list4;
        try {
            list1 = b.rows;
            list2 = c.rows;
            list3 = d.rows;
            list4 = e.rows;
        } catch (error) {
            console.log("something went wrong on movieid: "+movie_id)
            console.log(e)
            res.status(400).redirect('/admin/home')
        }
        
        res.render('admin/movies', {
            pageTitle: 'Movie Info',
            path: '/admin/movies',
            editing: false,
            user_name:username,
            list1:list1,
            list2:list2,
            list3:list3,
            list4:list4
        })
    }

}

exports.post_movies_page = async (req,res,next) => {

    try{
        const username = req.session.name_
        const movie_id = req.body.movie_id
        const movie_name = req.body.title
        const str1 = '0';
        const str2 = '1';
        const a = await pool.query("SELECT login from Users where username = $1 and login = $2;", [username,str2]);
        if (a.rowCount == 0){
            console.log(username+" not logged in");
            res.redirect('/admin/login');
        }
        else{
            const b = await pool.query("select * from rating where username=$1 and movieid=$2", [username, movie_id]);
            req.session.movie_id=movie_id
            req.session.movie_name=movie_name
            if(b.rowCount != 0){
                req.session.num_rating=b.rows[0].num_rating
                req.session.verbal_rating=b.rows[0].verbal_rating
            }
            else{
                req.session.num_rating=0
                req.session.verbal_rating=""
            }
            res.redirect('/admin/ratings');
        }
    }
    catch (e){
        console.log(e);
        res.status(400).redirect('/admin/login')
    }

};

exports.get_profile_page = async (req,res,next) => {

    var username = req.session.name_;
    var list1;
    var list2;
    var list;
    try{
        list2 = req.session.search_friend.rows
    }
    catch(e){
        list2 = []
    }
    const str1 = '1';
    const a = await pool.query("SELECT login from Users where username = $1 and login = $2;",[username,str1]);
    //const a = Prod.get_all();
    if (a.rowCount == 0) res.redirect('/admin/login') 
    else{ 
        const b = await pool.query("SELECT GenreName from User_Genre, Genre where User_Genre.username = $1 and  User_Genre.GenreId = Genre.GenreId;",[username]);
        var genre1 = "";
        var genre2 = "";
        try{
            genre1 = b.rows[0];
        } catch(e){}
        try{
            genre2 = b.rows[1];
        } catch(e){}
        try{
            const c = await pool.query("select *, case when last_watched is null then NULL else (select title from Movies where movieid=last_watched) end as mov_title from Users u, Friends f where (f.Username1 = $1 and f.Username2 = u.Username) or (f.Username2 = $1 and f.Username1 = u.Username) order by login desc, mov_title; " , [username]);
            list1 = c.rows
        }
        catch(e){
            list1 = []
        }
        try{
            const d = await pool.query("select * from users where username = $1" , [username]);
            list = d.rows
        } catch (e) {
            list = []
            console.log(username+"'s profile not found");
            console.log(e);
            res.status(400).redirect('/admin/login')
        }
        res.render('admin/profile', {
        pageTitle: 'My Profile',
        path: '/admin/profile',
        editing: false,
        user_name:username,
        list1:list1,
        list2:list2,
        list:list,
        genre1:genre1,
        genre2:genre2
        }) 
    }
    


    //a.then(value => {res.render('prods', {pageTitle: 'Products', path: '/prods', editing: false, articles:value.rows});});
}

exports.post_profile_page = async (req,res,next) => {

    try{
        const username = req.session.name_;
        var keyword = req.body.search.toLowerCase();
        const str1 = '0';
        const str2 = '1';
        const a = await pool.query("SELECT login from Users where username = $1 and login = $2;", [username,str2]);
        if (a.rowCount == 0){
            console.log(username+" not logged in");
            res.redirect('/admin/login');
        }
        else{
            const d = await pool.query("select * from users where lower(username) like '%' || $1 || '%' order by username" , [keyword]);
            req.session.search_friend = d;
            res.redirect('/admin/profile');
        }
    }
    catch (e){
        console.log(e);
        res.status(400).redirect('/admin/login')
    }

};

/*
exports.get_admin_page = (req,res,next) => {

    const username = req.body.username;

    const a = pool.query("SELECT * from USERS where Username = $1 and login = 1 and admin = 1;",[username]);

    a.then(val => {if (val.rowCount == 0) res.redirect('/admin/login') 
    else res.render('admin/admin', {
        pageTitle: 'Admin',
        path: '/admin/admin',
        editing: false,
        user_name:username
    });
    });
    


    //a.then(value => {res.render('prods', {pageTitle: 'Products', path: '/prods', editing: false, articles:value.rows});});
}








exports.post_test = (req,res,next) => {
    const title = req.body.title;
    const image = req.body.image;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const product = new Prod( title, image, price,quantity);
    product
        .add_prod()
        .then(() => {
            res.redirect('/admin/add-product');
        })
        .catch(err => console.log(err));
};


exports.get_prods_test = (req,res,next) => {

    //var q = Prod.get_all();
    const a = Prod.get_all();
    //a.then(value => {console.log(value)});
    a.then(value => {res.render('prods', {pageTitle: 'Products', path: '/prods', editing: false, articles:value.rows});});

    //console.log(a);
    //res.render('prods', {
    //    pageTitle: 'Products',
    //    path: '/prods',
    //    editing: false
    //});
    //res.send('Hello World');

};

exports.post_prods_test = (req,res,next) => {
    //const title = req.body.title;
    //const image = req.body.image
    //const price = req.body.price;
    //const quantity = req.body.quantity;
    //const product = new Prod( title, image, price,quantity);
    //product
    //    .add_prod_to_cart()
    //    .then(() => {
    //        res.redirect('/admin/add-product');
    //    })
    //    .catch(err => console.log(err));
};




exports.get_cart_test = (req,res,next) => {

    const a = Prod.get_all_cart();
    var x;
    const b = Prod.get_credit();
    //a.then(value => x = value.rows);
    //var x = a.then(value => console.log(value.rows));
    //console.log(x);
    a.then(value => {x = value; return Prod.get_credit();})
    .then(val => {res.render('cart', {pageTitle: 'Cart', path: '/cart', editing: false, articles:x.rows, count: x.rowCount, cred: val.rows[0].credit });});
    //a.then(value => {if(value.rowCount == 0) 
    //    {res.render('cart', {pageTitle: 'Cart', path: '/cart', editing: false, articles:value.rows, count: value.rowCount, cred: b.then(val => {return val.rows[0].credit}) })}
    //    else
    //    {res.render()}
    //})
    //res.render('cart', {
    //    pageTitle: 'Cart',
    //    path: '/cart',
    //    editing: false
    //});


};

exports.post_cart_test = (req,res,next) => {
    //const title = req.body.title;
    //const image = req.body.image
    //const price = req.body.price;
    //const quantity = req.body.quantity;
    //const product = new Prod( title, image, price,quantity);
    const product_id = req.body.product_id;


    const nice = Prod.get_with_prod_id(product_id);
    nice.then(val => {if(val.rowCount != 0) 
        {return Prod.get_in_cart_id(product_id).then(value => {Prod.update_in_prod(product_id); if(value.rowCount != 0) {return Prod.update_in_cart(product_id)} else return Prod.insert_in_cart(product_id)})
    .then(() => {return res.redirect('/cart')}); } 
    else {return res.redirect('/prods')}});
    //const x = Prod.get_with_prod_id();
    //x.then()
    //product
    //    .add_prod_to_cart()
    //    .then(() => {
    //        res.redirect('/admin/add-product');
    //    })
    //    .catch(err => console.log(err));
};



exports.get_orders_test = (req,res,next) => {

    const ord = Prod.get_all_orders();
    ord.then(value => {res.render('orders', {pageTitle: 'Orders', path: '/orders', editing: false, articles:value.rows});});

    //res.render('orders', {
    //    pageTitle: 'Orders',
    //    path: '/orders',
    //    editing: false
    //});


};

exports.post_orders_test = (req,res,next) => {
    //const title = req.body.title;
    //const image = req.body.image
    //const price = req.body.price;
    //const quantity = req.body.quantity;
    //const product = new Prod( title, image, price,quantity);
    //product
    //    .add_prod_to_cart()
    //    .then(() => {
    //        res.redirect('/admin/add-product');
    //    })
    //    .catch(err => console.log(err));
    const cred = Prod.remcred();
    var x,y;
    var pur;
    var pro_list = [];
    var res_list = [];
    var id_list = [];
    var newlist = [];

    cred.then(val => { x = val.rows[0].credit; return Prod.sum_price_cart()})
        .then(value => {if(x < value.rows[0].sum) {return res.redirect('/cart') } 
        else {pur = value.rows[0].sum; return Prod.get_full_cart().then(ui => {y = ui.rowCount;
            //  console.log(y);
          for (i = 0; i < y; i++) {
           //   console.log("i"+i);
          var id = ui.rows[i].item_id;
          id_list.push(id);
          //console.log("id"+id);
          pro_list.push(Prod.present_in_orders(id))} return Promise.all(pro_list)} )
          .then(chec => {
            //  console.log(chec.length);
              for (i = 0; i < chec.length; i++) {
              //    console.log(chec[i].rowCount);
                  
                  if(chec[i].rowCount == 0)
                  {//   console.log("id"+id_list[i]);
                      newlist.push(Prod.insert_order(id_list[i]));
                  }
                  else
                  {  // console.log("id"+id_list[i]);
                      newlist.push(Prod.update_order(id_list[i]));
                  }
              }

              return Promise.all(newlist);

          })
          .then(()=>{return Prod.empty_cart()})
          .then(() => {return Prod.update_credit(pur)})
          .then(()=>{res.redirect('/orders')});}})    
            
            
             
          
           
};
*/

