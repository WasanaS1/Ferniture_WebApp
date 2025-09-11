import React, { useEffect, useState } from 'react';
import './NewCollections.css';
import Item from '../Item/Item';

const NewCollections = () => {
    const [new_collection, setNew_collection] = useState([]);

    useEffect(() => {
        const backendUrl = process.env.NODE_ENV === 'production' 
            ? 'https://ferniture-webapp-backend.onrender.com'
            : 'http://localhost:4000';
            
        fetch(`${backendUrl}/newcollection`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data); // Log the fetched data to see the structure
                setNew_collection(data);
            })
            .catch((error) => {
                console.error("Error fetching new collections:", error);
            });
    }, []);

    // Frontend
    return (
        <div className='newcollections'>
            <div className='collections'>
                {new_collection.map((item, i) => {
                    return (
                        <Item 
                            key={i} 
                            id={item.id} 
                            name={item.name} 
                            image={item.image} 
                            new_price={item.new_price} 
                            old_price={item.old_price}
                            category={item.category}
                            rating={item.rating}
                            reviews={item.reviews}
                            inStock={item.inStock}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default NewCollections;
