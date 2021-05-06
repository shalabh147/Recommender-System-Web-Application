
const pool= require('../utils/database');
module.exports = class Prod{

    constructor( title, image, price, quantity){
        this.title = title;
        this.image = image;
        this.price = price;
        this.quantity = quantity;
    }

    add_prod(){
        return pool.query('INSERT INTO products(title, price, image, quantity) VALUES ($1, $2, $3, $4);', [this.title, this.price, this.image, this.quantity]);
    }

/*    add_prod_to_cart(){
        return pool.query('INSERT INTO cart(user_id, item_id, quantity) VALUES ($1, $2, $3);', [this.userid, this.itemid, this.quantity]);
    }
*/
    static get_all_cart()
    {
        return pool.query('SELECT u.credit,p.title,p.price,c.quantity,p.image from users u,products p,cart c where u.user_id = c.user_id and p.id = c.item_id');
    }

    static get_with_prod_id(prod_id)
    {
        const f = pool.query('SELECT * from products p where p.id = $1 and p.quantity > 0;',[prod_id]);
        return f;
        //f.then(value => {console.log(value.rowCount)});
        //return f.then(value => {if(value.rowCount == 0) return false; else return true; });
    }
    static get_in_cart_id(prod_id)
    {   //f.then(value => {console.log(value.rowCount)});
        return pool.query('SELECT * from cart c where c.item_id = $1;',[prod_id]);
        //return f.then(value => {if(value.rowCount == 0) return false; else return true; });
        
    }

    static update_in_cart(prod_id)
    {
        return pool.query('UPDATE cart c set quantity = quantity + 1 where c.item_id = $1;',[prod_id]);
    }

    static update_in_prod(prod_id)
    {
        return pool.query('UPDATE products p set quantity = quantity-1 where p.id = $1;',[prod_id]);
    }

    static insert_in_cart(prod_id)
    {
        return pool.query('INSERT INTO cart(user_id,item_id,quantity) VALUES ($1,$2,$3);', [1,prod_id,1]);
    }

    static get_all_orders(prod_id)
    {
        return pool.query('SELECT u.credit,p.title,p.price,o.quantity,p.image from users u,products p,orders o where u.user_id = o.user_id and p.id = o.item_id');
    }

    static remcred()
    {
        return pool.query('SELECT credit from users');
    }

    static sum_price_cart()
    {
        return pool.query('SELECT sum(p.price*c.quantity) as sum from cart c, products p where p.id = c.item_id;')
    }

    static empty_cart()
    {
        return pool.query('DELETE FROM cart;')
    }

    static buy_all()
    {
        return pool.query('INSERT INTO orders SELECT * FROM CART ')
    }

    static update_credit(amount)
    {
        return pool.query('UPDATE users set credit = credit - $1;',[amount])
    }

    static get_full_cart()
    {
        return pool.query('SELECT * from cart;')
    }

    static get_full_cred(id)
    {
        return pool.query('SELECT * FROM CART WHERE item_id = id;')
    }

    static update_order(id)
    {
        return pool.query('update orders set quantity = orders.quantity+c.quantity from cart c where orders.item_id = $1 and orders.item_id = c.item_id',[id])
    }

    static insert_order(id)
    {
        return pool.query('insert into orders (select * from cart where item_id = $1)',[id])
    }

    static present_in_orders(id)
    {
        return pool.query('SELECT * FROM orders where item_id = $1;',[id])
    }

    static get_credit()
    {
        return pool.query('SELECT * FROM users;')
    }

    static get_all(){
        return pool.query('SELECT * FROM products');

    }

};