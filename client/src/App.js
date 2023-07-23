import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Account from "./components/Account";
import Cart from "./components/Cart";
import Favorite from "./components/Favorite";
import Header from "./components/Header";
import Login from "./components/Login";
import Payment from "./components/Payment";
import Products from "./components/Products";
import Register from "./components/Register";
import LoginAdmin from "./components/LoginAdmin";
import AdminPage from "./components/AdminPage";


function App() {
  const [flag, setFlag] = useState(false);

  

  return (
    <div>
      <Header setFlag={setFlag} flag={flag}/>

      <Routes>
        
        <Route path="/" exact element={<Products/>} />
        <Route path="/cart" exact element={<Cart/>} />
        <Route path="/favorite" exact element={<Favorite/>} />
        <Route path="/payment" exact element={<Payment/>}/>
        <Route path="/register" exact element={<Register/>}/>
        <Route path="/login" exact element={<Login setFlag={setFlag}/>} />
        <Route path="/account" exact element={<Account setFlag={setFlag} />}/>
        <Route path="/adminlogin" exact element={<LoginAdmin setFlag={setFlag} />}/>
        <Route path="/adminpage" exact element={<AdminPage setFlag={setFlag} />}/>


      </Routes>


    </div>
  );
}


export default App;


