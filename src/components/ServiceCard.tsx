// import type { Service } from '../types/service'
// import '../styles/ServiceCard.css'

// interface Props {
//     service: Service
//     onClose?: () => void
// }

// export default function ServiceCard({ service, onClose }: Props) {
//     return (
//         <article className="service-card">
//             <button
//                 type="button"
//                 className="service-card__close"
//                 aria-label="Close service card"
//                 onClick={onClose}
//             >
//                 ×
//             </button>

//             <div className="service-card__handle" />

//             <div className="service-card__inner">
//                 <div className="service-card__top">
//                     <div className="service-card__info">
//                         <span className="service-card__category">{service.category}</span>
//                         <h3 className="service-card__title">{service.title}</h3>
//                         <p className="service-card__subtitle">Nearby service • 3.0 km</p>
//                     </div>

//                     <img
//                         src={service.image}
//                         alt={service.title}
//                         className="service-card__image"
//                     />
//                 </div>

//                 <div className="service-card__stats">
//                     <div className="service-card__stat">
//                         <span className="service-card__stat-label">RATING</span>
//                         <strong className="service-card__stat-value">4.8 / 5</strong>
//                     </div>

//                     <div className="service-card__stat">
//                         <span className="service-card__stat-label">OPEN HOURS</span>
//                         <strong className="service-card__stat-value">11:00 - 23:00</strong>
//                     </div>
//                 </div>

//                 <p className="service-card__description">
//                     {service.description}
//                 </p>

//                 <div className="service-card__actions">
//                     <button type="button" className="service-card__book">
//                         Book Now
//                     </button>

//                     <button type="button" className="service-card__profile">
//                         View Profile
//                     </button>
//                 </div>
//             </div>
//         </article>
//     )
// }