function BasketItem({item, product}){
    return (
        <>
    
          <li className="basket-item">
    {product.title} <span>x {item.amount}</span>

</li>
<style jsx>{`
.basket-item{
    padding-bottom:10px;
    border-bottom:1px solid #ddd;
    margin-bottom:10px;
    font-weight: bold;
    box-shadow: 0 5px 0 rgba(0, 0, 0, 0.1);
    position: sticky;
    text-align: center;
    
}
.basket-item span{
    font-size: 1.2rem;
    font-weight: 600;
    color:#999
    text-align: center;

}

`}</style>
        </>

    )
}
export default BasketItem