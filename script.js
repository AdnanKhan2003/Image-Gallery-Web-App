const inputSearch = document.querySelector(".hero__input");
const form = document.querySelector(".hero__form");
const apiKey = "R0Ntezr4YMe7kFEIMZAJW8VHO8Q2m2gKROidREdkhpRQb7k6hMq95Ti8";
const url = "https://api.pexels.com/v1/curated?";
const urlSearch = "https://api.pexels.com/v1/";
const btnDownload = document.querySelector(".details fa-download");
const windowLighthouse = document.querySelector(".lighthouse");
const btnClose = document.querySelector(".close-menu");
const btnPreviewDownload = document.querySelector(".preview__download");

const lighthousePName = document.querySelector(".photographer__name");
const lighthouseImg = document.querySelector(".img");

let currentPage = 1;
const perPage = 15;
const imageWrapper = document.querySelector(".images");
const btnLoadMore = document.querySelector(".load__more");
// let imgLink, photographer;
// let downloadIndex = [];
let query;
const getJSON = async function (url) {
  const res = await fetch(url, {
    headers: { Authorization: apiKey },
  });
  const data = await res.json();
  return data;
};

const getSearchQuery = function () {
  query = inputSearch.value;
  inputSearch.value = "";
  return query;
};

// class Op {
//   constructor(downloadI, srcUrl, name) {
//     this.downloadI = downloadI;
//     this.srcUrl = srcUrl;
//     this.name = name;
//   }
// }

const generateHTML = function (data) {
  imageWrapper.innerHTML += data
    .map((img) => {
      // imgLink = img.src.large2x;
      // photographer = img.photographer;
      // downloadIndex.push(new Op(i + 1, img.src.large2x, img.photographer));
      return `<li class="cards" onclick="showLightHouse('${img.src.large2x}', '${img.photographer}')">
      <img src="${img.src.large2x}" alt="${img.alt}" />
      <div class="details">
        <div class="photographer">
          <i class="fa-solid fa-camera main-download"></i>
          <span class="photographer__name">${img.photographer}</span>
        </div>
        <i class="fa-solid fa-download" onclick="downloadImg('${img.src.large2x}')" ></i>
      </div>
    </li>
      `;
    })
    .join("");
};

const hideLightHouse = function () {
  windowLighthouse.classList.add("hidden");
  document.body.style.overflow = "auto";
};
btnClose.addEventListener("click", hideLightHouse);

const showLightHouse = function (url, name) {
  console.log(url);
  console.log(name);
  windowLighthouse.querySelector("span").innerText = name;
  windowLighthouse.querySelector("img").src = url;
  btnPreviewDownload.setAttribute("data-url", url);
  windowLighthouse.classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

const controlApp = async function (url) {
  btnLoadMore.innerText = "... Loading";
  btnLoadMore.classList.add("disabled");

  const apiUrl = await getJSON(url);
  console.log(apiUrl);

  generateHTML(apiUrl.photos);

  btnLoadMore.innerText = "Load More";
  btnLoadMore.classList.remove("disabled");
};
controlApp(`${url}page=${currentPage}&per_page=${perPage}`);

const loadMoreImages = function (e) {
  e.preventDefault();
  currentPage++;
  let apiUrl = `${url}page=${currentPage}&per_page=${perPage}`;
  apiUrl = query
    ? `https://api.pexels.com/v1/search?query=${query}&page=${currentPage}&per_page=${perPage}`
    : apiUrl;
  controlApp(apiUrl);
};

const renderSearchRes = function (e) {
  e.preventDefault();
  const query = getSearchQuery();
  currentPage = 1;
  imageWrapper.innerHTML = "";
  //const url = "https://api.pexels.com/v1/curated?";

  controlApp(
    `https://api.pexels.com/v1/search?query=${query}&page=${currentPage}&per_page=${perPage}`
  );
};

const downloadImg = async function (url) {
  const res = await fetch(url);
  const file = await res.blob();

  const a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = new Date().getTime();
  a.click();
};

btnLoadMore.addEventListener("click", loadMoreImages);
form.addEventListener("submit", renderSearchRes);
// imageWrapper.addEventListener("click", function (e) {
//   const data = downloadIndex.filter((obj) => {
//     console.log(obj.downloadI);
//     return obj.downloadI === +e.target.dataset.no;
//   });
//   console.log(data);
//   const link = data[0].srcUrl;
//   console.log(e.target.dataset.no);

//   downloadImg(link);
// });

btnPreviewDownload.addEventListener("click", (e) =>
  downloadImg(e.target.dataset.url)
);
