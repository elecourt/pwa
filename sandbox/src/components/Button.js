function Button(props) {

    const a = (1 + 1 == 2) ? "bravo les maths" : "null";
    const b = (1 + 1 == 2) && "oui bravo les maths"; 
    const c = (1 + 1 == 2) || "nul les maths";

    return(
        <div>
            {props.onClick ?
                <button 
                    className={"btn" + props.className}
                    type="button"
                    onClick={props.onClick}
                >
                    {props.name || "Click me"} {props.yelling && "!!!"}
                </button>
            :
                <a  href={props.link}
                className={"btn " + (props.className || "btn-primary")}
                target="_blank"
                >
                {props.name || "Click me"} {props.yelling && "!!!"}
                </a>
            }
        </div>
    );
}

export default Button;