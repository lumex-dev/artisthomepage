const burger = document.querySelector(".menuIcon");
const navList = document.querySelector(".navList");

burger.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("open");
    burger.setAttribute("aria-expanded", isOpen);
});