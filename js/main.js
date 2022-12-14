// Global variables
const categoryNav = document.getElementById("category-nav");
const cardsContainer = document.getElementById("cards-container");
const spinner = document.getElementById("spinner");
// Modal Variables
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDetails = document.getElementById("modal-details");
const modalCross = document.getElementById("modal-cross");
// IIFE for loading Categories
(async function () {
  const uri = "https://openapi.programming-hero.com/api/news/categories";
  try {
    const response = await fetch(uri);
    const data = await response.json();
    showCategory(data.data.news_category);
  } catch (err) {
    alert(err + ", Please check your Internet connection");
  } finally {
    // Load Breaking News by Default
    loadDefault();
  }
})();

function showCategory(categories) {
  categories.forEach(function (category) {
    const li = document.createElement("li");
    li.innerHTML = `
    <a id="${category.category_id}">${category.category_name}</a>
    `;
    categoryNav.appendChild(li);
  });
}

// Display if News found and how many
function countNewsOrEmpty(data, catagoryName) {
  const countNews = document.getElementById("count-news");
  if (data.length === 0) {
    countNews.innerText = `No news found for category ${catagoryName}`;
  } else {
    countNews.innerText = `${data.length} Items found for category ${catagoryName}`;
  }
}

// Display News When clicked on a category

categoryNav.addEventListener("click", function (e) {
  if (e.target.tagName === "A") {
    // show spinner
    spinner.classList.add("flex");
    spinner.classList.remove("hidden");
    // Load news
    const catagoryName = e.target.innerText;
    loadNews(e.target.id, catagoryName);
    // Clear active class on all buttons
    const navBtns = document.querySelectorAll("#category-nav>li>a");
    navBtns.forEach((btn) => btn.classList.remove("active"));
    // Add active class only on clicked button
    const btn = document.getElementById(e.target.id);
    btn.classList.add("active");
    // clear cardContainer
    cardsContainer.innerHTML = "";
  }
});

async function loadNews(category_id, catagoryName) {
  const uri = `https://openapi.programming-hero.com/api/news/category/${category_id}`;
  try {
    const response = await fetch(uri);
    const data = await response.json();
    const articles = data.data;
    // Sorting article based on views
    articles.sort((a, b) => b.total_view - a.total_view);
    showNews(articles);
    countNewsOrEmpty(data.data, catagoryName);
  } catch (err) {
    alert(err);
  }
}

function checkMaximumWords(texts) {
  if (texts.length > 500) {
    const trimedText = texts.slice(0, 500) + " ...";
    return trimedText;
  } else {
    return texts;
  }
}

function showNews(allNews) {
  // disable spinner
  spinner.classList.add("hidden");
  spinner.classList.remove("flex");
  //   Show news
  cardsContainer.innerHTML = "";
  if (allNews.length === 0) {
    const div = document.createElement("div");
    div.innerHTML = `<h2 class="text-xl text-center">Nothing to Show</h2>`;
    cardsContainer.appendChild(div);
  } else {
    allNews.forEach((news) => {
      const div = document.createElement("div");
      div.innerHTML = `
      <label id="${news._id}" onclick="getModalInfo('${
        news._id
      }')" for="my-modal-3">
        <div class="bg-white rounded-md shadow-sm my-6 cursor-pointer hover:shadow-md transition-shadow " >
        <div class="grid grid-cols-1 md:grid-cols-4 p-6">
          <!-- News Image -->
          <div class="mr-2 mb-4 md:mb-0">
            <img
              src="${news.thumbnail_url}"
              alt=""
              class="mx-auto md:mx-0"
            />
          </div>
          <!-- News Description -->
          <div class="col-span-3 flex flex-col justify-around">
            <h2
              class="text-articleHeadingColor text-xl md:text-2xl font-bold"
            >
              ${news.title}
            </h2>
            <p class="text-slate-700 text-md md:text-lg mt-2 md:mt-0">
             ${checkMaximumWords(news.details)}
            </p>
            <div
              class="flex justify-between flex-wrap items-center mt-4 md:mt-0"
            >
              <!-- Author -->
              <div class="text-articleRatingsColor flex">
                <img src="${
                  news.author.img
                }" alt="" class="w-12 mr-3 rounded-full" />
                <div class="flex flex-col text-slate-700">
                  <p class="font-medium">${
                    news.author.name ? news.author.name : "No data found"
                  }</p>
                  <p class="text-slate-400">${news.author.published_date}</p>
                </div>
              </div>
              <!-- Views -->
              <div class="font-bold text-xl text-slate-700 px-2">
                <i class="fa-regular fa-eye"></i>
                <span>${news.total_view ? news.total_view : "Not Found"}</span>
              </div>
              <!-- Star Ratings -->
              <div>
                  
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star-half-stroke"></i>
                <i class="fa-regular fa-star"></i>
              </div>
              <!-- arrow -->
    
              <i
                class="fa-solid fa-arrow-right text-blue-600 text-2xl hover:translate-x-1 cursor-pointer transition-all"
              ></i>
            </div>
          </div>
        </div>
      </div>
      </label>
        `;
      cardsContainer.appendChild(div);
    });
  }
}

// Modal Handlers
async function getModalInfo(news_id) {
  const uri = `https://openapi.programming-hero.com/api/news/${news_id}`;
  const response = await fetch(uri);
  const data = await response.json();
  showModal(data.data[0]);
}

function showModal(data) {
  //   Update Modal View
  modalImage.setAttribute("src", data.image_url);
  modalTitle.innerText = data.title;
  modalDetails.innerText = data.details;
}
// Clear modal image after pressing cross button
modalCross.addEventListener("click", () => modalImage.setAttribute("src", ""));

// Load Breaking news by default
function loadDefault() {
  // show spinner
  spinner.classList.add("flex");
  spinner.classList.remove("hidden");
  // Load news
  const catagoryName = "Breaking News";
  loadNews("01", catagoryName);
  // Clear active class on all buttons
  const navBtns = document.querySelectorAll("#category-nav>li");
  navBtns.forEach((btn) => btn.classList.remove("active"));
  // Add active class only on clicked button
  const btn = document.getElementById("01");
  btn.classList.add("active");
}
