import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
 //import Navbar from './Navbar';


import thẻ1 from '../images/thẻ1.png';
import thẻ2 from '../images/thẻ2.png';
import thẻ3 from '../images/thẻ3.png';
import traothẻ1 from '../images/traothẻ1.jpg';

import saving1 from '../images/s1.jpg';
import saving2 from '../images/s2.jpg';
import saving3 from '../images/s3.jpg';
import traothẻ2 from '../images/s4.jpg';

import shopping1 from '../images/sop1.jpg';
import shopping2 from '../images/sop2.jpg';
import shopping3 from '../images/sop3.jpg';
import traothẻ3 from '../images/sop4.jpg';

import security1 from '../images/sc1.jpg';
import security2 from '../images/sc2.jpg';
import security3 from '../images/sc3.jpg';
import traothẻ4 from '../images/sc4.jpg';

const serviceData = {
  card: {
    images: [thẻ1, thẻ2, thẻ3, traothẻ1],
    title: "Experience unparalleled convenience with a bank card",
    description: `Fast Payments:  Swift, cash-free transactions worldwide.
Expense Tracking:  Monitor spending with detailed statements and alerts.
Enhanced Security:  Enjoy fraud protection and safe online shopping.
Financial Flexibility:  Access credit for emergencies and international use.
Exclusive Rewards:  Earn points, cash back, and special offers.
Build Credit:  Improve your credit history with responsible use.
Apply today and transform your financial experience!
`,
    headerText: "Credit Card Services"
  },
  saving: {
    images: [saving1, saving2, saving3, traothẻ2],
    title: "Earn Interest on Your Money",
    description: `Unlike keeping your money idle at home, a savings account allows you to earn interest.Banks pay interest on the balance in your account, which means your money grows over time. While the interest rates may vary, even a small amount of interest contributes to increasing your savings, helping you achieve your financial goals more effectively.`,
    headerText: "Saving Solutions"
  },
  shopping: {
    images: [shopping1, shopping2, shopping3,traothẻ3],
    title: "Unmatched Convenience",
    description: `Online shopping revolutionizes the way we purchase goods and services. With just a few clicks, you can explore a vast array of products from around the world, all from the comfort of your home. No longer do you need to navigate crowded malls or adhere to store hours. Whether you’re looking for the latest fashion trends, electronics, or groceries, online platforms are available 24/7, allowing you to shop at your own pace and on your own schedule.`,
    headerText: "Shopping and Banking"
  },
  security: {
    images: [security1, security2, security3, traothẻ4],
    title: "Safety and Security",
    description: `When you deposit your money into a bank savings account, it is protected by the bank's security measures and insurance schemes. Most banks are insured by government agencies (such as the FDIC in the U.S.), ensuring that your deposits are safe up to a certain limit. This protection is far superior to keeping large sums of cash at home, where it is vulnerable to theft, loss, or damage.`,
    headerText: "Security Measures"
  }
};

function DetailPage() {
  const { serviceId } = useParams();
  const service = serviceData[serviceId] || {};

  const [currentImage, setCurrentImage] = useState(service.images ? service.images[0] : '');
  const [headerText] = useState(service.headerText || '');
  const [showMore, setShowMore] = useState(false);

  const handleReadMore = () => {
    setShowMore(!showMore);
  };

  const [firstImage, secondImage, thirdImage, fourthImage] = service.images || [];

  return (
    <div className="detail-page">
      {/* <Navbar /> */}
      <div className="detail-content">
        <div className="images-section">
          <div className="image-row">
            {firstImage && <img src={firstImage} alt="First" className="thumbnail" />}
            {secondImage && <img src={secondImage} alt="Second" className="thumbnail" />}
            {thirdImage && <img src={thirdImage} alt="Third" className="thumbnail" />}
          </div>
          <div className="image-text-column">
            {fourthImage && (
              <div className="small-image-container">
                <img src={fourthImage} alt="Fourth" className="small-image" />
              </div>
            )}
            <div className="text-column">
              <h1>{headerText}</h1>
              <p className="highlighted-text">{service.title}:</p> {/* Tô đậm chữ chính */}
              <p>{service.description}</p>
              {/* {showMore && <p>{service.description}</p>}  show them 
              <button className="read-more-button" onClick={handleReadMore}>
                {showMore ? "Show Less" : "Read More"}
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;








// import React from 'react';
// import { useParams } from 'react-router-dom';
// import fimage1 from '../images/006-credit-card.svg';
// import fimage2 from '../images/007-piggy-bank.svg';
// import fimage3 from '../images/6.svg';
// import fimage4 from '../images/003-notes.svg';

// // Dữ liệu mẫu cho từng dịch vụ
// const serviceData = {
//   card: {
//     image: fimage1,
//     title: "Card",
//     description: "Flexible credit and debit card options.",
//   },
//   saving: {
//     image: fimage2,
//     title: "Saving",
//     description: "Effective savings solutions to grow your wealth.",
//   },
//   shopping: {
//     image: fimage3,
//     title: "Shopping Banking",
//     description: "Seamless integration for shopping and banking.",
//   },
//   security: {
//     image: fimage4,
//     title: "Security",
//     description: "Advanced security measures to safeguard your finances.",
//   }
// };

// function DetailsPage() {
//   const { serviceId } = useParams();
//   const service = serviceData[serviceId] || {};

//   return (
//     <div className="detail-page">
//       <h1>{service.title}</h1>
//       <div className="detail-content">
//         <div className="image-column">
//           <img src={service.image} alt={service.title} />
//         </div>
//         <div className="text-column">
//           <p>{service.description}</p>
//           <button className="read-more-button">Read More</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DetailsPage;
