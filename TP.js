// Estado 
var cartCount = 0;                
var cartCountElement = null;

// Catálogo principal
var productos = [
  {
    id: 0,
    nombre: "Mate Imperial Cuero",
    material: "Calabaza y Cuero",
    precio: 42000,
    imagenes: ["mateimperialpremium.jpg","mateimperialpremium2.jpg","mateimperial4.jpg"],
    idx: 0
  },
  {
    id: 1,
    nombre: "Mate Torpedo Calabaza",
    material: "Calabaza y Cuero",
    precio: 35000,
    imagenes: ["matetorpedo5.jpg","matetorpedo6.jpg","matetorpedo7.jpg"],
    idx: 0
  },
  {
    id: 2,
    nombre: "Mate Camionero Full",
    material: "Madera",
    precio: 18000,
    imagenes: ["matecamionero1.jpg","matecamionero2.jpg"],
    idx: 0
  }
];

// Promo 
var PROMO_VERANO = {
  id: 99,
  nombre: "Promo Verano: Mate Imperial Algarrobo + Matera + Bombilla",
  material: "Combo especial",
  precio: 70000,
  imagenes: ["matepromo1.jpg"],
};

// Utilidad precios 
function precioARS(n){
  try { return n.toLocaleString("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}); }
  catch(e){ return "$ " + n; }
}

// Slider de imágenes 
function cambiarImagen(indiceProducto, direccion){
  var p = productos[indiceProducto];
  var total = p.imagenes.length;
  p.idx = p.idx + direccion;
  if (p.idx < 0) p.idx = total - 1;
  if (p.idx >= total) p.idx = 0;

  var img = document.getElementById("img-" + p.id);
  if (img) { img.src = p.imagenes[p.idx]; }
}

//  Render catálogo 
function renderProductos(){
  var grid = document.getElementById("productosGrid");
  if (!grid) return;
  grid.innerHTML = "";

  for (var i = 0; i < productos.length; i++){
    var p = productos[i];

    var card = document.createElement("article");
    card.className = "card";

    var media = document.createElement("div");
    media.className = "media";

    var img = document.createElement("img");
    img.id = "img-" + p.id;
    img.alt = p.nombre;
    img.src = p.imagenes[p.idx];

    var btnPrev = document.createElement("button");
    btnPrev.className = "ctrl prev";
    btnPrev.textContent = "❮";
    (function(indiceGuardado){
      btnPrev.addEventListener("click", function(){ cambiarImagen(indiceGuardado, -1); });
    })(i);

    var btnNext = document.createElement("button");
    btnNext.className = "ctrl next";
    btnNext.textContent = "❯";
    (function(indiceGuardado){
      btnNext.addEventListener("click", function(){ cambiarImagen(indiceGuardado, 1); });
    })(i);

    media.appendChild(img);
    media.appendChild(btnPrev);
    media.appendChild(btnNext);

    var body = document.createElement("div");
    body.className = "body";

    var h3 = document.createElement("h3");
    h3.textContent = p.nombre;

    var meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = p.material;

    var price = document.createElement("div");
    price.className = "price";
    price.textContent = precioARS(p.precio);

    body.appendChild(h3);
    body.appendChild(meta);
    body.appendChild(price);

    var actions = document.createElement("div");
    actions.className = "actions";

    var btnAdd = document.createElement("button");
   btnAdd.className = "animated-button";
   btnAdd.innerHTML = `
  <span class="text">Agregar al carrito</span>
  <svg class="arr-1" viewBox="0 0 46 16">
    <path d="M0 8h45M45 8l-8-8M45 8l-8 8"></path>
  </svg>
  <svg class="arr-2" viewBox="0 0 46 16">
    <path d="M0 8h45M45 8l-8-8M45 8l-8 8"></path>
  </svg>
  <span class="circle"></span>
`;

    btnAdd.textContent = "Agregar al carrito";
    (function(idGuardado){
      btnAdd.addEventListener("click", function(){ addToCartById(idGuardado); });
    })(p.id);

    var btnDetalle = document.createElement("button");
    btnDetalle.className = "animated-button-gray";
    btnDetalle.innerHTML = `
  <span class="text">Detalle</span>
  <svg class="arr-1" viewBox="0 0 46 16">
    <path d="M0 8h45M45 8l-8-8M45 8l-8 8"></path>
  </svg>
  <svg class="arr-2" viewBox="0 0 46 16">
    <path d="M0 8h45M45 8l-8-8M45 8l-8 8"></path>
  </svg>
  <span class="circle"></span>`;
    (function(prod){
      btnDetalle.addEventListener("click", function(){
        alert(prod.nombre + "\n" + prod.material + "\n" + precioARS(prod.precio));
      });
    })(p);

    actions.appendChild(btnAdd);
    actions.appendChild(btnDetalle);

    card.appendChild(media);
    card.appendChild(body);
    card.appendChild(actions);

    grid.appendChild(card);
  }
}

/* Carrito */
var cart = [];                 
var cartOpen = false;
var cartPanel = null;
var cartItems = null;
var cartTotalEl = null;
var cartCerrarBtn = null;
var cartVaciarBtn = null;
var cartComprarBtn = null;

// buscar en carrito por id
function cartBuscarIndex(id){
  for (var i=0; i<cart.length; i++){ if (cart[i].id === id) return i; }
  return -1;
}
// abrir/cerrar panel
function cartMostrar(show){
  cartPanel.style.display = show ? "block" : "none";
  cartOpen = show;
}
// sumar/restar/eliminar/vaciar
function cartSumar(id){
  var i = cartBuscarIndex(id);
  if (i === -1) return;
  cart[i].qty = cart[i].qty + 1;
  cartRender();
}
function cartRestar(id){
  var i = cartBuscarIndex(id);
  if (i === -1) return;
  cart[i].qty = cart[i].qty - 1;
  if (cart[i].qty <= 0){ cart.splice(i,1); }
  cartRender();
}
function cartEliminar(id){
  var i = cartBuscarIndex(id);
  if (i === -1) return;
  cart.splice(i,1);
  cartRender();
}
function cartVaciar(){
  cart = [];
  cartRender();
}
// totales/contador
function cartCalculos(){
  var total = 0;
  var unidades = 0;
  for (var i=0; i<cart.length; i++){
    total += cart[i].precio * cart[i].qty;
    unidades += cart[i].qty;
  }
  return { total: total, unidades: unidades };
}
// render carrito
function cartRender(){
  cartItems.innerHTML = "";
  for (var i=0; i<cart.length; i++){
    var item = cart[i];

    var row = document.createElement("div");
    row.className = "cartRow";

    var colInfo = document.createElement("div");
    var t1 = document.createElement("div");
    t1.className = "cartTitle";
    t1.textContent = item.nombre;
    var t2 = document.createElement("div");
    t2.className = "meta";
    t2.textContent = precioARS(item.precio);

    colInfo.appendChild(t1);
    colInfo.appendChild(t2);

    var colCtrls = document.createElement("div");
    colCtrls.className = "cartControls";

    var bMenos = document.createElement("button");
    bMenos.className = "cartBtn";
    bMenos.textContent = "−";
    (function(idGuardado){
      bMenos.addEventListener("click", function(){ cartRestar(idGuardado); });
    })(item.id);

    var qty = document.createElement("span");
    qty.textContent = "x" + item.qty;

    var bMas = document.createElement("button");
    bMas.className = "cartBtn";
    bMas.textContent = "+";
    (function(idGuardado){
      bMas.addEventListener("click", function(){ cartSumar(idGuardado); });
    })(item.id);

    var bDel = document.createElement("button");
    bDel.className = "cartDel";
    bDel.textContent = "Eliminar";
    (function(idGuardado){
      bDel.addEventListener("click", function(){ cartEliminar(idGuardado); });
    })(item.id);

    colCtrls.appendChild(bMenos);
    colCtrls.appendChild(qty);
    colCtrls.appendChild(bMas);
    colCtrls.appendChild(bDel);

    row.appendChild(colInfo);
    row.appendChild(colCtrls);

    cartItems.appendChild(row);
  }

  var calc = cartCalculos();
  cartTotalEl.textContent = "Total: " + precioARS(calc.total);

  var cc = document.getElementById("cartCount");
  if (cc){ cc.textContent = calc.unidades; }

  if (calc.unidades > 0 && !cartOpen){
  }
}

// agregar por objeto
function addToCart(producto){
  var iCart = cartBuscarIndex(producto.id);
  if (iCart === -1){
    cart.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, qty: 1 });
  } else {
    cart[iCart].qty = cart[iCart].qty + 1;
  }
  cartRender();
}

