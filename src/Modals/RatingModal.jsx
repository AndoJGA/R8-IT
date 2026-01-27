import { useState } from 'react';
import { calculateShowRating } from '../Services/rating.js';
import '../Css/modal.css'

const RatingModal = ({onClose, onSaveRating}) => {

    const [E, setE] = useState(5);
    const [S, setS] = useState(5);
    const [V, setV] = useState(5);
    const [A, setA] = useState(5);
    const [P, setP] = useState(5);

    const ratingData = () => {
        const finalValue = ((E*0.2)+(S*0.4)+(V*0.15)+(A*0.15)+(P*0.1));
        onSaveRating(finalValue);
    }

    return (
        <div className="modal-container" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Rate This Content</h2>
                </div>

                <div className="modal-main">
                    <div className="rating-aspect">
                        <h4>Enjoy</h4>
                        <input type="number" min="1" max="10" value={E} onChange={(e) => setE(Number(e.target.value))} />
                    </div>
                    <div className="rating-aspect">
                        <h4>Story</h4>
                        <input type="number" min="1" max="10" value={S} onChange={(e) => setS(Number(e.target.value))}/>
                    </div>
                    <div className="rating-aspect">
                        <h4>Visuals</h4>
                        <input type="number" min="1" max="10" value={V} onChange={(e) => setV(Number(e.target.value))}/>
                    </div>
                    <div className="rating-aspect">
                        <h4>Audio</h4>
                        <input type="number" min="1" max="10" value={A} onChange={(e) => setA(Number(e.target.value))}/>
                    </div>
                    <div className="rating-aspect">
                        <h4>Pacing</h4>
                        <input type="number" min="1" max="10" value={P} onChange={(e) => setP(Number(e.target.value))}/>
                    </div>
                </div>

                <div className="modal-footer">
                    <button onClick={ratingData}>Rate</button>
                </div>
            </div>
        </div>
    )
};

export default RatingModal;