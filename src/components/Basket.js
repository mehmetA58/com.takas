import BasketItem from "./BasketItem";


function Basket({basket,total,resetBasket, products}){
    return (
<>
<div className="basket-container container">
    <h3>Shopping Cart</h3>
<ul>
{basket.map(item =>(
    <BasketItem key={item.id} item={item} product={products.find(p=> p.id === item.id)}/>
) )}
</ul>
<div className="total">
    Total : TakasLa bedelin {total} coin
</div>
<button className="clearBasket" onClick={resetBasket}>Clear Basket</button>
</div>
<style jsx>{`
.basket-container{
    padding:20px
    border: 50px solid #ddd;
    border-radius: 25px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    background: #fff;
    text-align: center;
}
.basket-container h3{
    font-size:14px;
    margin-bottom:20px;
    text-transform: uppercase;
    font-weight: 600;

}
.basket-container ul{
    list-style: none;
    padding: 0;
    margin: 0;
    border: 50px solid #ddd;
    
}
.basket-container .total{
    list-style: none; 
    padding-top: 20px;
    margin-top: 20px;
    font-size:26px;
    border-top: 50px solid #ddd;
    text-align: right;
    color:green;
    font-weight:bold;
    position: sticky;
    bottom: 0;
    

    
}
.basket-container .clearBasket{
    background: #000;
    color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
    position: sticky;
    bottom: 0;
    
}


`}

</style>

</>
    )
}
export default Basket