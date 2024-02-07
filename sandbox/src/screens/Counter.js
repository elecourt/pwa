import { useState, useEffect } from 'react';

import Button from '../components/Button.js';

function Counter(props) {
    function increment() {
        setNumber(number + 1);
        //let newNumber = {...number}
    }

    const [number, setNumber] = useState(0);

    function changementBord() {
        console.log("rendu");
    }

    useEffect(changementBord, [number]);

    return (
        <div>
            <h3 className="text-center">Compteur</h3>
            <div className='d-flex justify-content-center'>
                <h4>{number}</h4>
                <div>
                    <Button
                        className="btn-secondary mx-5"
                        onClick= {increment}
                        name="incrémenter"
                    >
                    </Button>
                    <Button
                        className="btn-secondary mx-5"
                        onClick={() => setNumber(number - 1)}
                        name='décrémenter'
                    ></Button>
                </div>
            </div>
        </div>
    );
}

export default Counter;