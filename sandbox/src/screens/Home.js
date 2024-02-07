import Button from '../components/Button.js';

function Home(props){

    const myButtonName = "Mon autre bouton"

    function onButtonPressed(){
        console.log("button was pressed");
    }

    return (
        <div>
            Hello World !!!
            <br></br>
            <Button 
                name="Mon bouton trop cool" 
                className="btn-primary" 
                onClick={onButtonPressed}
                yelling
            />

            <br></br>
            <Button 
                name={myButtonName}
                className="btn-secondary" 
                link="https://www.google.fr/"
            />
        </div>
    );
}

export default Home;