function BasketItem({item, product}){
    return (
        <>
    
          <li className="basket-item">
    {product.title} <span>x {item.amount}</span>

</li>
<style jsx>{`
.basket-item{
    background-color: lightgrey;
  width: 300px;
  border: 15px solid green;
  padding: 50px;
  margin: 20px;
  border-radius: 10px;
  bottom: 8px;
  right: 16px;
  font-size: 18px;
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