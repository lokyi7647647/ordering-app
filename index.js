import { menuArray, orderMap } from "./data.js";

const menu = document.getElementById("menu");
document.addEventListener("click", elementFinder);

function elementFinder(event) {
  let el = "";
  if ((el = event.target.closest(".add-btn"))) {
    handleAddBtn(el);
  }
}

function handleAddBtn(addBtn) {
  const item = menuArray.filter((e) => e.id === Number(addBtn.dataset.item))[0];
  let totalPrice = orderMap.get(item.name);

  if (totalPrice) {
    totalPrice += item.price;
  } else {
    totalPrice = item.price;
  }

  orderMap.set(item.name, totalPrice);
  // console.log(orderMap);

  renderCart();
}

function renderCart(orderMap) {
  // let ordersHtml = ''
  // orderMap.forEach((order) => {
  //   ordersHtml += `
  //   `
  // })
  // `
  // <h2>Your order</h2>
  //   <dl>
  //     ${ordersHtml}
  //   </dl>
  // `;
}

function renderMenu(menuArray) {
  const menuHtml = menuArray
    .map((item) => {
      const ingredientsText =
        item.name == "Pizza"
          ? item.ingredients.join(",")
          : item.ingredients.join(", ");
      return `
            <li class="item-container position-relative display-flex">
                <div class="item-inner-container">
                    <img
                        class="item-image-size"
                        src=${item.image}
                        alt=${item.imageAlt}
                    />
                    <div class="item-inner-desc-container">
                        <h2 class="font-weight-regular">${item.name}</h2>
                        <p class="color-light">${ingredientsText}</p>
                        <p class="font-size-20px">$${item.price}</p>
                    </div>
                </div>
                <button class="add-btn" data-item=${item.id}>
                    <span class="position-relative">+</span>
                </button>
            </li> `;
    })
    .join("");

  menu.innerHTML = menuHtml;
}

renderMenu(menuArray);

// <span class="position-relative">+</span>
