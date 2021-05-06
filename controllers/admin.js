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
        const a = await pool.query("select * from Users where username = $1 and password = $2 and login = $3;" , [username,password,str1])
        req.session.name_ = username;
        if (a.rowCount == 0){
            console.log("chaman chosda");
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
/*
exports.get_signup_page = (req,res,next) => {


    res.render('admin/login', {
        pageTitle: 'Login',
        path: '/admin/login',
        editing: false
    });


};

exports.post_signup_page = (req,res,next) => {

    //console.log("baba\n");
    const username = req.body.username;
    const password = req.body.password;
    const str1 = '0';
    const str2 = '1';
    const a = pool.query("select count(*) from Users where username = $1 and password = $2 and login = $3 ;" , [username,password,str1])
    a.then(val => {if (val.rowCount == 0) res.redirect('/admin/login') 
    else
    {
        return pool.query("update Users set login = $2 where username = $1",[username,str2]);
    }})
    .then(()=> {req.session.context = username; res.redirect('/admin/home')});
    


};


exports.get_lang_pref = (req,res,next) => {

    const username = req.body.username;
    const a = pool.query("SELECT login from USERS where Username = $1 and login = 1;",[username]);
    //const a = Prod.get_all();
    a.then(val => {if (val.rowCount == 0) res.redirect('/admin/login') 
    else return pool.query("SELECT distinct language from movies;")})
    .then(value => {res.render('admin/lang_pref', {
        pageTitle: 'Language Preferences',
        path: '/admin/lang_pref',
        editing: false,
        language:value.rows
    });
    });



};

exports.get_genre_pref = (req,res,next) => {

    const username = req.body.username;
    const a = pool.query("SELECT login from USERS where Username = $1 and login = 1;",[username]);
    
    //const a = Prod.get_all();
    a.then(val => {if (val.rowCount == 0) res.redirect('/admin/login') 
    else return pool.query("SELECT distinct genre from movies;")})
    .then(value => {res.render('admin/lang_pref', {
        pageTitle: 'Genre Preferences',
        path: '/admin/lang_pref',
        editing: true,
        genre:value.rows
    });});


};

exports.get_search_page = (req,res,next) => {

    const username = req.body.username;
    const a = pool.query("SELECT login from USERS where Username = $1 and login = 1;",[username]);
    //const a = Prod.get_all();
    a.then(val => {if (val.rowCount == 0) res.redirect('/admin/login') 
    else res.render('admin/home', {
        pageTitle: 'Home',
        path: '/admin/home',
        editing: false,
        user_name:username
    }) });
    

    //a.then(value => {res.render('prods', {pageTitle: 'Products', path: '/prods', editing: false, articles:value.rows});});
};
*/

exports.get_home_page = (req,res,next) => {

    var username = req.session.name_;
    console.log(username);
    // const username = "user1";
    const str1 = '1';
    const a = pool.query("SELECT login from Users where username = $1 and login = $2;",[username,str1]);
    //const a = Prod.get_all();
    var list1;
    var list2;
    var list3;
    var list4;
    var list5;
    var list6;

    a.then(val => {if (val.rowCount == 0) {return res.redirect('/admin/login')} 
    else {return pool.query("select * from Movies order by avgRating DESC LIMIT 10;");}})
    .then(val1 => {list1 = val1.rows; return pool.query("select * from Movies l, (select m.MovieId, (select count(*) from Users where last_watched = m.MovieId) as count from Movies m) as foo where l.MovieId = foo.MovieId order by foo.count DESC LIMIT 10;")})
    .then(val2 => {list2 = val2.rows; return pool.query("select * from Movie_Genre m_g, user_Genre u_g, Movies m where m.MovieId = m_g.MovieId and m_g.GenreId = u_g.GenreId and u_g.username = $1 order by m.avgRating desc LIMIT 10 ; ", [username])})
    .then(val3 => {list3 = val3.rows; return pool.query("select * from Movies l, Users u, Friends f where (f.username1 = $1 and f.username2 = u.username and u.last_watched = l.MovieId) or (f.username2 = $1 and f.username1 = u.username and u.last_watched = l.MovieId) ;", [username])})
    .then(val4 => {list4 = val4.rows;
        console.log(list3.length)
        res.render('admin/home', {
            pageTitle: 'Home',
            path: '/admin/home',
            editing: false,
            user_name:username,
            list1:list1,
            list2:list2,
            list3:list3,
            list4:list4,
        })
    }
    
    );
    

    //a.then(value => {res.render('prods', {pageTitle: 'Products', path: '/prods', editing: false, articles:value.rows});});
}

/*
exports.get_ratings_page = (req,res,next) => {

    const username = req.body.username;
    const movie_id = req.body.movieid;
    const movie_name = req.body.moviename;

    const a = pool.query("SELECT login from USERS where Username = $1 and login = 1;",[username]);
    //const a = Prod.get_all();
    a.then(val => {if (val.rowCount == 0) res.redirect('/admin/login') 
    else res.render('admin/ratings', {
        pageTitle: 'Give Ratings',
        path: '/admin/ratings',
        editing: false,
        user_name:username,
        movie_name:movie_name,
        movie_id:movie_id
    }) });

    

    //a.then(value => {res.render('prods', {pageTitle: 'Products', path: '/prods', editing: false, articles:value.rows});});
}


exports.get_movies_page = (req,res,next) => {

    const username = req.body.username;
    const movie_id = req.body.movieid;
    const movie_name = req.body.moviename;

    const a = pool.query("SELECT login from USERS where Username = $1 and login = 1;",[username]);
    const b = pool.query("SELECT * from MOVIES where movieid = $1",[movie_id]);
    //const a = Prod.get_all();
    a.then(val => {if (val.rowCount == 0) res.redirect('/admin/login') 
    else return pool.query("SELECT * from MOVIES where movieid = $1",[movie_id]);
    })
    .then(value => {res.render('admin/movies', {
        pageTitle: 'Movie Info',
        path: '/admin/movies',
        editing: false,
        user_name:username,
        movie:value.rows
    });});

    

    //a.then(value => {res.render('prods', {pageTitle: 'Products', path: '/prods', editing: false, articles:value.rows});});
}

exports.get_profile_page = (req,res,next) => {

    const username = req.body.username;

    const a = pool.query("SELECT * from USERS where Username = $1 and login = 1;",[username]);

    a.then(val => {if (val.rowCount == 0) res.redirect('/admin/login') 
    else res.render('admin/profile', {
        pageTitle: 'My Profile',
        path: '/admin/profile',
        editing: false,
        user_name:username,
        user:val.rows
    });
    });
    


    //a.then(value => {res.render('prods', {pageTitle: 'Products', path: '/prods', editing: false, articles:value.rows});});
}


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

