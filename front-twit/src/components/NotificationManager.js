import { useState } from "react";
import { urlB64ToUint8Array } from "../utils";


const Public_Key = 'BMmFlSzEVHh2_fiHvO6F3ea9Rp6G8_5wyPpB7oltj2MMu3l6bjl-iehMKHZSoByEwAQ-p-KBeuP3T6cAShFpH08'

function NotificationManager(props){
    const [subscribed, setSubscribed] = useState(
        Notification.permission === "granted"
    );

    async function subscribe(){
        const result = await Notification.requestPermission();
        if(result === "granted"){
            const serviceWorker = await navigator.serviceWorker.ready;

            let subscription = await serviceWorker.pushManager.getSubscription();
            if (subscription === null){
                const subscriptionOptions = {
                    userVisibleOnly: true,
                    applicationServerKey: urlB64ToUint8Array(Public_Key),
                }

                subscription = await serviceWorker.pushManager.subscribe(subscriptionOptions);
            }
            
            const response = await fetch('http://127.0.0.1:9000/api/subscriptions',{
                method:'POST',
                body: JSON.stringify(subscription),
                headers: {'Content-Type': 'application/json'} 
            });

            if(response.ok){
                new Notification("Merci",{body:"Vous etês abonnés :)"} )
            }else{
                alert("Error lors de l'enregistrement de l'abonnement")
            }
        }
    }

    async function testNotification(){
        const options = {
            body:"Le corps de la notif",
            icon: "favicon.ico"
        }
        new Notification('test',options);
    }

    if(subscribed){
        return (
            <div className="p-3 fixed-bottom end-0">
                <button onClick={testNotification} type='button' className="btn btn-info">
                    Test notif
                </button>
            </div>
        )
    }

    return (
        <div className="p-3 fixed-bottom end-0">
            <button onClick={subscribe} className="btn btn-info">
                S'abonner aux notifications
            </button>
        </div>
    )

}

export default NotificationManager;