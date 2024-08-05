import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import fimage1 from '../images/006-credit-card.svg';
import fimage2 from '../images/007-piggy-bank.svg';
import fimage3 from '../images/6.svg';
import fimage4 from '../images/003-notes.svg';
import additional1 from '../images/additional1.png';
import additional2 from '../images/additional2.png';

// Dữ liệu mẫu cho từng dịch vụ
const serviceData = {
  card: {
    images: [fimage1, additional1, additional2, fimage4],
    title: "Card",
    description: "Flexible credit and debit card options.",
    headerText: "Credit Card Services"
  },
  saving: {
    images: [fimage2, additional1, additional2, fimage4],
    title: "Saving",
    description: "Effective savings solutions to grow your wealth.",
    headerText: "Saving Solutions"
  },
  shopping: {
    images: [fimage3, additional1, additional2, fimage4],
    title: "Shopping Banking",
    description: "Seamless integration for shopping and banking.",
    headerText: "Shopping and Banking"
  },
  security: {
    images: [fimage4, additional1, additional2],
    title: "Security",
    description: "Advanced security measures to safeguard your finances.",
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
      <Navbar />
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
              <p>{service.description}</p>
              {showMore && <p>{service.description}</p>}
              <button className="read-more-button" onClick={handleReadMore}>
                {showMore ? "Show Less" : "Read More"}
              </button>
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
