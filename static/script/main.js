const featuresList = [
  {
    icon: staticUrl + "images/portfolio-svgrepo-com.svg",
    title: "Portfolio Analyzer",
    link: "http://127.0.0.1:8000/portfolio/portfolio_dashboard/",
  },

  {
    icon: staticUrl + "images/chatbot.png", 
    title: "StockEye Assistant", 
    link: "http://127.0.0.1:8000/market/stockai/",
  },

  {
    icon: staticUrl + "images/market-news-newspaper-svgrepo-com.svg",
    title: "Market Updates",
    link: "http://127.0.0.1:8000/market/market_update/",
  },

  {
    icon: staticUrl + "images/currency-exchange-svgrepo-com.svg",
    title: "Currency Exchanger",
    link: "http://127.0.0.1:8000/currency/currency_check/",
  },
];



const testimonialsList = [
  {
    review:
      "Since I started using the Stockoverflow Website, my Profit has raise up. The Risk Assesment feature is very useful. Highly recommended!",
    image:  staticUrl +"images/testimonial1.png",
    name: "John Smith",
    designation: "Groww, CEO",
  },
  {
    review:
      "This Website has completely changed the way I Use to work with the stocks. The Portfolio analyzer Feature gives the accurate graph which is vey useful. I can't imagine my Portfolio without it!",
    image: staticUrl + "images/testimonial2.png",
    name: "Sarah Johnson",
    designation: "Zerodha, CEO",
  },
  {
    review:
      "I've tried several Websites like it, but this one takes the cake. The Tax assistant and the Currency Exchanger Feature is one eof the best in it",
    image: staticUrl + "images/testimonial3.png",
    name: "Emily Davis",
    designation: "Upstocks , CEO",
  },
];

const plans = [
  {
    name: "Krish Sandhu",
    features: [
      "",
    ],
    price: "",
    link: "https://www.linkedin.com/in/krish-sandhu-6778a2229/",
  },

  {
    name: "Arnav Bhardwaj",
    features: [
      "",
    ],
    price: "",
    link: "https://www.linkedin.com/in/arnav-bhardwaj-448a21316/",
  },

  {
    name: "Shreya Yadav",
    features: [
      "",
    ],
    price: "",
    link: "https://www.linkedin.com/in/shreya-yadav-918b01323/",
  },

  {
    name: "Ayush Pandey",
    features: [
      "",
    ],
    price: "",
    link: "https://www.linkedin.com/in/ayush-pandey-9a3a4a2ba/",
  },
];

const featuresContent = document.querySelector("#features .content");
const testimonialCard = document.querySelector(
  "#testimonials .testimonial-card"
);
const prevBtn = document.querySelector("#testimonials .prev-btn");
const nextBtn = document.querySelector("#testimonials .next-btn");
const pricingContent = document.querySelector("#pricing .content");
const menuIcon = document.querySelector(".menu-icon");
const mobileNavMenu = document.querySelector(".mobile-nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
let currentTestimonialIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  let isAuthenticated = false;

  fetch("http://127.0.0.1:8000/accounts/auth_status/")
      .then(response => response.json())
      .then(data => {
          isAuthenticated = data.is_authenticated;
          displayFeatures(); 
      })
      .catch(error => console.error("Error fetching auth status:", error));

  const featuresContent = document.querySelector("#features .content");

  const displayFeatures = () => {
      featuresList.forEach((f) => {
          const featureCard = document.createElement("div");
          featureCard.classList.add("feature-card");

          if (isAuthenticated) {
              featureCard.innerHTML = `
                  <a href="${f.link}">
                      <div class="icon">
                          <img src="${f.icon}" alt="img" height="65px" width="65px" />
                      </div>
                      <h3>${f.title}</h3>
                  </a>`;
          } else {
              featureCard.innerHTML = `
                  <div class="icon">
                      <img src="${f.icon}" alt="img" height="65px" width="65px" />
                  </div>
                  <h3>${f.title}</h3>
                  <p>Login to Access</p>
                  `;
          }

          featuresContent.appendChild(featureCard);
      });

      // // Add event listeners to login buttons
      // document.querySelectorAll(".login-btn").forEach((button) => {
      //     button.addEventListener("click", () => {
      //         window.location.href = "http://127.0.0.1:8000/accounts/login/";
      //     });
      // });
  };
});


const displayTestimonial = () => {
  const html = 
  `<span class="quote-icon">
   <img src="${staticUrl}images/quote-icon.svg" alt="" />
</span>

<p class="review">
 ${testimonialsList[currentTestimonialIndex].review}
</p>

<div class="reviewer-info">
  <div class="image">
    <img src="${testimonialsList[currentTestimonialIndex].image}" alt="" />
  </div>

  <div class="details">
    <div class="name">${testimonialsList[currentTestimonialIndex].name}</div>
    <div class="designation">${testimonialsList[currentTestimonialIndex].designation}</div>
  </div>
</div>`
;

  testimonialCard.innerHTML = html;
  testimonialCard.classList.add("active");
};

displayTestimonial();

nextBtn.addEventListener("click", () => {
  testimonialCard.classList.remove("active");

  setTimeout(() => {
    currentTestimonialIndex++;
    if (currentTestimonialIndex >= testimonialsList.length) {
      currentTestimonialIndex = 0;
    }
    displayTestimonial();
  }, 200);
});

prevBtn.addEventListener("click", () => {
  testimonialCard.classList.remove("active");

  setTimeout(() => {
    currentTestimonialIndex--;
    if (currentTestimonialIndex < 0) {
      currentTestimonialIndex = testimonialsList.length - 1;
    }
    displayTestimonial();
  }, 200);
});

const displayPricing = () => {
  plans.forEach((p) => {
    const featuresHTML = p.features
      .map(
        (f) =>
          `<li><span class='icon'><img src='${staticUrl}images/check-icon.svg'/></span>${f}</li>`
      )
      .join("");

    const html = `<h4 class="plan-name">${p.name}</h4>
    <div class="plan-price">${p.price}</div>
    <a href="${p.link}" class="btn">LinkedIn</a>`;

    // // <ul class="plan-features">
    //   ${featuresHTML}
    // </ul>

    const plan = document.createElement("div");
    plan.classList.add("plan");
    plan.innerHTML = html;

    pricingContent.appendChild(plan);
  });
};

displayPricing();

menuIcon.addEventListener("click", () => {
  mobileNavMenu.classList.toggle("active");
});

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      const offset = targetElement.offsetTop - 60;
      window.scrollTo({ top: offset });
    }

    mobileNavMenu.classList.remove("active");
  });
});
