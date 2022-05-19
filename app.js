/*
 * Storage Controller
 */
const StorageCtrl = (() => {
  //public methods
  return {
    storeItem: (item) => {
      let items;
      //check for nay items in local storage
      if (localStorage.getItem("items") === null) {
        items = [];
        //push new items
        items.push(item);

        //set local storage
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        //get what is in local storage
        items = JSON.parse(localStorage.getItem("items"));
        // push new item
        items.push(item);
        //reset local storage
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: () => {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        //get what is in local storage
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemFroStorage: (updatedItem) => {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });

      // reset ls
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: (id) => {
      let items = JSON.parse(localStorage.getItem("items"));

      // loop through items
      items.forEach((item, index) => {
        if (item.id === id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearAllItemsFromStroragge: () => {
      localStorage.clear();
    },
  };
})();

/*
 * Item Controller
 */
const ItemCtrl = (function () {
  /*
   * Item Constructor
   */
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  /*
   * Data Structure / State
   */
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };

  /*
   * Public methods
   */
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      /**
       * create ID
       */
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      /**
       * convert calories fro string to number
       */
      calories = parseInt(calories);
      /**
       * create new item
       */
      newItem = new Item(ID, name, calories);

      /**
       * add to items array
       */
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function (id) {
      let found = null;
      //loop through items
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function (name, calories) {
      //calories to number from string
      calories = parseInt(calories);

      let found = null;
      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function (id) {
      //get the ids
      const ids = data.items.map((item) => {
        return item.id;
      });
      //get the index
      const index = ids.indexOf(id);

      //remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
    getTotalColories: function () {
      let total = 0;

      /**
       * loop through items and add calories
       */
      data.items.forEach((item) => {
        total += item.calories;
      });
      /**
       * set total calories in data structure
       */
      data.totalCalories = total;

      return data.totalCalories;
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    logData: function () {
      return data;
    },
  };
})();

/*
 * UI Controller
 */
const UICtrl = (function () {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
  };
  /*
   * Public methods
   */
  return {
    populateItemList: function (items) {
      let html = "";

      items.forEach((item) => {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });
      /**
       * insert list items
       */
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    addListItem: function (item) {
      /**
       * Show List
       */
      document.querySelector(UISelectors.itemList).style.display = "block";

      /**
       * create li element
       */
      const li = document.createElement("li");
      /**
       * add class
       */
      li.className = "collection-item";
      /**
       * add id
       */
      li.id = `item-${item.id}`;
      /**
       * add html
       */
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;
      /**
       * insert the li item
       */
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // turn nodelist to array
      listItems = Array.from(listItems);
      listItems.forEach((listItem) => {
        const itemId = listItem.getAttribute("id");

        if (itemId === `item-${item.id}`) {
          document.querySelector(
            `#${itemId}`
          ).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;
        }
      });
    },
    deleteListItem: function (id) {
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },
    clearAllItems: function () {
      let lisItems = document.querySelectorAll(UISelectors.listItems);
      // turn node list to array
      listItems = Array.from(lisItems);
      lisItems.forEach((item) => {
        item.remove();
      });
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value =
        ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value =
        ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent =
        totalCalories;
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function () {
      return UISelectors;
    },
  };
})();

/*
 * App Controller
 */
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  /**
   * load events linsteners
   */
  const loadEventListeners = function () {
    /*
     * get ui selectors
     */
    const UISelectors = UICtrl.getSelectors();
    /*
     * Add item event
     */
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);
    /**
     * disable submit on enter
     */
    document.addEventListener("keypress", (e) => {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
    /**
     * Edit icon click event
     */
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);
    /**
     * Update item event
     */
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);
    /**
     * Delete item event
     */
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);
    /**
     * Back button event
     */
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);
    /**
     * Clear button event
     */
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
  };

  /**
   * Add item submit
   */
  const itemAddSubmit = function (e) {
    /**
     * Get form input from UIController
     */
    const input = UICtrl.getItemInput();
    /*
     * check for name and clories input
     */
    if (input.name && input.calories !== "") {
      /**
       * add item
       */
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      /**
       * add item to ui list
       */
      UICtrl.addListItem(newItem);
      /**
       * Get total calories
       */
      const totalCalories = ItemCtrl.getTotalColories();
      /**
       * add total calories to ui
       */
      UICtrl.showTotalCalories(totalCalories);
      /**
       * store in loacl storage
       */
      StorageCtrl.storeItem(newItem);
      /**
       * clear fields after insert
       */
      UICtrl.clearInput();
    }
    e.preventDefault();
  };

  /**
   * Update item submit
   */
  const itemEditClick = function (e) {
    // targeting the edit item icon from parent
    if (e.target.classList.contains("edit-item")) {
      /**
       * get list item id
       */
      const listId = e.target.parentNode.parentNode.id;
      // console.log(listId);
      //break into array
      const listIdArr = listId.split("-");
      //get the actual id
      const id = parseInt(listIdArr[1]);
      //get id
      const itemToEdit = ItemCtrl.getItemById(id);
      // console.log(itemToEdit);
      //set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // add item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  };

  /**
   * update item submit
   */
  const itemUpdateSubmit = function (e) {
    //get item input
    const input = UICtrl.getItemInput();
    //update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    //ui update
    UICtrl.updateListItem(updatedItem);

    /**
     * Get total calories
     */
    const totalCalories = ItemCtrl.getTotalColories();

    /**
     * add total calories to ui
     */
    UICtrl.showTotalCalories(totalCalories);

    /**
     * update item local storage
     */
    StorageCtrl.updateItemFroStorage(updatedItem);

    //clear input fields
    UICtrl.clearEditState();

    e.preventDefault();
  };

  /**
   * Delete item submit
   */
  const itemDeleteSubmit = function (e) {
    //get current item
    const currentItem = ItemCtrl.getCurrentItem();

    //delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    //delete from UI
    UICtrl.deleteListItem(currentItem.id);
    /**
     * Get total calories
     */
    const totalCalories = ItemCtrl.getTotalColories();

    /**
     * add total calories to ui
     */
    UICtrl.showTotalCalories(totalCalories);

    /**
     * delet from local storage
     */
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    //clear input fields
    UICtrl.clearEditState();

    e.preventDefault();
  };

  /**
   * Clear Items Event
   */
  const clearAllItemsClick = function (e) {
    //Delete all items from data structure
    ItemCtrl.clearAllItems();

    //remove from UI
    UICtrl.clearAllItems();
    /**
     * Get total calories
     */
    const totalCalories = ItemCtrl.getTotalColories();

    /**
     * add total calories to ui
     */
    UICtrl.showTotalCalories(totalCalories);

    StorageCtrl.clearAllItemsFromStroragge();

    // hide the UL
    UICtrl.hideList();

    e.preventDefault();
  };

  /*
   * Public methods
   */
  return {
    init: function () {
      /**
       * set initial state
       */
      UICtrl.clearEditState();
      /*
       * fetch items from data structure
       */
      const items = ItemCtrl.getItems();

      /**
       * check if any items
       */
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        /* *
         * populate list
         */
        UICtrl.populateItemList(items);
      }

      /**
       * Get total calories
       */
      const totalCalories = ItemCtrl.getTotalColories();

      /**
       * add total calories to ui
       */
      UICtrl.showTotalCalories(totalCalories);

      /**
       * load event listeners
       */
      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

/* *
 * Initialize App
 */
App.init();
