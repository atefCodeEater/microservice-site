import 'bootstrap/dist/css/bootstrap.css'
import clientBuild from "../api/client-build";
import Header from "../Components/Header";

const AppComponent= ({Component,pageProps,currentUser})=>{
  return( <div>
    
    <Header currentUser={currentUser}/> 
    <Component {...pageProps}/>
  </div>)
}
  
AppComponent.getInitialProps=async(appContext)=>{
  console.log(appContext)

const client = clientBuild(appContext.ctx)

const {data} =await client.get("/api/users/currentuser")

let pageProps={}
if(appContext.Component.getInitialProps){

  pageProps=await appContext.Component.getInitialProps(appContext.ctx)
}
console.log(data)
return {
  currentUser:data.currentUser,
  pageProps
}

}

export default AppComponent