import axios from "axios";
import { useState } from "react";

export default ({url,method,body,doSuccess})=>{

  const [errors,setError] = useState(null)

const doRequest=async()=>{

  try {
    setError(null)
   const response =await axios[method](url,body)
  
    if(doSuccess){

      doSuccess(response.data)
    }


   return response.data

  } catch (err) {
   
    setError(
      <div className="alert alert-danger">

<ul className="my-0">
{err.response.data.error.map((err)=>(

  <li key={err.message} > {err.message} </li>
))}
</ul>

</div>
    )

  }
}
return {doRequest,errors}

}