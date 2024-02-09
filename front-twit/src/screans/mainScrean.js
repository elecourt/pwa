import { useState, useEffect } from 'react';
import{ openDB } from 'idb';

import Spinner from '../components/Spinner';

const API_URL = "http://localhost:9000/api/tweets"

function Tweets(){

    const [tweets, setTweets] = useState([]);

    async function fetchData(){
        const response = await fetch(API_URL);
        const data = await response.json();
        setTweets(data);
    }

    async function addTweet(event){
        event.preventDefault();
        
        const json = {"title":event.target[0].value,"message":event.target[1].value}

        try{
            const response = await fetch(
                API_URL,{
                   'method': 'POST',
                   'body': JSON.stringify(json),
                   'headers': {
                    'Content-Type': 'application/json'
                   } 
                }
            );
            if(response.ok){
                setTweets([json, ...tweets]);
            } else{
                console.error("Error",response); 
            }
        }catch(error){
            alert("pas de connection internet");
            saveLater(json);
        }
    }

    useEffect(() => {
        fetchData()
      }, []);

    if(tweets.length === 0){
        return (
            <Spinner />
        )
    }

    async function saveLater(json){
        const dataBase = await openDB(
            //dbname
            //version
            //options
            "twwetsmessage",
            1,
            {
                upgrade(db){
                    db.createObjectStore('tweets',{keyPath: 'id',autoIncrement: true})
                }
            }
        );
        await dataBase.add('tweets', json);

        const serviceWorker = await navigator.serviceWorker.ready;
        await serviceWorker.sync.register('sync-new-post');
    }

    return (
        <div className="my-3">
            <form onSubmit={addTweet} method="post">
                <ul>
                    <li>
                        <label for="title">Title&nbsp;:</label>
                        <input type="text" id="title" />
                    </li>
                    <li>
                        <label for="message">Message&nbsp;:</label>
                        <textarea id="message" ></textarea>
                    </li>
                </ul>
                <button type='submit' className="button button-primary" >Poster</button>
            </form>

            {tweets.map((tweet) => {
                return (
                    <div className="card" id={tweet.title}>
                    <h5 className="card-title text-center text-capitalize">{tweet.title}</h5>
                        <div className="card-body">
                        <p>{tweet.message}</p> 
                        </div>
                    </div>   
                )
            })}
          
        </div>
      );
}
export default Tweets;