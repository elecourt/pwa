const weekdays = [
    "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"
]

function Agenda(props){
    return (
        <div className="m-3">
            <ul>
            {/*weekdays*/}
            {weekdays.map((day) => (
                <li key={day} className={day == props.day && "fw-bold"}>{day.toUpperCase()}</li>
            ))}
            </ul>
        </div>
    )
}

export default Agenda;