// agregar por ID 
function addToCartById(idProducto){
  var p = null;
  for (var i=0; i<productos.length; i++){
    if (productos[i].id === idProducto){ p = productos[i]; break; }
  }
  if (!p) return;
  addToCart(p);
}

//  Init general 
function cartInit(){
  cartPanel = document.getElementById("cartPanel");
  cartItems = document.getElementById("cartItems");
  cartTotalEl = document.getElementById("cartTotal");
  cartCerrarBtn = document.getElementById("cartCerrar");
  cartVaciarBtn = document.getElementById("cartVaciar");
  cartComprarBtn = document.getElementById("cartComprar");

  var cartBtn = document.getElementById("cartBtn");
  if (cartBtn){
    cartBtn.addEventListener("click", function(){cartMostrar(!cartOpen); });
  }
  if (cartCerrarBtn){cartCerrarBtn.addEventListener("click", function(){ cartMostrar(false); }); }
  if (cartVaciarBtn){cartVaciarBtn.addEventListener("click", cartVaciar); }
  if (cartComprarBtn){
    cartComprarBtn.addEventListener("click", function(){
      alert("¡Gracias por tu compra!");
      cartVaciar();
      cartMostrar(false);
    });
  }

  cartRender();
}

// DOMContentLoaded
document.addEventListener("DOMContentLoaded", function(){
  cartCountElement = document.getElementById("cartCount");

  var btnHamb = document.getElementById("btnHamb");
  var menu = document.getElementById("menu");
  if (btnHamb && menu){
    btnHamb.addEventListener("click", function(){ menu.classList.toggle("show"); });
  }

  // render catálogo y carrito
  renderProductos();
  cartInit();

  // botón de la sección promos
  var btnPromo = document.getElementById("btnPromo");
  if (btnPromo){
    btnPromo.addEventListener("click", function(){
      addToCart(PROMO_VERANO);
    });
  }

  console.log("TP.js inicializado ✅");
});
