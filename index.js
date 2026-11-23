import { menuArray, orderMap, clearOrderMap } from "./data.js";

document.addEventListener("click", elementFinder);
document.addEventListener("submit", handlePayBtn);
document.addEventListener("keydown", handletab);

// Ensure the tab key is always in focusing on the interactive elements in the dialog
function handletab(event) {
  if (event.key === "Tab") {
    if (event.target.id === "pay-btn" && !event.shiftKey) {
      event.preventDefault();
      document.querySelector("#card-dialog-form > #name").focus();
    } else if (event.target.id === "name" && event.shiftKey) {
      event.preventDefault();
      document.querySelector("#card-dialog-form > #pay-btn").focus();
    }
  }
}

// Finds which element was clicked and calls helper function for further actions
function elementFinder(event) {
  const el = event.target;
  if (el.closest(".add-btn")) {
    handleAddBtn(el.closest(".add-btn"));
  } else if (el.classList.contains("remove-btn")) {
    event.preventDefault();
    handleRemoveBtn(el);
  } else if (el.id === "complete-order-btn") {
    handleCompleteBn();
  }
}

// Accounts the added item to the database, and calls helper function to
// visibilly display the result
function handleAddBtn(addBtn) {
  const item = menuArray.filter((e) => e.id === Number(addBtn.dataset.item))[0];
  let itemSummary = orderMap.get(item.name);

  if (itemSummary) {
    itemSummary.totalPrice += item.price;
    itemSummary.quantity++;
  } else {
    itemSummary = {
      totalPrice: item.price,
      quantity: 1,
    };
  }

  orderMap.set(item.name, itemSummary);

  renderReceipt(orderMap, item.name, "added");
}

// Display the receipt list visibilly and create annoucements for user's using screen reader
function renderReceipt(
  orderMap,
  targetItem,
  actionOnTargetItem,
  hasPayment = true,
) {
  const receiptList = document.getElementById("receipt-list");
  let receiptContentHtml = "";
  let totalpay = 0;
  orderMap.forEach((itemSummary, itemName) => {
    totalpay += itemSummary.totalPrice;
    receiptContentHtml += `
      <li class="display-flex receipt-item-container" aria-label="${itemName} order">
        <div class="display-flex receipt-item-desc-container">
          <h3 class="font-weight-regular">${itemName}</h3>
            <div class="units font-inter">
              <span class="units-label">Unit: </span
              ><span class="units-value">${itemSummary.quantity}</span>
            </div>
          <button class="remove-btn font-verdana" data-item="${itemName}" aria-label="Remove ${itemName}, button">remove</button>
        </div>
        <p class="font-size-20px price">$${itemSummary.totalPrice}</p>
      </li> `;
  });

  receiptContentHtml += `
    <div class="border-bottom-black"></div>
    <li class="display-flex receipt-item-container">
      <h3 class="display-flex receipt-item-desc-container font-weight-regular">Total price:</h3>
      <p class="font-size-20px">
        $${totalpay}
      </p>
    </li> `;

  receiptList.innerHTML = receiptContentHtml;

  // Notify the user their item has been added or that they removed the last item in their cart
  const announcement = document.querySelector(".visually-hidden");
  if (hasPayment) {
    announcement.textContent = `${targetItem} ${actionOnTargetItem}, new payment is $${totalpay}`;
  } else {
    announcement.textContent = `${targetItem} ${actionOnTargetItem}, no payment due`;
  }

  // Show the receipt card when the user selects their first item or
  // hide it when the user removes their last selected item
  const receipt = document.getElementById("checkout-section");
  if (receipt.classList.contains("display-none") || !orderMap.size) {
    receipt.classList.toggle("display-none");
  }

  const orderConfirm = document.querySelector(".order-confirmation");
  if (!orderConfirm.classList.contains("visually-hidden")) {
    orderConfirm.classList.toggle("visually-hidden");
    document.querySelector(".order-confirmation").textContent = "";
  }
}

// Updates the ordered items in the database to render the receipt correctly
function handleRemoveBtn(removeBtn) {
  // Variables used to find the sibling btn when the
  // clicked btn is to be removed
  let hasCurrBtn = true;
  let sibilingName = null;
  let getNextItem = false;
  let getPrevItem = true;

  orderMap.forEach((itemSummary, itemName, map) => {
    if (itemName === removeBtn.dataset.item) {
      itemSummary.totalPrice -= itemSummary.totalPrice / itemSummary.quantity;
      itemSummary.quantity--;
      if (itemSummary.quantity == 0) {
        map.delete(itemName);
        hasCurrBtn = false;
      }
      const hasPayment = map.size ? true : false;
      renderReceipt(map, itemName, "removed", hasPayment);
      getNextItem = !getNextItem;
    } else if (getNextItem) {
      sibilingName = itemName;
      getNextItem = !getNextItem;
      getPrevItem = !getPrevItem;
    } else if (getPrevItem) {
      sibilingName = itemName;
    }
  });

  // Decide which element to focus on after the btn is clicked
  if (!orderMap.size) {
    document.querySelector("#main-menu").focus();
  } else {
    const btnToFocus =
      document.querySelector(`button[data-item="${removeBtn.dataset.item}"]`) ||
      document.querySelector(`button[data-item="${sibilingName}"]`);
    btnToFocus.focus();
  }
}

function handleCompleteBn() {
  document.getElementById("card-dialog").showModal();
}

// Render a confirmation message indicating the order has been completed, and
// closes the dialog
function handlePayBtn(event) {
  const el = event.target;
  if (el.id === "card-dialog-form") {
    event.preventDefault();
    document.getElementById("card-dialog").close();

    const formObj = Object.fromEntries(new FormData(el));
    const orderConfirm = document.querySelector(".order-confirmation");
    orderConfirm.textContent = `Thanks, ${formObj.name}! Your order is on its way!`;
    orderConfirm.classList.toggle("visually-hidden");
    orderConfirm.focus();

    document
      .getElementById("checkout-section")
      .classList.toggle("display-none");
  }

  // clear previous order history
  clearOrderMap();
  document.querySelector(".visually-hidden").textContent = "";
}

// Displays the whole available menu
function renderMenu(menuArray) {
  const menuHtml = menuArray
    .map((item) => {
      const ingredientsText =
        item.name == "Pizza"
          ? item.ingredients.join(",")
          : item.ingredients.join(", ");
      return `
        <li
          class="item-container position-relative display-flex"
          aria-label="${item.name}"
        >
          <div class="item-inner-container">
            <img
              class="item-image-size"
              src="${item.image}"
              alt="${item.imageAlt}"
              width="79"
              height="79"
            />
            <div class="item-inner-desc-container">
              <h2 class="font-weight-regular">${item.name}</h2>
              <p class="color-light">${ingredientsText}</p>
              <p class="font-size-20px">$${item.price}</p>
            </div>
          </div>
          <button
            class="add-btn font-inter"
            data-item="${item.id}"
            aria-label="Add ${item.name}, button"
          >
            <span class="position-relative">+</span>
          </button>
        </li> `;
    })
    .join("");

  const menu = document.getElementById("menu");
  menu.innerHTML = menuHtml;
}

renderMenu(menuArray);
