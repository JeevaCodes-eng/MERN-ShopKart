const express=require('express');
const cors=require('cors');
const app=express();
app.use(cors({origin:'http://localhost:5173',credentials:true}));
app.use(express.json());
const products=[
{id:1,name:'Wireless Headphones',category:'Electronics',price:2499},
{id:2,name:'Smart Watch',category:'Electronics',price:1899},
{id:3,name:'Everyday Backpack',category:'Fashion',price:1299},
{id:4,name:'Running Sneakers',category:'Fashion',price:2199},
{id:5,name:'Coffee Maker',category:'Home',price:1599},
{id:6,name:'Desk Lamp',category:'Home',price:799},
{id:7,name:'Gaming Controller',category:'Electronics',price:1499},
{id:8,name:'Classic Sunglasses',category:'Fashion',price:999}
];
app.get('/',(_,res)=>res.json({message:'ShopKart API running'}));
app.get('/products',(req,res)=>{let list=products;if(req.query.search)list=list.filter(p=>p.name.toLowerCase().includes(req.query.search.toLowerCase()));if(req.query.category)list=list.filter(p=>p.category===req.query.category);res.json(list)});
app.get('/products/:id',(req,res)=>{const p=products.find(x=>x.id===Number(req.params.id));p?res.json(p):res.status(404).json({message:'Product not found'})});
app.post('/customers/register',(req,res)=>res.status(201).json({message:'Registration endpoint starter',customer:req.body}));
app.post('/customers/login',(req,res)=>res.json({message:'Login endpoint starter'}));
app.get('/wishlist',(req,res)=>res.json([]));
app.get('/cart',(req,res)=>res.json([]));
app.post('/orders/create-payment-order',(req,res)=>res.json({message:'Demo payment endpoint',order:req.body}));
app.get('/orders',(req,res)=>res.json([]));
app.listen(5000,()=>console.log('ShopKart API running on http://localhost:5000'));
