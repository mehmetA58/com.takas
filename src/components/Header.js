import { moneyFormat } from "../helper";
function Header({total,money,resetBasket}) {
    return (
     <>
      {total > 0 && money - total !== 0 && (
      
       <div className="header"> TakasLA-mak için <span>{moneyFormat(money - total)} coin</span>  kaldı!</div>
)}
{total === 0 && (

  <div className="header">TakasLA-mak için <span>{moneyFormat(money)} coin</span> var </div>
)}
{money-total === 0 && (
  <div className="header">Your Batery is dead !!! </div>
)}

<style jsx>{`
.header{
  background-image: linear-gradient(140deg, #EADEDB 0%, #BC70A4 50%, #BFD641 75%);
  height: 50px;
    width: 100%;
    background-color: #1fc8db;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 1px;
    text-shadow: 0 5px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 5px 0 rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
  }
  .header span{
  margin: 0 10px;
  font-weight: bold;
  
  }
  
`}</style>

     
     </>
    );
  }
  
  export default Header;
  