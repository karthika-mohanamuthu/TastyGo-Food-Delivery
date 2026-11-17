/* TastyGo demo application. localStorage is for classroom demonstrations only. */
const STORAGE = { users: "tastygo_users", current: "tastygo_current_user", cart: "tastygo_cart", orders: "tastygo_orders" };
const readStore = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const writeStore = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const money = value => "₹" + Number(value).toLocaleString("en-IN");
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const states = {
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi"],
  Kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur"],
  Telangana: ["Hyderabad", "Warangal", "Karimnagar"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  "Andhra Pradesh": ["Vijayawada", "Visakhapatnam", "Guntur", "Tirupati"],
  "West Bengal": ["Kolkata", "Howrah", "Siliguri", "Durgapur"]
};
const dishes = [
  {id:"biryani",name:"Chicken Biryani",restaurant:"Spice Route",price:220,tag:"Bestseller",img:"https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=700&q=80"},
  {id:"pizza",name:"Margherita Pizza",restaurant:"Oven Story",price:249,tag:"Vegetarian",img:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80"},
  {id:"burger",name:"Classic Burger",restaurant:"Burger Barn",price:159,tag:"Popular",img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"},
  {id:"dosa",name:"Masala Dosa",restaurant:"South Spice",price:99,tag:"South Indian",img:"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80"},
  {id:"noodles",name:"Hakka Noodles",restaurant:"Wok Express",price:179,tag:"Chef's pick",img:"https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=700&q=80"},
  {id:"salad",name:"Fresh Garden Salad",restaurant:"Green Bowl",price:139,tag:"Healthy",img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80"},
  {id:"pancakes",name:"Pancake Stack",restaurant:"Sweet Corner",price:149,tag:"Sweet treat",img:"https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=700&q=80"},
  {id:"fries",name:"Crispy French Fries",restaurant:"Burger Barn",price:89,tag:"Snack",img:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80"}
];
function getCart(){ return readStore(STORAGE.cart, []); }
function setCart(cart){ writeStore(STORAGE.cart, cart); updateCartCount(); }
function updateCartCount(){ const el=document.getElementById("cartCount"); if(el) el.textContent=getCart().reduce((n,item)=>n+item.qty,0); }
function setValidity(input, valid){ input.classList.toggle("is-valid",valid); input.classList.toggle("is-invalid",!valid); }
function initSignup(){
  const form=document.getElementById("signupForm"); if(!form)return;
  const state=document.getElementById("state"), city=document.getElementById("city");
  Object.keys(states).forEach(s=>state.add(new Option(s,s)));
  state.addEventListener("change",()=>{city.innerHTML='<option value="">Select city</option>'; (states[state.value]||[]).forEach(c=>city.add(new Option(c,c))); city.disabled=!state.value; validateField(state); validateField(city);});
  const fields=[...form.querySelectorAll("input,select")];
  function validateField(el){
    let valid=el.checkValidity();
    if(el.id==="password") valid=passwordPattern.test(el.value);
    if(el.id==="confirmPassword") valid=passwordPattern.test(document.getElementById("password").value)&&el.value===document.getElementById("password").value;
    if(el.id==="password" && document.getElementById("confirmPassword").value) validateField(document.getElementById("confirmPassword"));
    setValidity(el,valid); return valid;
  }
  fields.forEach(el=>{el.addEventListener("input",()=>validateField(el));el.addEventListener("change",()=>validateField(el));});
  form.addEventListener("reset",()=>{setTimeout(()=>{fields.forEach(el=>el.classList.remove("is-valid","is-invalid"));city.innerHTML='<option value="">Select city</option>';city.disabled=true;document.getElementById("signupMessage").innerHTML="";},0);});
  form.addEventListener("submit",e=>{
    e.preventDefault(); const valid=fields.map(validateField).every(Boolean);
    const msg=document.getElementById("signupMessage");
    if(!valid){msg.innerHTML='<div class="alert alert-danger">Please correct the highlighted fields.</div>';form.querySelector(":invalid")?.focus();return;}
    const users=readStore(STORAGE.users,[]), email=document.getElementById("email").value.trim().toLowerCase(), mobile=document.getElementById("mobile").value.trim();
    if(users.some(u=>u.email===email||u.mobile===mobile)){msg.innerHTML='<div class="alert alert-warning">This email or mobile number is already registered. Please login.</div>';return;}
    const user={firstName:document.getElementById("firstName").value.trim(),lastName:document.getElementById("lastName").value.trim(),email,mobile,password:document.getElementById("password").value,address1:document.getElementById("address1").value.trim(),address2:document.getElementById("address2").value.trim(),state:state.value,city:city.value,pincode:document.getElementById("pincode").value.trim()};
    users.push(user);writeStore(STORAGE.users,users);writeStore(STORAGE.current,{email:user.email});
    msg.innerHTML='<div class="alert alert-success">Account created successfully! Taking you to the menu…</div>';
    setTimeout(()=>location.href="menu.html",700);
  });
}
function initLogin(){
  const form=document.getElementById("loginForm");if(!form)return;
  const id=document.getElementById("loginId"),pw=document.getElementById("loginPassword");
  function validateId(){const v=id.value.trim();const ok=emailPattern.test(v)||/^\d{10}$/.test(v);setValidity(id,ok);return ok;}
  id.addEventListener("input",validateId);id.addEventListener("change",validateId);
  pw.addEventListener("input",()=>setValidity(pw,pw.value.length>0));
  form.addEventListener("submit",e=>{e.preventDefault();const ok=validateId()&&pw.value.length>0;setValidity(pw,pw.value.length>0);const msg=document.getElementById("loginMessage");if(!ok){msg.innerHTML='<div class="alert alert-danger">Please enter valid login details.</div>';return;}
    const users=readStore(STORAGE.users,[]), user=users.find(u=>(u.email===id.value.trim().toLowerCase()||u.mobile===id.value.trim())&&u.password===pw.value);
    if(!user){msg.innerHTML='<div class="alert alert-danger">Account not found or password is incorrect. Please check your details or sign up.</div>';return;}
    writeStore(STORAGE.current,{email:user.email});msg.innerHTML='<div class="alert alert-success">Login successful!</div>';setTimeout(()=>location.href="menu.html",400);
  });
  document.getElementById("forgotLink").addEventListener("click",e=>{e.preventDefault();alert("Demo app: password recovery is not connected. Please sign up again using a different email, or contact your project administrator.");});
}
function initMenu(){
  const grid=document.getElementById("menuGrid");if(!grid)return;
  function render(){
    const term=document.getElementById("foodSearch").value.trim().toLowerCase();
    const list=dishes.filter(d=>(d.name+" "+d.restaurant+" "+d.tag).toLowerCase().includes(term));
    grid.innerHTML=list.length?list.map(d=>`<div class="col-sm-6 col-lg-3"><article class="food-card"><img src="${d.img}" alt="${d.name}" loading="lazy" onerror="this.src='https://placehold.co/600x400?text=Food'"><div class="card-body"><div class="d-flex justify-content-between align-items-center mb-2"><span class="food-tag">${d.tag}</span><span class="price">${money(d.price)}</span></div><h3>${d.name}</h3><p class="text-secondary small mb-3">${d.restaurant}</p><label class="d-flex gap-2 align-items-center small mb-3"><input type="checkbox" class="form-check-input dish-check" value="${d.id}"> Select this item</label><button class="btn btn-tasty w-100 add-dish" data-id="${d.id}">Add to cart</button></div></article></div>`).join(""):'<div class="col-12"><div class="alert alert-light">No dishes found. Try another search.</div></div>';
    grid.querySelectorAll(".add-dish").forEach(btn=>btn.addEventListener("click",()=>addDish(btn.dataset.id,grid.querySelector(`.dish-check[value="${btn.dataset.id}"]`).checked)));
    updateCartCount();
  }
  function addDish(id,selected){const dish=dishes.find(d=>d.id===id);const cart=getCart();const found=cart.find(x=>x.id===id);if(found)found.qty++;else cart.push({id:dish.id,qty:1});setCart(cart);document.getElementById("menuMessage").innerHTML=`<div class="alert alert-success">${dish.name} added to cart${selected?" (selected item)":""}.</div>`;}
  document.getElementById("foodSearch").addEventListener("input",render);render();
}
function initCart(){
  const host=document.getElementById("cartItems");if(!host)return;
  function render(){
    const cart=getCart();let subtotal=0;
    if(!cart.length){host.innerHTML='<div class="text-center py-5"><div style="font-size:3rem">🛒</div><h2 class="h5 mt-3">Your cart is empty</h2><p class="text-secondary">Add something delicious from the menu.</p><a class="btn btn-tasty" href="menu.html">Explore menu</a></div>';}
    else host.innerHTML=cart.map(item=>{const d=dishes.find(x=>x.id===item.id);if(!d)return"";subtotal+=d.price*item.qty;return `<div class="cart-row"><img class="cart-thumb" src="${d.img}" alt="${d.name}"><div class="cart-info"><strong>${d.name}</strong><div class="small text-secondary">${d.restaurant}</div><div class="price mt-1">${money(d.price*item.qty)}</div></div><label class="small">Qty<input class="form-control form-control-sm quantity-input" type="number" min="1" max="20" value="${item.qty}" data-id="${item.id}" aria-label="Quantity for ${d.name}"></label><button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}">Remove</button></div>`;}).join("");
    const fee=cart.length?30:0;document.getElementById("cartSubtotal").textContent=money(subtotal);document.getElementById("deliveryFee").textContent=money(fee);document.getElementById("cartTotal").textContent=money(subtotal+fee);
    document.getElementById("checkoutBtn").classList.toggle("disabled",!cart.length);document.getElementById("checkoutBtn").setAttribute("aria-disabled",String(!cart.length));
    host.querySelectorAll(".quantity-input").forEach(input=>input.addEventListener("change",()=>{let n=Number(input.value);if(!Number.isInteger(n)||n<1||n>20){alert("Quantity must be between 1 and 20.");render();return;}const next=getCart();const item=next.find(x=>x.id===input.dataset.id);if(item)item.qty=n;setCart(next);render();}));
    host.querySelectorAll(".remove-item").forEach(btn=>btn.addEventListener("click",()=>{setCart(getCart().filter(x=>x.id!==btn.dataset.id));render();}));
  }
  document.getElementById("checkoutBtn").addEventListener("click",e=>{if(!getCart().length){e.preventDefault();}});
  render();
}
function initPayment(){
  const form=document.getElementById("paymentForm");if(!form)return;
  const cart=getCart(),summary=document.getElementById("paymentSummary");
  if(!cart.length){summary.innerHTML='<p class="mb-2">Your cart is empty.</p><a href="menu.html" class="btn btn-tasty">Choose food</a>';form.classList.add("d-none");return;}
  const subtotal=cart.reduce((sum,item)=>{const d=dishes.find(x=>x.id===item.id);return sum+(d?d.price*item.qty:0);},0),total=subtotal+30;
  summary.innerHTML=`<div class="d-flex justify-content-between"><span>Items (${cart.reduce((n,x)=>n+x.qty,0)})</span><strong>${money(subtotal)}</strong></div><div class="d-flex justify-content-between mt-2"><span>Delivery fee</span><strong>${money(30)}</strong></div><hr><div class="d-flex justify-content-between fs-5"><strong>Total to pay</strong><strong>${money(total)}</strong></div>`;
  const current=readStore(STORAGE.current,null),users=readStore(STORAGE.users,[]),user=current&&users.find(u=>u.email===current.email);
  if(user){document.getElementById("deliveryName").value=user.firstName+" "+user.lastName;document.getElementById("deliveryPhone").value=user.mobile;document.getElementById("deliveryAddress").value=[user.address1,user.address2,user.city,user.state,user.pincode].filter(Boolean).join(", ");}
  form.querySelectorAll("input,textarea").forEach(el=>{el.addEventListener("input",()=>setValidity(el,el.checkValidity()));el.addEventListener("change",()=>setValidity(el,el.checkValidity()));});
  form.addEventListener("submit",e=>{e.preventDefault();let ok=true;form.querySelectorAll("input[required],textarea[required]").forEach(el=>{const valid=el.checkValidity();setValidity(el,valid);if(!valid)ok=false;});if(!ok){document.getElementById("paymentMessage").innerHTML='<div class="alert alert-danger">Please complete the delivery details.</div>';return;}
    const orderNo="TG"+Date.now().toString().slice(-8),order={orderNo,items:cart,total,payment:"Cash on Delivery",name:document.getElementById("deliveryName").value.trim(),phone:document.getElementById("deliveryPhone").value.trim(),address:document.getElementById("deliveryAddress").value.trim(),createdAt:new Date().toISOString()};
    const orders=readStore(STORAGE.orders,[]);orders.push(order);writeStore(STORAGE.orders,orders);setCart([]);form.classList.add("d-none");document.getElementById("paymentSummary").classList.add("d-none");document.getElementById("orderNumberText").textContent=`Your order number is ${orderNo}. Total: ${money(total)}.`;document.getElementById("orderSuccess").classList.remove("d-none");
  });
}
document.addEventListener("DOMContentLoaded",()=>{initSignup();initLogin();initMenu();initCart();initPayment();updateCartCount();});