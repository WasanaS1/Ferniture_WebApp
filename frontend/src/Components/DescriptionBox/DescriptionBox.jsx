import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviwes (199)</div> 
        </div>
        <div className="descriptionbox-description">
                <p>Work in comfort with our Ergonomic Office Chair, designed to support your posture throughout the day.The breathable mesh back and padded seat provide additional comfort and ventilation.
                </p>
                <p> This chair features adjustable height, tilt, and lumbar support to ensure you stay comfortable during long hours at your desk.</p>
        </div>
    </div>
    
  )
}

export default DescriptionBox