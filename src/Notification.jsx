import React, {useState, useEffect} from 'react';
import Header from './Header';
import axios from "axios";
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [viewed, setViewed] = useState(1);
  const [loading, setLoading] = useState(true)
  const history = useHistory() 
  
  
  
  const getNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/posts/get-notifications`, {
        withCredentials: true
      });
      
      setNotifications(res.data);
    } catch (err) {
      console.log("Error fetching notifications:", err);
      
       
    } 
  };
  const viewedNotification = async (orderNumber) => {
    try {
      const res = await axios.put(`http://localhost:3000/posts/viewed-notification`, {viewed, orderNumber}, {
        withCredentials: true
      });
 
    } catch (err) {
      console.log("Error fetching notifications:", err);
      if(err.response.data){
        history.push("/login");
      }
      
       
    } 
  };

  const ridirect = (orderNumber) => {
  viewedNotification(orderNumber);
  history.push(`/view-notification/${orderNumber}`);
  }

  useEffect(() => {
    
    getNotifications();
     

    setLoading(false);
   }, [loading])

   return(<>
{loading ? "loading..." : <div className="bg-background-light dark:bg-background-dark min-h-screen text-[#0d131b] dark:text-slate-200">
<div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
  <Header/>
<main className="flex-1 w-full max-w-[960px] mx-auto py-8 px-4">
{/* <!-- Page Heading & Actions --> */}
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
<div>
<h1 className="text-[#0d131b] dark:text-white text-3xl font-black tracking-tight">Notifications Center</h1>
<p className="text-slate-500 text-sm mt-1">Manage your updates and alerts</p>
</div>

</div>
 
{/* <!-- Notifications List --> */}
<div className="flex flex-col gap-px bg-slate-200 dark:bg-slate-800 rounded-b-xl overflow-hidden border-x border-b border-slate-200 dark:border-slate-800">
{/* <!-- Unread Notification --> */}
{notifications.map(items => (

<div onClick={() => ridirect(items.orderNumber)} key={items.id} className={`flex items-start gap-4 ${items.viewed === viewed ? 'bg-white hover:bg-gray-100' : 'bg-blue-50/50 hover:bg-blue-50'}  dark:bg-primary/5 px-4 py-5  dark:hover:bg-primary/10 transition-colors cursor-pointer group`}>
<div className="flex-shrink-0 relative">
<div className="text-primary flex items-center justify-center rounded-xl bg-primary/10 size-12">
<span className="material-symbols-outlined">package_2</span>
</div>
{items.viewed === viewed ? "" :  <div className="absolute -top-1 -right-1 size-3 bg-primary rounded-full border-2 border-white dark:border-slate-900"></div> }
</div>
<div className="flex flex-col flex-1 min-w-0">
<div className="flex justify-between items-start gap-2">
<p className="text-[#0d131b] dark:text-white text-base font-bold leading-tight truncate">Your order on #{items.orderNumber} have shipped!</p>
<span className="text-slate-400 text-xs font-medium whitespace-nowrap">2 hours ago</span>
</div>
<p className="text-slate-600 dark:text-slate-400 text-sm font-normal mt-1 leading-relaxed">Great news! Order #{items.orderNumber} is on its way. You can track your package via the link below.</p>
<div className="flex gap-2 mt-3">
<button className="text-primary text-xs font-bold hover:underline">Track Order</button>
</div>
</div>
<button className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 transition-opacity">
<span className="material-symbols-outlined text-lg">more_horiz</span>
</button>
</div>
))}
 
</div>
<div className="flex justify-center mt-8">
 
</div>
</main>
 
</div>
</div>
}  
</>


  )
}

export default Notification