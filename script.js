
let cart = [];

// REGISTER
function register() {
    let name = document.getElementById("rname").value.trim();
    let email = document.getElementById("remail").value.trim();
    let pass = document.getElementById("rpass").value;

    if (!name || !email || !pass)
        return alert("Please fill all details");

    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("password", pass);

    alert("Registration Successful!");
    showLogin();
}

function showRegister() {
    document.getElementById("login").style.display = "none";
    document.getElementById("register").style.display = "block";
}

function showLogin() {
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "block";
}

// LOGIN
function login() {
    let email = document.getElementById("lemail").value.trim();
    let pass = document.getElementById("lpass").value;

    if (!localStorage.getItem("email"))
        return alert("Please Register First!");

    if (email === localStorage.getItem("email") &&
        pass === localStorage.getItem("password")) {
        document.getElementById("auth").style.display = "none";
        document.getElementById("app").style.display = "block";
    } else {
        alert("Invalid Email or Password!");
    }
}

// ADD FOOD
function add(name, price, button) {
    let food = cart.find(item => item.name === name);

    if (food) {
        food.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    button.innerText = "✓ Added";
    button.style.background = "green";

    let selected = cart.find(item => item.name === name);
    button.parentElement.querySelector(".count").innerText =
        "Selected: " + selected.quantity;

    showCart();
}

// SHOW CART
function showCart() {
    let result = "";
    let total = 0;

    if (cart.length === 0) {
        result = "<p>No items selected</p>";
    }

    cart.forEach((food, index) => {
        let amount = food.price * food.quantity;
        total += amount;

        result += `
        <div class="cartItem">
            <b>${food.name}</b>
            <p>₹${food.price} × ${food.quantity} = ₹${amount}</p>
            <button onclick="decrease(${index})">−</button>
            <span>${food.quantity}</span>
            <button onclick="increase(${index})">+</button>
            <button onclick="removeFood(${index})">Remove</button>
        </div>`;
    });

    document.getElementById("cart").innerHTML = result;
    document.getElementById("total").innerText = total;
}

// PLUS
function increase(index) {
    cart[index].quantity++;
    updateFoodCount();
    showCart();
}

// MINUS
function decrease(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }

    updateFoodCount();
    showCart();
}

// REMOVE
function removeFood(index) {
    cart.splice(index, 1);
    updateFoodCount();
    showCart();
}

// UPDATE FOOD COUNTS
function updateFoodCount() {
    document.querySelectorAll(".food").forEach(card => {
        let name = card.querySelector("h3").innerText;
        let item = cart.find(food => food.name === name);
        let button = card.querySelector("button");

        card.querySelector(".count").innerText =
            "Selected: " + (item ? item.quantity : 0);

        button.innerText = item ? "✓ Added" : "Add to Cart";
        button.style.background = item ? "green" : "red";
    });
}

// SUCCESS NOTIFICATION DESIGN
function showSuccess(name, total, payment) {
    let old = document.getElementById("orderSuccess");
    if (old) old.remove();

    let popup = document.createElement("div");
    popup.id = "orderSuccess";

    popup.style.cssText = `
        position:fixed; inset:0; z-index:9999;
        background:rgba(0,0,0,.85);
        display:flex; align-items:center; justify-content:center;
        padding:20px; font-family:Arial;
    `;

    popup.innerHTML = `
        <div style="
            background:#222; color:white; padding:30px;
            border-radius:15px; text-align:center;
            max-width:380px; width:100%;
            border:2px solid #22c55e;
        ">
            <div style="font-size:55px;">✅</div>
            <h2 style="color:#22c55e;">Order Successful!</h2>
            <p>Thank you, ${escapeText(name)}!</p>
            <p>Your order has been placed successfully.</p>
            <p>Total Amount: <b>₹${total}</b></p>
            <p>Payment: ${escapeText(payment)}</p>
            <button id="continueOrder" style="
                background:#22c55e; color:white; border:0;
                padding:13px 22px; border-radius:6px;
                cursor:pointer; font-size:16px; margin-top:12px;
            ">Continue Ordering 🍔</button>
        </div>
    `;

    document.body.appendChild(popup);

    document.getElementById("continueOrder").onclick = function () {
        cart = [];
        showCart();
        updateFoodCount();

        document.getElementById("customerName").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("address").value = "";
        document.getElementById("payment").selectedIndex = 0;

        popup.remove();

        document.querySelector(".heading").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };
}

// SAFELY DISPLAY CUSTOMER DETAILS
function escapeText(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// PLACE ORDER
function placeOrder() {
    let name = document.getElementById("customerName").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let address = document.getElementById("address").value.trim();
    let payment = document.getElementById("payment").value;

    if (cart.length === 0)
        return alert("Please select food!");

    if (!name || !phone || !address)
        return alert("Please enter delivery details!");

    if (!/^\d{10}$/.test(phone))
        return alert("Please enter a valid 10-digit phone number!");

    if (!payment)
        return alert("Please select payment method!");

    let total = cart.reduce(
        (sum, food) => sum + food.price * food.quantity, 0
    );

    showSuccess(name, total, payment);
}

// INITIAL CART DISPLAY
showCart();
