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

// Add the event listeners
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
          <button>Select options</button>
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
      fav_btn.innerHTML = '<i class="fa-regular fa-heart"></i>'
      delete_btn.addEventListener("click", () => {

        deleteData(item.itemId, "cards")
      });
      action_div.appendChild(delete_btn);
      action_div.appendChild(fav_btn);

      card_main.appendChild(card);
    });



  })

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