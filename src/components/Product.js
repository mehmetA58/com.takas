import { moneyFormat } from "../helper"



function Product({product, total, money, basket, setBasket}) {


const basketItem = basket.find(item => item.id === product.id)

const addBasket = ()=>{
    const checkBasket = basket.find(item => item.id === product.id)
//ürün daha önce eklenmiş
    if(checkBasket){
    checkBasket.amount +=1
    setBasket([...basket.filter(item => item.id !== product.id),checkBasket])
    }else{
        setBasket([...basket,{
            id: product.id,
            amount: 1
        }])
    }
}



const removeBasket = ()=>{
    const currentBasket = basket.find(item => item.id === product.id)
    const basketNotCurrent = basket.filter(item => item.id!== product.id)
    currentBasket.amount -=1
    if(currentBasket.amount === 0){
        setBasket([...basketNotCurrent])
        }else{
            setBasket([...basketNotCurrent,currentBasket])
            }
            }




    return (
    <>
    <div className="product">
        <img src={product.image}></img>
        <h6>{product.title}</h6>
        <div className="price">{moneyFormat(product.price)} ß</div>
        <div className="global_ratings">{product.global_ratings}
        <i >⭐</i>
        </div>
        <div className="actions">
            
            <button className="sakla-btn" disabled={!basketItem} onClick={removeBasket}>Sakla</button>
            <span className="amount">{basketItem && basketItem.amount || 0}</span>
            <button className="takasla-btn" disabled={total+product.price > money} onClick={addBasket}>TakasLA</button>
        </div>
        <style jsx>{`
        .product{
            padding:20px;
            background:#fff;
            border-radius:25px;
            border:1px solid #ddd;
            margin-bottom:30px;
            width:24%;
            display:flex;
            flex-direction:column;

             }
             .product .img{
                width:100%;
                border-radius:25px 25px 0 0;
                display: block;
                margin-left: auto;
                margin-right: auto;
                height: auto;
                opacity: 0.3;
            }
           

            .product .h6{
                font-size:18px;
                margin-bottom:10px;
            }
            .product .price{
                font-size:18px;
                margin-top:10px;
                margin-bottom:10px;
                color: green;
                }
                .product .global_ratings{
                    font-size:14px;
                    margin-top:5px;
                    margin-bottom:5px;
                    color: #000;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    padding: 5px;
                    display: flex;
                    align-items: center;
                    font-weight:bold;
                    text-align:center;
                    }
                    .product .actions{
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        margin-top:10px;
                        margin-bottom:10px;
                        }
.actions button{
height: 40px;
padding:0 20px;
flex:1;
cursor: pointer;
border-radius:25px;
}
.actions button[disabled]{
    opacity: .5;
    cursor: not-allowed;
}
.actions .amount {
    width:40px;
    height:20px;
    border-radius:30%;
    border:1px solid #ddd;
    display:flex;
    justify-content:center;
    text-align:center;
    background-color: #2c2c2c;
    color:white;
    border: 1px solid #ddd;
}
.actions .takasla-btn{
    background-color: orange;
    color:white;
    font-size:14px;
    font-weight:bold;
    border-radius: 4px;
    padding: 0 7px;

}
.actions .sakla-btn{
    
        color: rgba(255,255,255,1);;
        background-color: #ff3f55;
        border-radius: 4px;
        border: 5px solid #ff3f55;
        padding: 0 7px;
        font-weight:bold;
        font-size:14px;
    

}
         `}</style>
    </div>
    </>
    );
  }
  
  export default Product;