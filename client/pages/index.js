import ClientBuild from "../api/client-build";

const LandingPage=({currentUser})=>{
  
  console.log(currentUser)
 return currentUser? <h1>شما ثبت نام کرده اید</h1> : <h1>شما ثبت نام نکرده اید</h1>

}


LandingPage.getInitialProps=async(context)=>{
  console.log("landing page")
  const client=ClientBuild(context)
  
  const {data} =await client.get("/api/users/currentuser")
  
  return data
  
}
export default LandingPage         