new Swiper(".mySwiper", {});

const header = document.querySelector("header");
const toggleClass = "is-sticky";

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 150) {
    header.classList.add(toggleClass);
  } else {
    header.classList.remove(toggleClass);
  }
});


let mouseDown = false;
let startX, scrollLeft;
const slider = document.querySelector('.card-main-div');

const startDragging = (e) => {
  mouseDown = true;
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
}

const stopDragging = (e) => {
  mouseDown = false;
}

const move = (e) => {
  e.preventDefault();
  if (!mouseDown) { return; }
  const x = e.pageX - slider.offsetLeft;
  const scroll = x - startX;
  slider.scrollLeft = scrollLeft - scroll;
}

slider.addEventListener('mousemove', move, false);
slider.addEventListener('mousedown', startDragging, false);
slider.addEventListener('mouseup', stopDragging, false);
slider.addEventListener('mouseleave', stopDragging, false);


const card_img = document.querySelector(".card-top img");
const card = document.querySelector(".card");

const action_btn = document.querySelector(".action-div button");




document.querySelector(".openbtn").addEventListener("click", () => {
  document.querySelector("#mySidebar").style.width = "350px";
 

})
document.querySelector(".closebtn").addEventListener("click", () => {
  document.querySelector("#mySidebar").style.width = "0";


})


let btn = document.querySelector(".scrollBtn");


window.onscroll = function () { scrollFunction() };

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    btn.style.visibility = "visible";
    btn.style.transform = "translateX(0)"
  } else {
    btn.style.visibility = "hidden";
    btn.style.transform = "translateX(100px)"
  }
}



btn.addEventListener("click", () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
})




const BASE_URL = "http://localhost:8080";
const card_main = document.querySelector(".card-main-div");

async function getData(url, endpoint) {
  const response = await fetch(`${url}/${endpoint}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
};



getData(BASE_URL, "cards")
  .then((data) => {

    data.forEach(item => {

      let card = document.createElement('div');
      card.classList.add('card', item.itemId);

      let action_div = document.createElement('div');
      action_div.classList.add('action-div');
      action_div.setAttribute('action_id', item.itemId);

      let card_top = document.createElement('div');
      card_top.classList.add('card-top', item.itemId);
      card_top.style.backgroundImage = `url(${item.image})`;
      card_top.appendChild(action_div);
      card.appendChild(card_top);

      let card_bottom = document.createElement('div');
      card_bottom.classList.add('card-bottom');
      card_bottom.innerHTML = `
          <p>${item.name}</p>
          <div class="stars"></div>
          <span>$${item.price}.00</span>
          <button class="addToCardBtn-${item.itemId}">Select options</button>
      `;
      card.appendChild(card_bottom);

      let stars = card_bottom.querySelector('.stars');
      for (let i = 0; i < item.stars; i++) {
        stars.innerHTML += `<i class="fa-solid fa-star"></i>`;
      }
      for (let j = 0; j < (5 - item.stars); j++) {
        stars.innerHTML += `<i class="fa-regular fa-star"></i>`;
      }

      card.addEventListener("mouseover", () => {
        card_top.style.backgroundImage = `url(${item.zoomImage})`;
        action_div.style.transform = "translateX(0px)";
        action_div.style.opacity = 1;
      });

      card.addEventListener("mouseout", () => {
        card_top.style.backgroundImage = `url(${item.image})`;
        action_div.style.opacity = 0;
        action_div.style.transform = "translateX(20px)";
      });

      let delete_btn = document.createElement('button');
      delete_btn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
      let fav_btn = document.createElement('button');
      fav_btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
      delete_btn.addEventListener("click", () => {
        deleteData(item.itemId, "cards");
      });
      action_div.appendChild(delete_btn);
      action_div.appendChild(fav_btn);

      card_main.appendChild(card);

      let addBtn = card.querySelector(`.addToCardBtn-${item.itemId}`);
      addBtn.addEventListener("click", () => {
        let storedItems = JSON.parse(localStorage.getItem("items")) || [];
        storedItems.push(item);
        localStorage.setItem("items", JSON.stringify(storedItems));
        fillbasket();
      });
    });
  });

async function deleteData(id, endpoint) {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}?itemId=${id}`, {
      method: "DELETE"
    });
    console.log(response);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (error) {
    console.error("Error deleting data:", error);
  }
}
fillbasket();

let storage = JSON.parse(localStorage.getItem('items')) || [];

function fillbasket() {
  const basket = document.querySelector(".sidebar-empty");
  const sideBarBottom = document.querySelector(".sidebar-bottom");

  let storage = JSON.parse(localStorage.getItem('items')) || [];
  let itemCounts = {};
  let totalItemCount = 0;
  let totalItemPrice = 0
  let basketDiv = document.querySelector(".openbtn");
  storage.forEach(item => {
    if (itemCounts[item.itemId]) {
      itemCounts[item.itemId].count += 1;
    } else {
      itemCounts[item.itemId] = { ...item, count: 1 };
    }
    totalItemCount += 1;
    totalItemPrice = totalItemPrice + item.price;

  });

  basketDiv.innerHTML = ` <i class="fa-solid fa-bag-shopping"></i>
                    <p>
                        <span>${totalItemCount}</span>
                        /
                        <span>$${totalItemPrice}.00</span>
                    </p>`;
  basket.innerHTML = "";
  Object.values(itemCounts).forEach((item) => {
    basket.innerHTML += `
    <div class="item">
                         <div class="item-left"><img
                                 src="${item.image}">
                         </div>
                         <div class="item-right">
                             <div class="item-right-top">
                                 <p>${item.name} </p>
                             </div>
                             <div class="item-right-bottom">
                                 <p><span>${item.count} x </span> $${item.price}</p>
                             </div>
                         </div>
                         <div class="item-delete-${item.itemId}"> <i class="fa-solid fa-x"></i></div>
                     </div>
    `;
  });

  if (basket.innerHTML == "") {
    basket.innerHTML = `<i class="fa-solid fa-cart-shopping"></i>

                    <p>No products in the cart.</p>
                    <button class="return-btn">Return To Shop</button>`

    basket.style.justifyContent = "center";
  }
  else {
    basket.style.removeProperty("justify-content");
    sideBarBottom.innerHTML = `<div class="price-div">
    <p>Subtotal:</p>
    <p>$${totalItemPrice}.00</p>
    </div>
    <div><button>Checkout</button></div>`
  }
  storage.forEach((item) => {
    let deleteBtn = document.querySelector(`.item-delete-${item.itemId}`);
    let itemIdToRemove = item.itemId;
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        storage = storage.filter(item => item.itemId !== itemIdToRemove);
        localStorage.setItem('items', JSON.stringify(storage));
        deleteBtn.parentElement.remove();
        fillbasket();
      });
    }
  });
}




