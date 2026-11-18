import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const products = [
 {id:1,name:'Wireless Headphones',category:'Electronics',price:2499,old:3999,emoji:'🎧',desc:'Immersive sound with comfortable fit and long battery life.'},
 {id:2,name:'Smart Watch',category:'Electronics',price:1899,old:2999,emoji:'⌚',desc:'Track activity, notifications and your everyday health metrics.'},
 {id:3,name:'Everyday Backpack',category:'Fashion',price:1299,old:1899,emoji:'🎒',desc:'A versatile backpack for college, travel and daily use.'},
 {id:4,name:'Running Sneakers',category:'Fashion',price:2199,old:3499,emoji:'👟',desc:'Lightweight shoes designed for everyday comfort.'},
 {id:5,name:'Coffee Maker',category:'Home',price:1599,old:2499,emoji:'☕',desc:'Make your morning coffee with a compact, easy-to-use machine.'},
 {id:6,name:'Desk Lamp',category:'Home',price:799,old:1199,emoji:'💡',desc:'Adjustable lighting for study and work.'},
 {id:7,name:'Gaming Controller',category:'Electronics',price:1499,old:2199,emoji:'🎮',desc:'Responsive controls for your gaming setup.'},
 {id:8,name:'Classic Sunglasses',category:'Fashion',price:999,old:1599,emoji:'🕶️',desc:'A classic style for sunny days.'}
];
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } };
function App(){
 const [user,setUser]=useState(read('sk_user',null));
 const [cart,setCart]=useState(read('sk_cart',[]));
 const [wish,setWish]=useState(read('sk_wish',[]));
 const [orders,setOrders]=useState(read('sk_orders',[]));
 const [page,setPage]=useState('home');
 const [query,setQuery]=useState('');
 const [category,setCategory]=useState('All');
 const [selected,setSelected]=useState(null);
 const [notice,setNotice]=useState('');
 const [authMode,setAuthMode]=useState('login');
 const [form,setForm]=useState({name:'',email:'',password:''});
 const [shipping,setShipping]=useState({name:'',phone:'',address:'',city:'',pincode:''});
 const save=(key,val)=>localStorage.setItem(key,JSON.stringify(val));
 const msg=(s)=>{setNotice(s);setTimeout(()=>setNotice(''),2500)};
 const filtered=products.filter(p=>(category==='All'||p.category===category)&&p.name.toLowerCase().includes(query.toLowerCase()));
 const count=cart.reduce((a,c)=>a+c.qty,0), total=cart.reduce((a,c)=>a+c.price*c.qty,0);
 function add(p){const next=[...cart];const i=next.findIndex(x=>x.id===p.id);if(i>=0)next[i].qty++;else next.push({...p,qty:1});setCart(next);save('sk_cart',next);msg('Added to cart');}
 function toggleWish(p){const next=wish.includes(p.id)?wish.filter(id=>id!==p.id):[...wish,p.id];setWish(next);save('sk_wish',next);msg(wish.includes(p.id)?'Removed from wishlist':'Added to wishlist');}
 function changeQty(id,n){const next=cart.map(x=>x.id===id?{...x,qty:n}:x).filter(x=>x.qty>0);setCart(next);save('sk_cart',next)}
 function login(){if(!form.email||!form.password){msg('Enter email and password');return}const u={name:form.name||form.email.split('@')[0],email:form.email};setUser(u);save('sk_user',u);setPage('home');msg('Welcome to ShopKart!')}
 function logout(){setUser(null);localStorage.removeItem('sk_user');setPage('home');msg('Logged out')}
 function placeOrder(){if(!shipping.name||!shipping.phone||!shipping.address||!shipping.city||!shipping.pincode){msg('Please complete shipping details');return}const order={id:'SK'+Date.now().toString().slice(-7),items:cart,total,status:'Demo payment successful',date:new Date().toLocaleDateString(),shipping};const next=[order,...orders];setOrders(next);save('sk_orders',next);setCart([]);save('sk_cart',[]);setPage('orders');msg('Order placed successfully!')}
 const go=(p)=>{setPage(p);setSelected(null);window.scrollTo(0,0)};
 return <><header><div className="nav"><div className="logo" onClick={()=>go('home')}>🛍️ ShopKart</div><div className="search"><input placeholder="Search products..." value={query} onChange={e=>{setQuery(e.target.value);go('home')}}/><button onClick={()=>go('home')}>Search</button></div><div className="links"><button onClick={()=>go('home')}>Home</button><button onClick={()=>go('wishlist')}>♡ Wishlist ({wish.length})</button><button onClick={()=>go('cart')}>🛒 Cart ({count})</button>{user?<button onClick={()=>go('orders')}>Orders</button>:<button onClick={()=>{setAuthMode('login');go('auth')}}>Login</button>}</div></div></header>
 <main><section className="hero"><div><p className="eyebrow">YOUR EVERYDAY MARKETPLACE</p><h1>Good finds.<br/>Great prices.</h1><p>Everything you need, all in one place.</p><button className="primary" onClick={()=>go('home')}>Shop now →</button></div><div className="heroart">🛒<span>✨</span></div></section>
 {page==='home'&&<><div className="sectionhead"><div><h2>Explore products</h2><p>Find your next favourite.</p></div><select value={category} onChange={e=>setCategory(e.target.value)}><option>All</option><option>Electronics</option><option>Fashion</option><option>Home</option></select></div><div className="grid">{filtered.map(p=><article className="product" key={p.id}><div className="pic" onClick={()=>{setSelected(p);go('detail')}}>{p.emoji}</div><button className="heart" onClick={()=>toggleWish(p)}>{wish.includes(p.id)?'♥':'♡'}</button><small>{p.category}</small><h3>{p.name}</h3><div className="price">₹{p.price.toLocaleString()} <del>₹{p.old.toLocaleString()}</del></div><button className="add" onClick={()=>add(p)}>Add to cart</button><button className="detail" onClick={()=>{setSelected(p);go('detail')}}>View details</button></article>)}</div>{filtered.length===0&&<p className="empty">No products found.</p>}</>}
 {page==='detail'&&selected&&<div className="detailpage"><div className="detailpic">{selected.emoji}</div><div><small>{selected.category}</small><h1>{selected.name}</h1><p>{selected.desc}</p><h2>₹{selected.price.toLocaleString()}</h2><button className="primary" onClick={()=>add(selected)}>Add to cart</button><button className="secondary" onClick={()=>toggleWish(selected)}>♡ Wishlist</button></div></div>}
 {page==='auth'&&<div className="auth"><h2>{authMode==='login'?'Welcome back':'Create account'}</h2><p>Sign in to continue shopping.</p>{authMode==='register'&&<input placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>}<input placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><button className="primary full" onClick={login}>{authMode==='login'?'Login':'Register'}</button><p className="switch" onClick={()=>setAuthMode(authMode==='login'?'register':'login')}>{authMode==='login'?'New here? Create an account':'Already have an account? Login'}</p></div>}
 {page==='wishlist'&&<><h2>Your Wishlist</h2><div className="grid">{products.filter(p=>wish.includes(p.id)).map(p=><article className="product" key={p.id}><div className="pic">{p.emoji}</div><h3>{p.name}</h3><div className="price">₹{p.price}</div><button className="add" onClick={()=>add(p)}>Add to cart</button><button className="detail" onClick={()=>toggleWish(p)}>Remove</button></article>)}</div>{wish.length===0&&<p className="empty">Your wishlist is empty.</p>}</>}
 {page==='cart'&&<><h2>Your Shopping Cart</h2>{cart.length===0?<p className="empty">Your cart is empty. <button onClick={()=>go('home')}>Continue shopping</button></p>:<div className="cartlayout"><div>{cart.map(p=><div className="cartitem" key={p.id}><div className="mini">{p.emoji}</div><div className="grow"><b>{p.name}</b><p>₹{p.price.toLocaleString()}</p></div><div className="qty"><button onClick={()=>changeQty(p.id,p.qty-1)}>−</button>{p.qty}<button onClick={()=>changeQty(p.id,p.qty+1)}>+</button></div><b>₹{(p.price*p.qty).toLocaleString()}</b><button onClick={()=>changeQty(p.id,0)}>✕</button></div>)}</div><aside className="summary"><h3>Order summary</h3><p>Subtotal <b>₹{total.toLocaleString()}</b></p><p>Shipping <b>Free</b></p><hr/><p className="total">Total <b>₹{total.toLocaleString()}</b></p><button className="primary full" onClick={()=>{if(!user){go('auth');msg('Login to checkout')}else go('checkout')}}>Proceed to checkout</button></aside></div>}</>}
 {page==='checkout'&&<div className="checkout"><h2>Checkout</h2><div className="cartlayout"><div className="auth"><h3>Shipping details</h3>{['name','phone','address','city','pincode'].map(k=><input key={k} placeholder={k[0].toUpperCase()+k.slice(1)} value={shipping[k]} onChange={e=>setShipping({...shipping,[k]:e.target.value})}/>)}<p>Payment: Demo checkout (test mode)</p><button className="primary full" onClick={placeOrder}>Place order · ₹{total.toLocaleString()}</button></div><aside className="summary"><h3>Order summary</h3>{cart.map(p=><p key={p.id}>{p.name} × {p.qty} <b>₹{p.price*p.qty}</b></p>}<hr/><h3>Total ₹{total.toLocaleString()}</h3></aside></div></div>}
 {page==='orders'&&<><h2>My Orders</h2>{orders.map(o=><div className="order" key={o.id}><b>Order #{o.id}</b><span>{o.date}</span><p>{o.items.map(x=>x.name+' × '+x.qty).join(', ')}</p><b>₹{o.total.toLocaleString()}</b><p className="success">{o.status}</p></div>)}{orders.length===0&&<p className="empty">No orders yet.</p>}{user&&<button className="secondary" onClick={logout}>Logout</button>}</>}
 </main><footer><b>🛍️ ShopKart</b><p>Shopping made simple.</p></footer>{notice&&<div className="toast">{notice}</div>}</>
}
createRoot(document.getElementById('root')).render(<App/>);
